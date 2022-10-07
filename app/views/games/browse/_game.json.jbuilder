json.key_format! camelize: :lower

json.extract! game, :id, :name, :created_at
json.participations game.participations do |participation|
  json.partial! 'participations/browse/participation', participation: participation
end
