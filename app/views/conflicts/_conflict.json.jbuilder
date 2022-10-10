json.key_format! camelize: :lower

json.extract! conflict, :id, :narrated, :dire

json.game_id conflict.game.id
