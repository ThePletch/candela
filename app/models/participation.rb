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

  after_commit BroadcastChange.new(
  	[ParticipationChannel, ParticipationsChannel],
  	[
  		[GameChannel, Proc.new(&:game)],
  		[GamesChannel, Proc.new(&:game)],
  	],
  )

	before_create do |record|
		record.guid = SecureRandom.uuid
		record.position = game.participations.count
	end

	validates :name, presence: true

	# card order is the characters 0, 1, and 2 in any order
	validate :card_order_format_is_correct
	validates :position, uniqueness: { scope: :game }
	validate :game_not_started, on: :create

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
		(card_order or '012').split('') + ['3']
	end

	def card_ids_visible_to(participation, as_of: nil)
		# you can always see all of your own cards
		return card_ids if participation == self

		as_of ||= Time.current
		if card_order.present?
			burned_down_to = card_ids.slice_after(top_trait_id(as_of: as_of)).first
		else
			# don't show the top card until they've explicitly chosen one
			burned_down_to = []
		end

		gave_it_to_them = []
		if participation.present?
			# GM doesn't have traits
			if role != 'gm'
				# player on the left passes you your virtue
				gave_it_to_them << '0' if participation == left_player(skip_gm: true)
				# player on the right passes you your vice
				gave_it_to_them << '1' if participation == right_player(skip_gm: true)
			end
			# participation on the right passes you your brink
			gave_it_to_them << '3' if participation == right_player(skip_gm: false)
	  end

		card_ids.select{|id| burned_down_to.include?(id) or gave_it_to_them.include?(id) }
	end

	def left_player(skip_gm: false)
		total_player_count = game.participations.count
		left_position = (self.position - 1) % total_player_count
		player = Participation.find_by(game: self.game, position: left_position)

		# corner case to avoid an infinite loop when the GM first starts the game
		if player == self
			nil
		elsif skip_gm and player.role == 'gm'
			player.left_player(skip_gm: skip_gm)
		else
			player
		end
	end

	def right_player(skip_gm: false)
		total_player_count = game.participations.count
		left_position = (self.position + 1) % total_player_count
		player = Participation.find_by(game: self.game, position: left_position)

		# corner case to avoid an infinite loop when the GM first starts the game
		if player == self
			nil
		elsif skip_gm and player.role == 'gm'
			player.right_player(skip_gm: skip_gm)
		else
			player
		end
	end

	def brink_embraced(as_of: nil)
		as_of ||= Time.current
		BrinkResolution.where(player_id: self.id)
								   .created_before(as_of)
								   .exists?
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
											 .failed
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

	def trait_value(trait_id, viewer: nil, as_of: nil)
		as_of ||= Time.current

		case CARD_MAPPING[trait_id]
		when 'virtue'
			virtue
		when 'vice'
			vice
		when 'moment'
			moment
		when 'brink'
			if brink.present?
				([self, self.right_player(skip_gm: false)].include?(viewer) or brink_embraced) ? brink : '(hidden)'
			else
				nil
			end
		end
	end

	def brink_embraced
		resolutions.where(type: 'BrinkResolution').exists?
	end

	def hope_die_count(as_of: nil)
		as_of ||= Time.current
		# count any hope dice given to this player by dying players
		bequeathals = Resolution.joins(conflict: {scene: :game})
								      .where(resolutions: {beneficiary_player: self}, games: {id: game.id})
								      .created_before(as_of)

		failed_brink_embrace = BrinkResolution.where(player_id: self.id)
																					.created_before(as_of)
																				  .failed
																				  .take

		if failed_brink_embrace
			# if a player has been consumed by their brink, they lose all their hope dice (including
			# from a lived moment). the only way they can have hope dice is if someone gives them one
			# AFTER they've been consumed by their brink.
			bequeathals.where("resolutions.created_at > ?", failed_brink_embrace.created_at).count
		else
			# add a hope die if the player has lived their moment successfully
			lived_moment = resolutions.successful.created_before(as_of).where(type: 'MomentResolution').count
			# also count a moment resolution if it succeeded after a reroll
			overridden_moments = resolutions.joins(:override).rolled.where(type: 'MomentResolution')
			succeeded_on_override = overridden_moments.select{|m| m.override.succeeded }.length
			bequeathals.count + lived_moment + succeeded_on_override
		end
	end

	def alive?
		resolutions.failed.deadly.none?
	end

	private

	def game_not_started
		unless game.nascent?
			self.errors.add(:base, "Cannot join a game that has already started")
		end
	end

	def card_order_format_is_correct
		if card_order.present? and game.ready?
			all_types_present = ["0", "1", "2"].all?{|key| card_order.include?(key) }

			unless all_types_present and card_order.length == 3
				self.errors.add(:card_order, "Card order must include all three non-brink cards")
			end
		end
	end
end
