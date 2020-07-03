class CreateResolutions < ActiveRecord::Migration[5.2]
  def change
    create_table :resolutions do |t|
      t.references :conflict, foreign_key: true
      t.references :player, foreign_key: true
      t.references :resolution, foreign_key: true
      t.references :beneficiary_player, foreign_key: true
      t.string :burned_trait_type
      t.string :type
      t.string :player_roll_result
      t.string :gm_roll_result
      t.string :state

      t.timestamps
    end
  end
end
