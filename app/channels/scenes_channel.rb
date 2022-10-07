class ScenesChannel < ApplicationCable::AuthorizedChannel
  def subscribed
    target_game = game
    reject and return unless game.participations.includes(current_user)

    stream_for target_game

    target_game.scenes.each do |scene|
      transmit({identifier: @identifier, **ScenesChannel.scene_parcel(scene)})
    end
  end

  def self.broadcast_update(target_scene)
    broadcast_to(
      target_scene.game,
      scene_parcel(target_scene)
    )
  end

  private

  def self.scene_parcel(scene)
    JSON.parse(ScenesController.render(partial: 'scenes/scene', locals: {scene: scene}))
  end

  def game
    Game.find(params[:game_id])
  end
end
