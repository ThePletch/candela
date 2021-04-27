class SwitchRefColumnInTruths < ActiveRecord::Migration[5.2]
  def change
    add_reference :truths, :scene_id, index: true
    remove_column :truths, :conflict_id
  end
end
