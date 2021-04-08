class TraitResolution < Resolution
	validates :parent_resolution, presence: true
	validates :burned_trait_type, presence: true, inclusion: { in: ['0', '1'] }, uniqueness: { scope: :active_player }
	validate :same_active_player
	validate :parent_roll_must_have_ones_to_reroll
	validate :burned_trait_must_be_on_top

	# reroll ones
	def roll_for_player
		parent_resolution.player_roll_result.chars.map do |result|
			result == '1' ? self.get_single_die_roll : result
		end.join
	end

	def roll_for_gm
		parent_resolution.gm_roll_result
	end

	private

	def burned_trait_must_be_on_top
		if burned_trait_type.present? and active_player.top_trait_id(as_of: self.created_at) != burned_trait_type
			self.errors.add(:burned_trait_type, "Can't burn a trait not on top of your stack")
		end
	end

	def same_active_player
		if parent_resolution.try(:persisted?) and parent_resolution.active_player != self.active_player
			self.errors.add(:resolution_id, "Can't reroll someone else's roll")
		end
	end

	def parent_roll_must_have_ones_to_reroll
		if parent_resolution.try(:persisted?) and parent_resolution.player_roll_result.exclude?('1')
			self.errors.add(:resolution_id, "There are no ones to reroll in this roll")
		end
	end
end
