json.extract! resolution, :id, :state, :type
json.player_roll_result resolution.player_roll_result
json.hope_die_count resolution.active_player.hope_die_count
json.gm_roll_result resolution.gm_roll_result
json.active_player resolution.active_player.name
json.active_player_id resolution.active_player.id
json.successful resolution.successful?
json.narrative_control resolution.narrative_control.name
json.is_override resolution.parent_resolution.present?
