class ConflictsChannel < ApplicationCable::AuthorizedChannel
  def subscribed
    target_scene = scene
    reject and return unless target_scene.game.participations.includes(current_user)

    stream_for target_scene

    target_scene.conflicts.each do |conflict|
      transmit({identifier: @identifier, **ConflictsChannel.conflict_parcel(conflict)})
    end
  end

  def self.broadcast_update(target_conflict)
    broadcast_to(
      target_conflict.scene,
      conflict_parcel(target_conflict)
    )
  end

  private

  def self.conflict_parcel(conflict)
    JSON.parse(ConflictsController.render(partial: 'conflicts/conflict', locals: {conflict: conflict}))
  end

  def scene
    Scene.find(params[:scene_id])
  end
end
