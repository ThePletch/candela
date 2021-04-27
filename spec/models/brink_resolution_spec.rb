require 'rails_helper'

RSpec.describe BrinkResolution, type: :model do
  it "rerolls the entire dice pool" do
    resolution = FactoryBot.create(:brink_resolution)
    # [note]
    # not much of a way to test this programmatically since it's random.
    # maybe we could rework it to identify which dice it's going to reroll and test that way?
    expect(resolution.parent_resolution.player_roll_result).not_to eq resolution.player_roll_result
  end

  it "requires a parent resolution created by this player" do
    parent_resolution = FactoryBot.create(:resolution)
    other_active_player = FactoryBot.create(:participation_down_to_brink, game: parent_resolution.active_player.game)
    resolution = FactoryBot.build(:brink_resolution,
      parent_resolution: parent_resolution,
      conflict: parent_resolution.conflict,
      active_player: other_active_player)
    expect(resolution).not_to be_valid
  end

  it "must be created by a player with their brink available" do
    game = FactoryBot.create(:game_ready)
    unbrinked_player = FactoryBot.create(:participation, game: game)
    brinked_player = FactoryBot.create(:participation_down_to_brink, game: game)
    unbrinked_brink = FactoryBot.build(:brink_resolution,
      game: game,
      active_player: unbrinked_player)
    brinked_brink = FactoryBot.create(:brink_resolution,
      game: game,
      active_player: brinked_player)
    expect(brinked_brink).to be_valid
  end
end
