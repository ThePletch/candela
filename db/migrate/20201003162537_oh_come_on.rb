class OhComeOn < ActiveRecord::Migration[5.2]
  def change
    rename_column :truths, :scene_id_id, :scene_id
  end
end
