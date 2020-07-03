class CreateScenes < ActiveRecord::Migration[5.2]
  def change
    create_table :scenes do |t|
      t.references :game, foreign_key: true

      t.timestamps
    end
  end
end
