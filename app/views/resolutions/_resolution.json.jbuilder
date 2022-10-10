json.key_format! camelize: :lower

json.extract! resolution, :id, :state, :type
json.burned_trait do
	json.type resolution.burned_trait_name
end
json.conflict do
	json.extract! resolution.conflict, :id, :dire
end
json.player_roll_result resolution.player_roll_result
json.gm_roll_result resolution.gm_roll_result
json.resolver do
	json.extract! resolution.active_player, :id, :name, :hope_die_count
end
json.successful resolution.successful?
json.confirmed resolution.state == 'confirmed'
json.narrative_control do
	json.extract! resolution.narrative_control, :id, :name
end
if resolution.parent_resolution.present?
	json.parent_resolution do
		json.partial! 'resolutions/resolution', resolution: resolution.parent_resolution
	end
end
