class Scene < ApplicationRecord
	belongs_to :game
	has_many :conflicts

	validate :game_ready?

	scope :failed, -> (joins(conflicts: :resolutions).where(resolutions: {failed: true}))
	scope :succeeded, -> (joins(conflicts: :resolutions).where(resolutions: {failed: false}))
	scope :failed_as_of, ->(timestamp) (failed.where("resolutions.created_at < ?", timestamp))

	def failed?
		conflicts.failed.any?
	end

	def game_ready?
		game.setup_state_ready?
	end

	def dice_lost
		resolutions.confirmed.map(&:dice_lost).sum
	end
end
