class RollResolution < Resolution
  validates :parent_resolution, absence: true
  validates :burned_trait_type, absence: true
end
