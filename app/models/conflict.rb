class Conflict < ApplicationRecord
	belongs_to :scene
	has_many :resolutions, dependent: :destroy
  validate :no_other_active_conflicts_in_scene

  after_commit BroadcastChange.new(
    [ConflictsChannel],
    [
      [ScenesChannel, Proc.new(&:scene)],
      [GamesChannel, Proc.new(&:game)],
    ],
  )

	scope :failed, -> { joins(:resolutions).where(resolutions: {succeeded: false, state: :confirmed}) }
	scope :succeeded, -> { joins(:resolutions).where(resolutions: {succeeded: true, state: :confirmed}) }
  scope :active, -> { where.not(Resolution.confirmed.where("resolutions.conflict_id = conflicts.id").arel.exists) }

  def game
    scene.game
  end

	def dire?
		dire
	end

  def active_resolutions
    resolutions.rolled.not_overridden
  end

  def confirmed_resolution
    resolutions.confirmed.take
  end

  def active?
    resolutions.confirmed.none?
  end

  def succeeded?
    confirmed_resolution.try(:succeeded) or false
  end

  def resolved
    confirmed_resolution.try(:present?) or false
  end

  def no_other_active_conflicts_in_scene
    if self.active? and self.scene.conflicts.active.where.not(id: self.id).exists?
      errors.add(:base, "There is already another active conflict for this scene")
    end
  end
end
