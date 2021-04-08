json.extract! game, :id, :name, :created_at, :candles_lit, :setup_state
json.is_over game.over?
if game.active_scene
  json.active_scene do
    json.partial! 'scenes/scene', locals: {scene: game.active_scene}
  end
end
