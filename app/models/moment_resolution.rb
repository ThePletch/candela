class MomentResolution < Resolution
	# works exactly like a standard resolution, but grants a hope die if it succeeds.
  validates :parent_resolution, absence: true
  validates :burned_trait_type, absence: true
end
