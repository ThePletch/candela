class ConflictsChannel < ApplicationCable::Channel
  # todo determine how to reject subscriptions for participants not linked to a specific game
  def subscribed
    stream_for scene
  end

  private

  def scene
    Scene.find(params[:scene_id])
  end
end
