class AddNarratedToConflicts < ActiveRecord::Migration[5.2]
  def change
    add_column :conflicts, :narrated, :boolean
  end
end
