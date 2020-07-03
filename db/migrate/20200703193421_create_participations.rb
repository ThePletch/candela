class CreateParticipations < ActiveRecord::Migration[5.2]
  def change
    create_table :participations do |t|
      t.string :name
      t.references :game, foreign_key: true
      t.string :guid
      t.string :role
      t.integer :position
      t.string :virtue
      t.string :vice
      t.string :moment
      t.string :character_concept
      t.string :written_virtue
      t.string :written_vice
      t.string :brink
      t.string :written_brink
      t.string :card_order

      t.timestamps
    end
  end
end
