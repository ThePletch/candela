json.extract! participation, :id, :name, :role, :position

json.left_player do
	json.extract! participation.left_player(skip_gm: true), :name, :role
end

json.right_player do
	json.extract! participation.right_player(skip_gm: true), :name, :role
end

json.left_participant do
	json.extract! participation.left_player(skip_gm: false), :name, :role
end

json.right_participant do
	json.extract! participation.right_player(skip_gm: false), :name, :role
end

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
