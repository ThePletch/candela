json.extract! scene, :id, :state, :truths_remaining
json.truths do
  json.array! scene.truths, partial:'truths/truth', as: :truth
end
unless scene.all_truths_stated
  json.next_truth_stater_id scene.next_truth_stater.id
  json.next_truth_stater_name scene.next_truth_stater.name
end
json.active_conflict do
  if scene.active_conflict
    json.partial! 'conflicts/conflict', locals: {conflict: scene.active_conflict}
  end
end
