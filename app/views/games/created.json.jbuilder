json.key_format! camelize: :lower

json.partial! "games/game", game: @game
json.gm_guid @game.gm.guid
