json.key_format! camelize: :lower

is_self = viewer.id == participation.id

json.extract! participation, :id, :name, :role, :position, :character_concept, :hope_die_count
json.card_order (participation.card_order.try(:split, '').try(:map) do |card_id|
  Participation::CARD_MAPPING[card_id]
end.to_a) or []
json.game_id participation.game_id
json.alive participation.alive?

burned_traits = participation.burned_traits
json.set! 'traits' do
  # necessary so this key isn't omitted if empty
  json.set! :dummy, ''
  participation.card_ids_visible_to(viewer).each do |card_id|
    card_value = participation.trait_value(card_id, viewer: viewer)
    # don't show cards that don't have a set value yet
    if card_value.present?
      json.set! Participation::CARD_MAPPING[card_id] do
        json.value card_value
        json.burned burned_traits.include?(card_id)
      end
    end
  end
end

json.has_written_vice participation.written_vice.present?
json.has_written_virtue participation.written_virtue.present?
json.has_written_brink participation.written_brink.present?
json.has_moment participation.moment.present?
json.has_brink participation.brink.present?

if is_self
  json.extract! participation, :guid, :written_vice, :written_virtue, :written_brink, :moment, :brink
end
