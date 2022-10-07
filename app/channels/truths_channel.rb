class TruthsChannel < ApplicationCable::AuthorizedChannel
  def subscribed
    stream_for scene
    reject and return unless scene.game.participations.includes(current_user)
    scene.truths.each do |truth|
      transmit({identifier: @identifier, **TruthsChannel.truth_parcel(truth)})
    end
  end

  def self.broadcast_update(target_truth)
    broadcast_to(
      target_truth.scene,
      truth_parcel(target_truth)
    )
  end

  private

  def self.truth_parcel(truth)
    JSON.parse(TruthsController.render(partial: 'truths/truth', locals: {truth: truth}))
  end

  def scene
    Scene.find(params[:scene_id])
  end
end
