class TraitResolution < Resolution
	validates :parent_resolution, presence: true
	validates :burned_trait_type, presence: true
	validates :burned_trait_type, inclusion: { in: %w(0 1)}
	validates :burned_trait_type, uniqueness: { scope: :active_player }

	# reroll ones
	def roll_for_player
		parent_resolution.player_dice_roll.map do |result|
			result == '1' ? self.get_single_die_roll : result
		end
	end

	def roll_for_gm
		parent_resolution.gm_dice_roll
	end
end
