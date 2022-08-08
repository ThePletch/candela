class ResolutionsChannel < ApplicationCable::Channel
  def subscribed
    target_conflict = conflict
    reject unless conflict.game.participations.includes(current_user)
    stream_for conflict
  end

  private

  def conflict
    Conflict.find(params[:conflict_id])
  end
end
