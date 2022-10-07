json.key_format! camelize: :lower

is_self = viewer.id == participation.id

json.extract! participation, :id, :name, :role, :position, :character_concept, :hope_die_count

json.game_id participation.game_id
json.alive participation.alive?

burned_traits = participation.burned_traits
json.traits participation.card_ids_visible_to(viewer) do |card_id|
  json.type Participation::CARD_MAPPING[card_id]
  json.value participation.trait_value(card_id, viewer: viewer)
  json.burned burned_traits.include?(card_id)
end

json.left_player do
  if (left_player = participation.left_player(skip_gm: true)).present?
    json.extract! left_player, :id, :name, :role
  end
end

json.right_player do
  if (right_player = participation.right_player(skip_gm: true)).present?
    json.extract! right_player, :id, :name, :role
  end
end

json.left_participation do
  if (left_participation = participation.left_player(skip_gm: false)).present?
    json.extract! left_participation, :id, :name, :role
  end
end

json.right_participation do
  if (right_participation = participation.right_player(skip_gm: false)).present?
    json.extract! right_participation, :id, :name, :role
  end
end

json.has_written_vice participation.written_vice.present?
json.has_written_virtue participation.written_virtue.present?
json.has_written_brink participation.written_brink.present?
json.has_moment participation.moment.present?
json.has_card_order participation.card_order.present?
json.has_brink participation.brink.present?

if is_self
  json.extract! participation, :written_vice, :written_virtue, :written_brink, :moment, :card_order, :brink
end
