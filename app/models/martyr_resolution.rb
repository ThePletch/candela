class MartyrResolution < Resolution
	validates :parent_resolution, presence: true
	validates :burned_trait_type, absence: true

	validate :resolves_dire_conflict
	validate :different_active_player_in_parent
	validate :parent_failed

	delegate :dice_lost, to: :parent_resolution

	def narrative_control
		active_player
	end

	def successful?
		false
	end

	# martyring doesn't change rolls, so we just restate the results from the prior resolution
	def roll_for_player
		parent_resolution.player_roll_result
	end

	def roll_for_gm
		parent_resolution.gm_roll_result
	end

	private

	def resolves_dire_conflict
		if not self.conflict.dire?
			errors.add(:conflict_id, "Can't martyr yourself in a non-dire conflict")
		end
	end

	def different_active_player_in_parent
		if self.parent_resolution.active_player == self.active_player
			errors.add(:player_id, "Can't martyr yourself to save yourself")
		end
	end

	def parent_failed
		if self.parent_resolution.successful?
			errors.add(:resolution_id, "Can't martyr yourself over a successful conflict")
		end
	end
end
