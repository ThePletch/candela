class MartyrResolution < Resolution
	validates :parent_resolution, presence: true

	validate :resolves_dire_conflict

	delegate :dice_lost, to: :parent_resolution

	def narrative_control
		active_player
	end

	def successful?
		false
	end

	# martyring doesn't change rolls, so we just restate the results from the prior resolution
	def roll_for_player
		parent_resolution.player_dice_roll
	end

	def roll_for_gm
		parent_resolution.gm_dice_roll
	end

	private

	def resolves_dire_conflict
		self.conflict.dire?
	end
end
