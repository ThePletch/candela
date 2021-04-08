require 'rails_helper'

RSpec.describe RollResolution, type: :model do
  it "gives the GM narrative control if they roll as many sixes as the players or more" do
    resolution_with_same_sixes = FactoryBot.create(:resolution)
    resolution_with_same_sixes.update_attributes(
      player_roll_result: '2222222266',
      gm_roll_result: '5555555566')
    resolution_with_more_sixes = FactoryBot.create(:resolution)
    resolution_with_more_sixes.update_attributes(
      player_roll_result: '2222222266',
      gm_roll_result: '5555556666')
    expect(resolution_with_same_sixes.narrative_control).to eq resolution_with_same_sixes.scene.game.gm
    expect(resolution_with_more_sixes.narrative_control).to eq resolution_with_more_sixes.scene.game.gm
  end

  it "gives the player narrative control if they roll more sixes than the GM" do
    resolution_with_more_sixes = FactoryBot.create(:resolution)
    resolution_with_more_sixes.update_attributes(
      player_roll_result: '2222226666',
      gm_roll_result: '5555555566')
    expect(resolution_with_more_sixes.narrative_control).to eq resolution_with_more_sixes.active_player
  end

  it "validates that there are no parent resolutions" do
    parent_to_be = FactoryBot.create(:resolution)
    expect(parent_to_be).to be_valid

    bad = FactoryBot.build(:resolution,
      parent_resolution: parent_to_be,
      conflict: parent_to_be.conflict,
      active_player: parent_to_be.active_player)
    expect(bad).not_to be_valid
  end
end
