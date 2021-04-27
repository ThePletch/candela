class ParticipantsChannel < ApplicationCable::Channel
  # todo determine how to reject subscriptions for participants not linked to a specific game
  def subscribed
    stream_for game

    # sync up new subscribers
    game.participations.each{|participation| self.class.broadcast_update(participation) }
  end

  def self.broadcast_update(target_participation)
    self.broadcast_to(
      target_participation.game,
      JSON.parse(ParticipationsController.render(partial: 'participations/participation', locals: {participation: target_participation}))
    )
  end

  private

  def game
    @game ||= Game.find(params[:game_id])
  end
end
