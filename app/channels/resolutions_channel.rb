class ResolutionsChannel < ApplicationCable::Channel
  # todo determine how to reject subscriptions for participants not linked to a specific game
  def subscribed
    stream_for conflict
  end

  private

  def conflict
    Conflict.find(params[:conflict_id])
  end
end
