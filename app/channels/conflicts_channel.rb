class ConflictsChannel < ApplicationCable::Channel
  def subscribed
    reject unless scene.game.participations.includes(current_user)
    stream_for scene
  end

  private

  def scene
    Scene.find(params[:scene_id])
  end
end
