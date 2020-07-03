class Participation < ApplicationRecord
	belongs_to :game
	has_many :resolutions

	scope :players, -> { where(role: 'player') }
	scope :gms, -> { where(role: 'gm') }
	scope :alive, -> { players.includes(resolutions: :conflict).where(conflicts: {dire: true}, resolutions: {failed: true, id: nil}) }
	scope :dead, -> { players.joins(resolutions: :conflict).where(conflicts: {dire: true}, resolutions: {failed: true}) }

	before_save do |record|
		record.guid = SecureRandom.uuid
		record.position = game.participations.count
	end

	validates :name, presence: true

	# card order is the characters 0, 1, and 2 in any order
	validates :card_order, format: { with: /[012]{3}/ }
	validates :card_order, format: { with: /[0]{1}/ }
	validates :card_order, format: { with: /[1]{1}/ }
	validates :card_order, format: { with: /[2]{1}/ }
	validates :position, uniqueness: { scope: :game }

	# only one gm per game
	validates :role, uniqueness: { scope: :game }, if: :gm?

	CARD_MAPPING = {
		'0': 'virtue',
		'1': 'vice',
		'2': 'moment',
		'3': 'brink'
	}

	def player?
		role == 'player'
	end

	def gm?
		role == 'gm'
	end

	def card_ids
		card_order.split('')
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

	def burned_traits
		resolutions.confirmed.where.not(burned_trait_type: nil).pluck(:burned_trait_type)
	end

	def top_trait
		already_burned = burned_traits
		top_card_id = card_ids.find{|card_id| already_burned.exclude?(card_id) } or '3'

		return CARD_MAPPING[top_card_id]
	end

	def hope_die_count
		# count any hope dice given to this player by dying players
		count = Resolution.join(conflict: {scene: :game}).where(beneficiary_player: self, game: game).count

		# add one hope die if the player has lived their moment
		if resolutions.successful.where(type: 'MomentResolution').exists?
			count += 1
		end

		count
	end

	def alive?
		resolutions.failed.deadly.none?
	end
end
