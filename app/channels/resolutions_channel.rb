class ResolutionsChannel < ApplicationCable::AuthorizedChannel
  def subscribed
    target_conflict = conflict
    reject and return unless target_conflict.game.participations.includes(current_user)

    stream_for target_conflict

    target_conflict.resolutions.each do |resolution|
      transmit({identifier: @identifier, **ResolutionsChannel.resolution_parcel(resolution)})
    end
  end

  def self.broadcast_update(target_resolution)
    broadcast_to(
      target_resolution.conflict,
      resolution_parcel(target_resolution)
    )
  end

  private

  def self.resolution_parcel(resolution)
    JSON.parse(ResolutionsController.render(partial: 'resolutions/resolution', locals: {resolution: resolution}))
  end

  def conflict
    Conflict.find(params[:conflict_id])
  end
end
