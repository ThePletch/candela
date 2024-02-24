class GameChannel < ApplicationCable::AuthorizedChannel
  def subscribed
    target_game = game
    reject and return unless target_game.participations.includes(current_user)

    stream_for target_game

    transmit({identifier: @identifier, **GameChannel.game_parcel(target_game)})
  end

  def self.broadcast_update(target_game)
    broadcast_to(
      target_game,
      game_parcel(target_game)
    )
  end

  private

  def self.game_parcel(game)
    JSON.parse(GamesController.render(partial: 'games/game', locals: {game: game}))
  end

  def game
    Game.find(params[:id])
  end
end
