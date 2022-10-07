class ResolutionsChannel < ApplicationCable::AuthorizedChannel
  def subscribed
    target_conflict = conflict
    reject and return unless target_conflict.game.participations.includes(current_user)
    stream_for target_conflict

    target_conflict.resolutions.each do |resolution|
      transmit({identifier: @identifier, **ResolutionsChannel.resolution_parcel(resolution, current_user)})
    end
  end

  def self.broadcast_update(target_resolution)
    broadcast_to(
      target_resolution.conflict,
      resolution_parcel(target_resolution, current_user)
    )
  end

  private

  def self.resolution_parcel(resolution, current_user)
    JSON.parse(ResolutionsController.render(partial: 'resolutions/resolution', locals: {current_user: current_user, resolution: resolution}))
  end

  def conflict
    Conflict.find(params[:conflict_id])
  end
end
