json.key_format! camelize: :lower

json.extract! conflict, :id, :narrated, :dire, :resolved

json.game_id conflict.game.id
