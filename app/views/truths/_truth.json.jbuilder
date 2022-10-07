json.key_format! camelize: :lower

json.extract! truth, :id, :description
json.speaker do
  json.id truth.participation.id
  json.name truth.participation.name
end
