class ParticipationsChannel < ApplicationCable::AuthorizedChannel
  def subscribed
    target_game = game
    reject and return unless target_game.participations.includes(current_user)

    stream_for current_user

    # sync up new subscriber
    target_game.participations.each do |participation|
      transmit({identifier: @identifier, **ParticipationsChannel.participation_parcel(participation, current_user)})
    end
  end

  def self.broadcast_update(target_participation)
    target_participation.game.participations.each do |participation|
      broadcast_to(
        participation,
        participation_parcel(target_participation, participation)
      )
    end
  end

  private

  def self.participation_parcel(participation, current_user)
    JSON.parse(ParticipationsController.render(partial: 'participations/participation', locals: {viewer: current_user, participation: participation}))
  end

  def game
    Game.includes(participations: [:resolutions, :benefiting_resolutions]).find(params[:game_id])
  end
end
