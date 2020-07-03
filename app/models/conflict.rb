class Conflict < ApplicationRecord
	belongs_to :scene
	has_many :resolutions

	scope :failed, -> { joins(:resolutions).where(resolutions: {failed: true}) }
	scope :succeeded, -> { joins(:resolutions).where(resolutions: {failed: false, state: :confirmed}) }

	def dire?
		dire
	end
end
