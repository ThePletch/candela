class Resolution < ApplicationRecord
	include AASM

	belongs_to :conflict
	has_one :scene, through: :conflict
	belongs_to :active_player, class_name: 'Participation', inverse_of: :resolutions, foreign_key: 'player_id'
	belongs_to :parent_resolution, class_name: 'Resolution', foreign_key: 'resolution_id', optional: true
	has_one :override, class_name: 'Resolution', foreign_key: 'resolution_id', inverse_of: :parent_resolution

	# player who gets the hope die if the active player for this resolution dies
	belongs_to :beneficiary_player, class_name: 'Participation', foreign_key: 'beneficiary_player_id', optional: true

	validate :cannot_override_an_override

  after_commit BroadcastChange.new([ResolutionsChannel])

	scope :successful, -> { confirmed.where(succeeded: true) }
	scope :failed, -> { confirmed.where(succeeded: false) }
	scope :deadly, -> { joins(:conflict).where(conflicts: {dire: true}) }
	scope :created_before, ->(timestamp) { where("resolutions.created_at < ?", timestamp) }
	scope :not_overridden, -> { joins("LEFT OUTER JOIN resolutions AS children on resolutions.id = children.resolution_id").where("children.id IS NULL") }

	# there can be only one confirmed resolution for a conflict, and that resolution
	# cannot have been overridden
	# validates :state, distinct: { scope: :conflict }, if: :confirmed?
	# validates :override, absence: true, if: :confirmed?

	aasm(:state) do
		state :rolled, initial: true
		state :confirmed, before_enter: :record_success

		event :confirm do
			transitions from: :rolled, to: :confirmed, if: :no_overrides?

			after_commit do
				if not self.scene.active?
					if not self.scene.game.over?
						self.scene.game.scenes.create!
					end
				end
			end
		end
	end

	before_create :record_rolls

	def game
		conflict.scene.game
	end

	# default logic implementations that can have new logic added in subclasses

	def successful?
		hope_dice_roll = player_roll_result[0...active_player.hope_die_count(as_of: self.created_at)]

		player_roll_result.include?('6') or hope_dice_roll.include?('5')
	end

	def dice_lost
		# player can't lose hope dice, so exclude them.
		losable_dice = player_roll_result[active_player.hope_die_count(as_of: self.created_at)..-1]
		losable_dice.count('1')
	end

	def narrative_control
		player_roll_result.count('6') > gm_roll_result.count('6') ? active_player : scene.game.gm
	end

	def roll_for_player
		(0...conflict.scene.player_dice_pool(active_player, as_of: self.created_at)).collect{ self.get_single_die_roll }.join
	end

	def roll_for_gm
		(0...conflict.scene.gm_dice_pool).collect{ self.get_single_die_roll }.join
	end

	def burned_trait_name
		Participation::CARD_MAPPING.fetch(burned_trait_type, nil)
	end

	# add one to each roll to get 1-6 instead of 0-5
	def get_single_die_roll
		(Random.rand(6) + 1).to_s
	end

	def no_overrides?
		self.override.nil?
	end

	def rolled?
		[self.player_roll_result, self.gm_roll_result].all?(&:present?)
	end

	private

	def cannot_override_an_override
		if parent_resolution.present? and parent_resolution.parent_resolution.present?
			self.errors.add(:resolution_id, "Can't override a resolution that is overriding a different resolution")
		end
	end

	def record_rolls
		self.player_roll_result ||= roll_for_player
		self.gm_roll_result ||= roll_for_gm
	end

	def record_success
		self.succeeded = self.successful?
	end

end
