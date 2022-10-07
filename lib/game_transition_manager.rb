class GameTransitionManager
	attr_reader :game

	def initialize(game)
		@game = game
	end

	def distribute_traits!
		game.participations.players.each do |player|
			player.left_player(skip_gm: true).update!(vice: player.written_vice)
			player.right_player(skip_gm: true).update!(virtue: player.written_virtue)
			ParticipationsChannel.broadcast_update(player.left_player)
			ParticipationsChannel.broadcast_update(player.right_player)
		end
	end

	def distribute_brinks!
		game.participations.each do |player|
			player.left_player(skip_gm: false).update!(brink: player.written_brink)
			ParticipationsChannel.broadcast_update(player.left_player)
		end
	end

	def create_first_scene!
		scene = game.scenes.create!
		scene.finish_stating_truths!
	end

end
