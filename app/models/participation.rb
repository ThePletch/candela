class Participation < ApplicationRecord
	belongs_to :game
	has_many :resolutions, inverse_of: :active_player, foreign_key: 'player_id'
	has_many :benefiting_resolutions, class_name: 'Resolution', inverse_of: :beneficiary_player, foreign_key: 'beneficiary_player_id'
	has_many :truths

	scope :players, -> { where(role: 'player') }
	scope :gms, -> { where(role: 'gm') }
	scope :alive, -> { players.where.not(
		Resolution.joins(:conflict)
						  .where(conflicts: {dire: true}, resolutions: {succeeded: false})
							.where("resolutions.player_id = participations.id")
							.arel.exists) }
	scope :dead, -> { players.joins(resolutions: :conflict).where(conflicts: {dire: true}, resolutions: {succeeded: false}) }

	before_create do |record|
		record.guid = SecureRandom.uuid
		record.position = game.participations.count
	end

	validates :name, presence: true

	# card order is the characters 0, 1, and 2 in any order
	validate :card_order_format_is_correct
	validates :position, uniqueness: { scope: :game }

	# only one gm per game
	validates :role, uniqueness: { scope: :game }, if: :gm?

	CARD_MAPPING = {
		'0' => 'virtue',
		'1' => 'vice',
		'2' => 'moment',
		'3' => 'brink'
	}

	def player?
		role == 'player'
	end

	def gm?
		role == 'gm'
	end

	def card_ids
		(card_order or '').split('')
	end

	def left_player(skip_gm: false)
		total_player_count = game.participations.count
		left_position = (self.position - 1) % total_player_count
		player = Participation.find_by(game: self.game, position: left_position)

		if skip_gm and player.role == 'gm'
			player.left_player
		else
			player
		end
	end

	def right_player(skip_gm: false)
		total_player_count = game.participations.count
		left_position = (self.position + 1) % total_player_count
		player = Participation.find_by(game: self.game, position: left_position)

		if skip_gm and player.role == 'gm'
			player.right_player
		else
			player
		end
	end

	def burned_traits(as_of: nil)
		as_of ||= Time.current
		already_burned = resolutions.where.not(burned_trait_type: nil)
										    .created_before(as_of)
											  .pluck(:burned_trait_type)
		if MomentResolution.where(player_id: self.id)
											 .created_before(as_of)
											 .exists?
			already_burned.append('2')
		end

		if BrinkResolution.where(player_id: self.id)
											 .created_before(as_of)
											 .exists?
			already_burned.append('3')
		end

		already_burned
	end

	def top_trait(as_of: nil)
		as_of ||= Time.current
		return CARD_MAPPING[self.top_trait_id(as_of: as_of)]
	end

	def top_trait_id(as_of: nil)
		as_of ||= Time.current
		already_burned = burned_traits(as_of: as_of)

		card_ids.find{|card_id| already_burned.exclude?(card_id) } or '3'
	end

	def top_trait_value(show_hidden: false, as_of: nil)
		as_of ||= Time.current

		case top_trait(as_of: as_of)
		when 'virtue'
			virtue
		when 'vice'
			vice
		when 'moment'
			moment
		when 'brink'
			(show_hidden or brink_embraced) ? brink : '(hidden)'
		end
	end

	def brink_embraced
		resolutions.where(type: 'BrinkResolution').exists?
	end

	def hope_die_count(as_of: nil)
		as_of ||= Time.current
		# count any hope dice given to this player by dying players
		count = Resolution.joins(conflict: {scene: :game})
								      .where(resolutions: {beneficiary_player: self}, games: {id: game.id})
								      .where("resolutions.created_at < ?", as_of)
								      .count

		# add one hope die if the player has lived their moment
		if resolutions.successful.created_before(as_of).where(type: 'MomentResolution').exists?
			count += 1
		end

		count
	end

	def alive?
		resolutions.failed.deadly.none?
	end

	private

	def card_order_format_is_correct
		if card_order.present? and game.ready?
			all_types_present = ["0", "1", "2"].all?{|key| card_order.include?(key) }

			unless all_types_present and card_order.length == 3
				self.errors.add(:card_order, "Card order must include all three non-brink cards")
			end
		end
	end
end
