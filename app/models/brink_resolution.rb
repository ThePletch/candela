class BrinkResolution < Resolution
	validates :parent_resolution, presence: true
	validates :burned_trait_type, absence: true

	validate :same_active_player

	# embracing brink rerolls the entire player dice pool, so we use the default roll
	# method for that, but the gm dice pool remains untouched
	def roll_for_gm
		parent_resolution.gm_roll_result
	end

	private

	def same_active_player
		unless parent_resolution.active_player == self.active_player
			self.errors.add(:resolution_id, "Can't reroll someone else's roll")
		end
	end
end
