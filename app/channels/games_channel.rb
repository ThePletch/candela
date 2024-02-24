class GamesChannel < ApplicationCable::PublicChannel
  def subscribed
    stream_from 'recruiting_games'
    # sync up new subscriber
    games.each do |game|
      transmit({identifier: @identifier, **GamesChannel.game_parcel(game)})
    end
  end

  def self.broadcast_update(target_game)
    broadcast_to(
      'recruiting_games',
      game_parcel(target_game)
    )
  end

  private

  def self.game_parcel(game)
    JSON.parse(GamesController.render(partial: 'games/browse/game', locals: {game: game}))
  end

  def games
    Game.nascent
  end
end
