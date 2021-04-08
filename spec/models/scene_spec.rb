require 'rails_helper'

RSpec.describe Scene, type: :model do
  it "requires its game to be ready" do
    not_ready_game = FactoryBot.create(:game)
    # build instead of create because trying to save an invalid record raises a RecordInvalid exception
    invalid_scene = FactoryBot.build(:scene, game: not_ready_game)
    expect(invalid_scene).not_to be_valid
  end

  it "is valid if its game is ready" do
    ready_game = FactoryBot.create(:game_ready)
    scene = FactoryBot.create(:scene, game: ready_game)
    expect(scene).to be_valid
  end

  it "doesn't allow any truths for the first scene" do
    scene = FactoryBot.create(:scene)
    expect(scene.expected_truth_count).to eq 0
    truth = FactoryBot.build(:truth, scene: scene)
    expect(truth).not_to be_valid
  end

  it "rotates through players when stating truths" do
    failed_first_scene = FactoryBot.create(:scene, :failed, created_at: 10.minutes.ago)
    second_scene = FactoryBot.create(:scene, game: failed_first_scene.game)
    first_player, second_player, third_player = second_scene.game.participations
    expect(second_scene.next_truth_stater).to eq first_player
    FactoryBot.create(:truth, scene: second_scene, participation: first_player)
    expect(second_scene.next_truth_stater).to eq second_player
    FactoryBot.create(:truth, scene: second_scene, participation: second_player)
    expect(second_scene.next_truth_stater).to eq third_player
    FactoryBot.create(:truth, scene: second_scene, participation: third_player)
    expect(second_scene.next_truth_stater).to eq first_player
    FactoryBot.create(:truth, scene: second_scene, participation: first_player)
  end

  it "asks for a number of truths equal to candles lit after the first scene" do
    failed_first_scene = FactoryBot.create(:scene, :failed, created_at: 10.minutes.ago)
    second_scene = FactoryBot.create(:scene, game: failed_first_scene.game)
    expect(second_scene.expected_truth_count).to eq 9
  end

  it "automatically advances when the correct truth count is stated" do
    failed_first_scene = FactoryBot.create(:scene, :failed, created_at: 10.minutes.ago)
    second_scene = FactoryBot.create(:scene, game: failed_first_scene.game)
    9.times do
      expect(second_scene.state).to eq 'transitioning'
      FactoryBot.create(:truth, scene: second_scene)
    end

    expect(second_scene.state).to eq 'truths_stated'
  end

  it "is failed when one of its conflicts is failed" do
    scene = FactoryBot.create(:scene)
    expect(scene).not_to be_failed
    failed_conflict = FactoryBot.create(:conflict_failed, scene: scene)
    expect(scene).to be_failed
  end

  it "tracks the dice lost in each conflict" do
    scene = FactoryBot.create(:scene)
    expect(scene.dice_lost).to eq 0
    expect(scene.player_dice_pool).to eq 10
    conflict_one = FactoryBot.create(:conflict, scene: scene)
    resolution_one = FactoryBot.create(:resolution, :succeeded, conflict: conflict_one, confirmed: true)
    resolution_one.update_attributes(player_roll_result: '1166666666')
    expect(scene.dice_lost).to eq 2
    expect(scene.player_dice_pool).to eq 8
    conflict_two = FactoryBot.create(:conflict, scene: scene)
    resolution_two = FactoryBot.create(:resolution, :succeeded, conflict: conflict_two, confirmed: true)
    resolution_two.update_attributes(player_roll_result: '11166666')
    expect(scene.dice_lost).to eq 5
    expect(scene.player_dice_pool).to eq 5
  end

  it "doesn't include lost dice from unconfirmed resolutions" do
    scene = FactoryBot.create(:scene)
    expect(scene.dice_lost).to eq 0
    expect(scene.player_dice_pool).to eq 10
    conflict_one = FactoryBot.create(:conflict, scene: scene)
    resolution_one = FactoryBot.create(:resolution, conflict: conflict_one)
    resolution_one.update_attributes(player_roll_result: '1166666666')
    expect(scene.dice_lost).to eq 0
    expect(scene.player_dice_pool).to eq 10
  end

  it "doesn't lose dice from conflicts in other scenes" do
    scene = FactoryBot.create(:scene)
    expect(scene.dice_lost).to eq 0
    expect(scene.player_dice_pool).to eq 10
    conflict_one = FactoryBot.create(:conflict)
    resolution_one = FactoryBot.create(:resolution, :succeeded, conflict: conflict_one, confirmed: true)
    resolution_one.update_attributes(player_roll_result: '1166666666')
    expect(scene.dice_lost).to eq 0
    expect(scene.player_dice_pool).to eq 10
  end

  it "doesn't take dice away from the GM for rolling ones" do
    scene = FactoryBot.create(:scene)
    expect(scene.gm_dice_pool).to eq 10
    conflict_one = FactoryBot.create(:conflict, scene: scene)
    resolution_one = FactoryBot.create(:resolution, :succeeded, conflict: conflict_one, confirmed: true)
    resolution_one.update_attributes(player_roll_result: '1166666666', gm_roll_result: '1116666666')
    expect(scene.gm_dice_pool).to eq 10
  end
end
