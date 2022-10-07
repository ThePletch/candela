class Game < ApplicationRecord
	include AASM

	MIN_PLAYERS = 2

	has_many :scenes
	has_many :truths, through: :scenes
	has_many :participations, dependent: :destroy

	after_commit BroadcastChange.new([GameChannel, GamesChannel])

	validates :name, presence: true

	aasm(:setup_state) do
		state :nascent, initial: true
		state :traits, before_exit: Proc.new { GameTransitionManager.new(self).distribute_traits! }
		state :module_intro
		state :character_concept
		state :moments
		state :brinks, before_exit: Proc.new { GameTransitionManager.new(self).distribute_brinks! }
		state :order_cards
		state :ready, after_enter: Proc.new { GameTransitionManager.new(self).create_first_scene! }

		event :transition_to_next_stage do
			transitions from: :nascent, to: :traits, if: :minimum_players?
			transitions from: :traits, to: :module_intro, if: :all_players_wrote_traits?
			transitions from: :module_intro, to: :character_concept
			transitions from: :character_concept, to: :moments, if: :all_players_have_concepts?
			transitions from: :moments, to: :brinks, if: :all_players_have_moments?
			transitions from: :brinks, to: :order_cards, if: :all_players_wrote_brinks?
			transitions from: :order_cards, to: :ready, if: :all_players_ordered_cards?
		end
	end

	def active_scene
		scenes.active.first
	end

	def candles_lit(as_of: nil)
		as_of ||= Time.current

		case setup_state.intern
		when :nascent
			0
		when :traits, :module_intro, :character_concept
			3
		when :moments
			6
		when :brinks, :order_cards
			9
		when :ready
			if self.over?
				0
			else
				10 - self.scenes.failed_as_of(as_of).count
			end
		end
	end

	def over?
		ready? and participations.players.any? and participations.players.alive.none?
	end

	def gm
		participations.gms.take
	end

	private

	def minimum_players?
		(participations.players.length >= MIN_PLAYERS) and gm.present?
	end

	def all_players_wrote_traits?
		participations.players.where(written_virtue: nil).or(participations.players.where(written_vice: nil)).empty?
	end

	def all_players_have_concepts?
		participations.players.where(character_concept: nil).empty?
	end

	def all_players_have_moments?
		participations.players.where(moment: nil).empty?
	end

	def all_players_wrote_brinks?
		participations.where(written_brink: nil).empty?
	end

	def all_players_ordered_cards?
		participations.players.where(card_order: nil).empty?
	end
end
