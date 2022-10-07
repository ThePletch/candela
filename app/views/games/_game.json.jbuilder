json.key_format! camelize: :lower

json.extract! game, :id, :name, :created_at, :candles_lit, :setup_state
json.is_over game.over?
