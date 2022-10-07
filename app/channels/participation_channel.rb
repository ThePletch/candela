class ParticipationChannel < ApplicationCable::AuthorizedChannel
  def subscribed
    reject and return unless params[:guid] or params[:id]
    target_participation = participation
    reject and return unless target_participation == current_user

    stream_for target_participation

    # sync up new subscriber
    transmit({identifier: @identifier, **ParticipationChannel.participation_parcel(target_participation)})
  end

  def self.broadcast_update(target_participation)
    broadcast_to(
      target_participation,
      participation_parcel(target_participation)
    )
  end

  private

  def self.participation_parcel(participation)
    JSON.parse(ParticipationsController.render(partial: 'participations/participation', locals: {viewer: participation, participation: participation}))
  end

  def participation
    return Participation.find_by!(guid: params[:guid]) if params[:guid]

    Participation.find(params[:id])
  end
end
