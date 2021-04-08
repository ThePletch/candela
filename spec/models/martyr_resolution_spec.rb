require 'rails_helper'

RSpec.describe MartyrResolution, type: :model do
  it "is always a failure" do
    martyr_resolution = FactoryBot.create(:martyr_resolution, confirmed: true)
    expect(martyr_resolution.succeeded).to be false
  end

  it "requires a parent resolution that failed" do
    dire_conflict = FactoryBot.create(:conflict, dire: true)
    successful_dire_parent = FactoryBot.create(:resolution, :succeeded, conflict: dire_conflict)
    martyring = FactoryBot.build(:martyr_resolution,
      parent_resolution: successful_dire_parent,
      conflict: dire_conflict)
    expect(martyring).not_to be_valid
  end

  it "must be for a dire conflict" do
    undire_conflict = FactoryBot.create(:conflict, dire: false)
    failed_undire_parent = FactoryBot.create(:resolution, :failed, conflict: undire_conflict)
    martyring = FactoryBot.build(:martyr_resolution,
      parent_resolution: failed_undire_parent,
      conflict: undire_conflict)
    expect(martyring).not_to be_valid
  end

  it "doesn't change the roll from its parent resolution" do
    martyr_resolution = FactoryBot.create(:martyr_resolution)
    expect(martyr_resolution.player_roll_result).to eq martyr_resolution.parent_resolution.player_roll_result
    expect(martyr_resolution.gm_roll_result).to eq martyr_resolution.parent_resolution.gm_roll_result
  end

  it "always gives the player narrative control" do
    martyr_resolution = FactoryBot.create(:martyr_resolution)
    martyr_resolution.parent_resolution.update_attributes(
      player_roll_result: '1' * 10,
      gm_roll_result: '6' * 10)
    expect(martyr_resolution.narrative_control).to eq martyr_resolution.active_player
  end
end
