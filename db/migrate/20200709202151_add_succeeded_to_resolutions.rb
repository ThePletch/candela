class AddSucceededToResolutions < ActiveRecord::Migration[5.2]
  def change
    add_column :resolutions, :succeeded, :boolean
  end
end
