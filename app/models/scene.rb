class Scene < ApplicationRecord
	include AASM

	belongs_to :game
	has_many :conflicts
	has_many :resolutions, through: :conflicts
	has_many :truths

	validate :game_must_be_ready

	# todo validate only one active scene per game

	scope :failed, -> { joins(conflicts: :resolutions).where(resolutions: {succeeded: false}) }

	scope :active, -> { where.not(Resolution.failed.joins(:conflict).where("conflicts.scene_id = scenes.id").arel.exists) }
	scope :failed_as_of, ->(timestamp) { failed.where("resolutions.created_at < ?", timestamp) }

	aasm(:state) do
		state :transitioning, initial: true
		state :truths_stated

		event :finish_stating_truths do
			transitions from: :transitioning, to: :truths_stated, if: :all_truths_stated
		end
	end

	# the person responsible for the most recent failed scene states truths first.
	# otherwise, the gm starts.
	def first_truth_stater
		if most_recent_failed_scene = game.scenes.failed_as_of(self.created_at).order(created_at: :desc).first
			most_recent_failed_scene.failing_resolution.active_player
		else
			game.gm
		end
	end

	def failing_resolution
		Resolution.failed.joins(:conflict).where(conflicts: {scene_id: self.id}).first
	end

	def next_truth_stater
		truths_so_far = truths.count
		participant_count = game.participations.count
		truth_position = (first_truth_stater.position + truths_so_far) % participant_count

		game.participations.order(:position)[truth_position]
	end

	def expected_truth_count
		candles_lit_at_start_of_scene = game.candles_lit(as_of: self.created_at)
		if candles_lit_at_start_of_scene == 10
			0
		else
			# the final truth is always 'and we are alive', so it's not accounted for
			# in the data model.
			candles_lit_at_start_of_scene - 1
		end
	end

	def truths_remaining
		expected_truth_count - truths.count
	end

	def all_truths_stated
		truths.count >= expected_truth_count
	end

	def active_conflict
		conflicts.active.first
	end

	def failed?
		conflicts.failed.any?
	end

	def active?
		not failed?
	end

	def game_must_be_ready
		unless game.ready?
			errors.add(:game_id, "Game must be done with setup")
		end
	end

	def dice_lost(as_of: nil)
		as_of ||= Time.current
		resolutions.confirmed.where("resolutions.created_at < ?", as_of).map(&:dice_lost).sum
	end

	def player_dice_pool(active_player, as_of: nil)
		as_of ||= Time.current
		game.candles_lit(as_of: self.created_at) - dice_lost(as_of: as_of) + active_player.hope_die_count(as_of: as_of)
	end

	def gm_dice_pool
		game.candles_lit(as_of: self.created_at)
	end
end
