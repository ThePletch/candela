class BrinkResolution < Resolution
	validates :parent_resolution, presence: true

	validate :same_active_player

	# embracing brink rerolls the entire player dice pool, so we use the default roll
	# method for that, but the gm dice pool remains untouched
	def roll_for_gm
		parent_resolution.gm_dice_roll
	end

	private

	# players can only embrace their brink to reroll their own actions
	def same_active_player
		parent_resolution.active_player == self.active_player
	end
end
