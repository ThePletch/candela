class GameChannel < ApplicationCable::Channel
  def subscribed
    target_game = game
    reject unless target_game.participations.includes(current_user)
    stream_for target_game

    connection.transmit(identifier: @identifier, game_parcel(target_game))
  end

  def self.broadcast_update(target_game)
    self.broadcast_to(target_game, game_parcel(target_game))
  end

  private

  def game_parcel(game)
    JSON.parse(GamesController.render(partial: 'games/game', locals: {game: game}))
  end

  def game
    Game.find(params[:id])
  end
end
