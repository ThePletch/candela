class ScenesChannel < ApplicationCable::Channel
  # todo determine how to reject subscriptions for participants not linked to a specific game
  def subscribed
    stream_for game
  end

  def self.broadcast_update(scene)
    self.broadcast_to(scene.game, JSON.parse(ScenesController.render(partial: 'scenes/scene', locals: {scene: scene})))
  end

  private

  def game
    Game.find(params[:game_id])
  end
end
