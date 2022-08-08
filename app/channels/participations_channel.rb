class ParticipationsChannel < ApplicationCable::Channel
  def subscribed
    target_game = game
    reject unless target_game.participations.includes(current_user)

    stream_for target_game

    # sync up new subscriber
    target_game.participations.each do |participation|
      connection.transmit(identifier: @identifier, participation_parcel(participation))
    end
  end

  def self.broadcast_update(target_participation)
    self.broadcast_to(
      target_participation.game,
      participation_parcel(target_participation)
    )
  end

  private

  def participation_parcel(participation)
    JSON.parse(ParticipationsController.render(partial: 'participations/participation', locals: {participation: participation}))
  end

  def game
    Game.find(params[:game_id])
  end
end
