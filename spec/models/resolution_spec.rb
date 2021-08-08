require 'rails_helper'

RSpec.describe Resolution, type: :model do
  it "records rolls on creation" do
    resolution = FactoryBot.create(:resolution)
    expect(resolution.player_roll_result).to match(/[1-6]{10}/)
    expect(resolution.gm_roll_result).to match(/[1-6]{10}/)
  end

  it "records rolls with reduced dice pools if pools are reduced by past scenes" do
    failed_resolution = FactoryBot.create(:resolution, :failed, :confirmed)
    # start with 9 dice in the pool in scene two
    new_resolution = FactoryBot.create(:resolution, :succeeded, :confirmed, game: failed_resolution.scene.game)
    expect(new_resolution.player_roll_result).to match(/[1-6]{9}/)
    expect(new_resolution.gm_roll_result).to match(/[1-6]{9}/)

    # start with 8 dice in the pool in scene three
    another_new_resolution = FactoryBot.create(:resolution, :succeeded, :confirmed, game: failed_resolution.scene.game)
    another_new_resolution.update(player_roll_result: '11666666')

    # now there's only 6 dice in the pool for this scene since we rolled two ones
    a_second_resolution = FactoryBot.create(:resolution, scene: another_new_resolution.scene)
    expect(a_second_resolution.player_roll_result).to match(/[1-6]{6}/)
    expect(a_second_resolution.gm_roll_result).to match(/[1-6]{8}/)
  end

  it "marks any rolled ones as lost dice" do
    resolution = FactoryBot.create(:resolution)
    resolution.update(player_roll_result: '1234561234')
    expect(resolution.dice_lost).to eq 2
  end

  it "doesn't mark hope dice as lost dice" do
    game = FactoryBot.create(:game_ready)
    martyring_player = game.participations.players.first
    surviving_player = game.participations.players.second
    martyr_scene = FactoryBot.create(:scene, game: game)
    # martyr lives their moment, so they have a hope die
    martyr_moment_conflict = FactoryBot.create(:conflict, scene: martyr_scene)
    martyr_moment = FactoryBot.create(:moment_resolution, :succeeded, :confirmed, conflict: martyr_moment_conflict)
    # martyr dies and gives their hope die to the survivor
    martyr_conflict = FactoryBot.create(:conflict, scene: martyr_scene, dire: true)
    parent_resolution = FactoryBot.create(:resolution, :failed, conflict: martyr_conflict, active_player: surviving_player)
    martyr_resolution = FactoryBot.create(:martyr_resolution, :confirmed,
      active_player: martyring_player,
      beneficiary_player: surviving_player,
      parent_resolution: parent_resolution,
      conflict: martyr_conflict
    )  # f's in chat

    # player lives their moment and gets a second hope die
    new_scene = FactoryBot.create(:scene, game: game)
    new_conflict = FactoryBot.create(:conflict, scene: new_scene)
    moment_resolution = FactoryBot.create(:moment_resolution, :succeeded, :confirmed, conflict: new_conflict, active_player: surviving_player)
    # make sure there aren't any ones in this roll to avoid losing dice from the pool in the next conflict
    moment_resolution.update(player_roll_result: '6' * 9)

    conflict_with_hope_dice = FactoryBot.create(:conflict, scene: new_scene)
    # this player has had a hope die given to them by a dying player and gotten one from living their moment, so they
    # have two dice they can't lose
    new_resolution = FactoryBot.create(:resolution, conflict: conflict_with_hope_dice, active_player: surviving_player)
    new_resolution.update(player_roll_result: '111654323')
    expect(new_resolution.dice_lost).to eq 1
  end

  it "does not allow overriding a resolution that is itself an override" do
    resolution = FactoryBot.create(:resolution, :at_least_one_one_rolled)
    override = FactoryBot.create(:trait_resolution,
      parent_resolution: resolution,
      conflict: resolution.conflict,
      active_player: resolution.active_player,
      burned_trait_type: '0')
    expect(override).to be_valid
    second_override = FactoryBot.build(:brink_resolution,
      parent_resolution: override,
      conflict: resolution.conflict,
      active_player: resolution.active_player)
    expect(second_override).not_to be_valid
  end
end
