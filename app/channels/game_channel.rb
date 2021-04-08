class GameChannel < ApplicationCable::Channel
  # todo determine how to reject subscriptions for participants not linked to a specific game
  def subscribed
    stream_for game

    self.class.broadcast_update(game)
  end

  def self.broadcast_update(target_game)
    self.broadcast_to(target_game, JSON.parse(GamesController.render(partial: 'games/game', locals: {game: target_game})))
  end

  private

  def game
    Game.find(params[:id])
  end
end
