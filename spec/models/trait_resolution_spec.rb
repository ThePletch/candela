require 'rails_helper'

RSpec.describe TraitResolution, type: :model do
  # this test has a 0.0000099% chance of failing spuriously due to the reroll randomly
  # coming up all ones again. i'm satisfied with those odds.
  it "rerolls ones for the player" do
    parent_resolution = FactoryBot.create(:resolution)
    parent_resolution.update_attributes(player_roll_result: '1111111321')
    child_resolution = FactoryBot.create(:trait_resolution,
      parent_resolution: parent_resolution,
      active_player: parent_resolution.active_player,
      conflict: parent_resolution.conflict,
      burned_trait_type: '0')
    expect(child_resolution.player_roll_result).not_to eq parent_resolution.player_roll_result
    # the eighth and ninth dice were not ones, so they should not have been rerolled
    expect(child_resolution.player_roll_result[7]).to eq parent_resolution.player_roll_result[7]
    expect(child_resolution.player_roll_result[8]).to eq parent_resolution.player_roll_result[8]
  end

  it "requires a parent resolution made by the same player" do
    parent_resolution = FactoryBot.create(:resolution, :at_least_one_one_rolled)
    parent_resolution.active_player.update_attributes(card_order: '102')
    different_player_resolution = FactoryBot.build(:trait_resolution,
      parent_resolution: parent_resolution,
      conflict: parent_resolution.conflict,
      active_player: FactoryBot.create(:participation, game: parent_resolution.scene.game))
    expect(different_player_resolution).not_to be_valid
    same_player_resolution = FactoryBot.build(:trait_resolution,
      parent_resolution: parent_resolution,
      conflict: parent_resolution.conflict,
      active_player: parent_resolution.active_player,
      burned_trait_type: '1')
    expect(same_player_resolution).to be_valid
  end

  it "cannot be created for a parent resolution that didn't roll any ones" do
    parent_resolution = FactoryBot.create(:resolution)
    parent_resolution.update_attributes(player_roll_result: '2222222222')
    parent_resolution.active_player.update_attributes(card_order: '012')
    same_player_resolution = FactoryBot.build(:trait_resolution,
      parent_resolution: parent_resolution,
      conflict: parent_resolution.conflict,
      active_player: parent_resolution.active_player,
      burned_trait_type: '0')
    expect(same_player_resolution).not_to be_valid
  end

  it "can only be created by a player with the specified trait available" do
    game_with_ready_players = FactoryBot.create(:game_ready)
    player = game_with_ready_players.participations.players.take
    player.update_attributes(card_order: '012')
    prior_trait_burn = FactoryBot.create(:trait_resolution,
      :succeeded,
      :confirmed,
      game: game_with_ready_players,
      active_player: player,
      burned_trait_type: '0')
    expect(prior_trait_burn).to be_valid
    second_burn = FactoryBot.build(:trait_resolution,
      game: game_with_ready_players,
      active_player: player,
      burned_trait_type: '0')
    expect(second_burn).not_to be_valid
  end

  it "does not reroll the GM's result" do
    resolution = FactoryBot.create(:trait_resolution, burned_trait_type: '0')
    expect(resolution.parent_resolution.gm_roll_result).to eq resolution.gm_roll_result
  end
end
