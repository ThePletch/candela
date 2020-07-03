class Resolution < ApplicationRecord
	include AASM

	belongs_to :conflict
	has_one :scene, through: :conflict
	belongs_to :active_player, class_name: 'Participation'
	belongs_to :parent_resolution, class_name: 'Resolution'
	has_one :override, inverse_of: :parent_resolution

	# player who gets the hope die if the active player for this resolution dies
	belongs_to :beneficiary_player, class_name: 'Participation'

	scope :successful, -> { confirmed.where(failed: false) }
	scope :failed, -> { confirmed.where(failed: true) }
	scope :deadly, -> { joins(:conflict).where(conflict: {dire: true}) }

	# there can be only one confirmed resolution for a conflict, and that resolution
	# cannot have been overridden
	validates :state, distinct: { scope: :conflict }, if: :confirmed?
	validates :override, absence: true, if: :confirmed?

	aasm do
		state :rolled, initial: true, before_enter: :record_rolls!
		state :confirmed

		event :confirm do
			transitions from: :rolled, to: :confirmed
		end
	end

	def player_dice_pool
		scene.game.candles_lit(as_of: self.created_at) - dice_lost_in_past_scenes
	end

	def gm_dice_pool
		scene.game.candles_lit(as_of: self.created_at)
	end

	def dice_lost_in_past_scenes
		scene.resolutions.confirmed.where("created_at < ?", self.created_at).map(&:dice_lost).sum
	end

	# default logic implementations that can have new logic added in subclasses

	def successful?
		hope_dice_roll = player_dice_roll[0...active_player.hope_die_count]

		player_dice_roll.include?('6') or hope_dice_roll.include?('5')
	end

	def dice_lost
		# player can't lose hope dice, so exclude them.
		losable_dice = player_dice_roll[active_player.hope_die_count..-1]

		losable_dice.count('1')
	end

	def narrative_control
		player_dice_roll.count('6') > gm_dice_roll.count('6') ? active_player : scene.game.gm
	end

	def record_rolls!
		self.update(player_dice_roll: roll_for_player, gm_dice_roll: roll_for_gm)
	end

	def roll_for_player
		(0...player_dice_pool).collect{ self.get_single_die_roll }
	end

	def roll_for_gm
		(0...gm_dice_pool).collect{ self.get_single_die_roll }
	end

	def get_single_die_roll
		Random.rand(6).to_s
	end

	def no_overrides
		self.override.nil?
	end
end
