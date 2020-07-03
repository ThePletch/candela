class CreateConflicts < ActiveRecord::Migration[5.2]
  def change
    create_table :conflicts do |t|
      t.references :scene, foreign_key: true
      t.boolean :dire

      t.timestamps
    end
  end
end
