class GameTransitionManager
	attr_reader :game

	def new(game)
		@game = game
	end

	def distribute_traits!
		game.participations.players.each do |player|
			player.left_player(skip_gm: true).update!(vice: player.written_vice)
			player.right_player(skip_gm: true).update!(virtue: player.written_virtue)
		end
	end

	def distribute_brinks!
		game.participations.each do |player|
			player.left_player(skip_gm: false).update!(brink: player.written_brink)
		end
	end

end
