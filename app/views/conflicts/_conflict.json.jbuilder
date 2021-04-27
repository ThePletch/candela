json.extract! conflict, :id, :narrated, :dire
json.active_resolutions do
  json.array! conflict.active_resolutions, partial:'resolutions/resolution', as: :resolution
end
