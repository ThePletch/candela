json.extract! participation, :id, :name, :role, :position
if not participation.game.ready?
  json.extract! participation, :written_brink
end

if participation.player?
  if not participation.game.ready?
    json.extract! participation, :written_virtue, :written_vice
  end

  json.extract! participation, :character_concept, :top_trait_id, :top_trait, :top_trait_value,
                               :hope_die_count, :virtue, :vice, :brink, :moment, :card_order,
                               :burned_traits
  json.is_alive participation.alive?
end
