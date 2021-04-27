class AddStateToScenes < ActiveRecord::Migration[5.2]
  def change
    add_column :scenes, :state, :string
  end
end
