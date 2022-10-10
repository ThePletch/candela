json.key_format! camelize: :lower

json.extract! scene, :id, :state, :truths_remaining, :base_player_dice_pool

if scene.all_truths_stated
  json.next_truth_stater nil
else
  json.next_truth_stater do
    json.id scene.next_truth_stater.id
    json.name scene.next_truth_stater.name
  end
end
