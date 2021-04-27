class CreateTruths < ActiveRecord::Migration[5.2]
  def change
    create_table :truths do |t|
      t.references :conflict, foreign_key: true
      t.references :participation, foreign_key: true
      t.string :description
    end
  end
end
