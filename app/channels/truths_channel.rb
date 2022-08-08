class TruthsChannel < ApplicationCable::Channel
  def subscribed
    stream_for scene
    reject unless scene.game.participations.includes(current_user)
  end

  private

  def scene
    Scene.find(params[:scene_id])
  end
end
