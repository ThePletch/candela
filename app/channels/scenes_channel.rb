class ScenesChannel < ApplicationCable::Channel
  def subscribed
    stream_for game
    reject unless game.participations.includes(current_user)
  end

  def self.broadcast_update(scene)
    self.broadcast_to(scene.game, JSON.parse(ScenesController.render(partial: 'scenes/scene', locals: {scene: scene})))
  end

  private

  def game
    Game.find(params[:game_id])
  end
end
