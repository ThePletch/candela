class Game < ApplicationRecord
	include AASM

	MIN_PLAYERS = 2

	has_many :scenes
	has_many :participations

	aasm(:setup_state) do
		state :nascent, initial: true
		state :traits
		state :module_intro
		state :character_concept
		state :moments
		state :brinks
		state :order_cards
		state :ready

		event :enter_traits_stage do
			transitions from: :nascent, to: :traits, if: :minimum_players?
		end

		event :enter_module_intro_stage do
			transitions from: :traits, to: :module_intro, if: :all_players_wrote_traits?

			before do
				GameTransitionManager.new(self).distribute_traits!
			end
		end

		event :enter_character_concept_stage do
			transitions from: :module_intro, to: :character_concept
		end

		event :enter_moments_stage do
			transitions from: :character_concept, to: :moments, if: :all_players_have_concepts?
		end

		event :enter_brinks_stage do
			transitions from: :moments, to: :brinks, if: :all_players_have_moments?
		end

		event :enter_card_ordering_stage do
			transitions from: :brinks, to: :order_cards, if: :all_players_wrote_brinks?

			before do
				GameTransitionManager.new(self).distribute_brinks!
			end
		end

		event :begin_game do
			transitions from: :order_cards, to: :ready, if: :all_players_ordered_cards?

			after do
				self.scenes.create!
			end
		end
	end

	def candles_lit(as_of: nil)
		as_of ||= Time.current

		case setup_state
		when :nascent
			0
		when :traits, :module_intro, :character_concept
			3
		when :moments
			6
		when :brinks, :order_cards
			9
		when :ready
			10 - self.scenes.failed_as_of(as_of).count
		end
	end

	def gm
		participations.gms.take
	end

	private

	def minimum_players?
		return participations.players.count >= MIN_PLAYERS
	end

	def all_players_wrote_traits?
		participations.players.where(written_virtue: nil).or(written_vice: nil).empty?
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
