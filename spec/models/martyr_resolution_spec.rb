require 'rails_helper'

RSpec.describe MartyrResolution, type: :model do
  it "is always a failure" do
    martyr_resolution = FactoryBot.create(:martyr_resolution, :confirmed)
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

  it "does not allow beneficiary players if the player died, but has no hope dice" do
    dire_conflict = FactoryBot.create(:conflict, dire: true)
    failure = FactoryBot.create(:martyr_resolution, :failed, conflict: dire_conflict, beneficiary_player: nil)
    expect(failure).to be_valid
    expect(failure.confirm!).to be true
    failure.beneficiary_player = dire_conflict.scene.game.participations.players.where.not(id: failure.active_player.id).first
    expect(failure).not_to be_valid
  end

  context "when the player has hope dice" do
    before do
      @moment_resolution = FactoryBot.create(:moment_resolution, :succeeded, :confirmed)
    end

    it "requires a beneficiary player to confirm if a failure on a dire conflict" do
      dire_conflict = FactoryBot.create(:conflict, dire: true, scene: @moment_resolution.scene)
      failure = FactoryBot.create(:martyr_resolution, :failed,
        active_player: @moment_resolution.active_player,
        conflict: dire_conflict,
        beneficiary_player: nil)
      expect(failure.confirm!).to be false
      failure.beneficiary_player = @moment_resolution.scene.game.participations.players.where.not(id: failure.active_player.id).first
      failure.save!
      expect(failure.confirm!).to be true
    end

    it "does not allow the player to designate themselves as a beneficiary" do
      dire_conflict = FactoryBot.create(:conflict, dire: true, scene: @moment_resolution.scene)
      failure = FactoryBot.create(:martyr_resolution, :failed,
        active_player: @moment_resolution.active_player,
        conflict: dire_conflict,
        beneficiary_player: nil)
      expect(failure).to be_valid
      failure.beneficiary_player = @moment_resolution.active_player
      expect(failure).not_to be_valid
      expect(failure.confirm!).to be false
    end

    it "does not allow designating the gm as a beneficiary" do
      dire_conflict = FactoryBot.create(:conflict, dire: true, scene: @moment_resolution.scene)
      failure = FactoryBot.create(:martyr_resolution, :failed,
        active_player: @moment_resolution.active_player,
        conflict: dire_conflict,
        beneficiary_player: nil)
      expect(failure).to be_valid
      expect(failure.confirm!).to be false
      failure.beneficiary_player = @moment_resolution.scene.game.participations.gms.first
      expect(failure).not_to be_valid
      expect(failure.confirm!).to be false
    end

    it "does not allow beneficiary players not in this game" do
      dire_conflict = FactoryBot.create(:conflict, dire: true, scene: @moment_resolution.scene)
      failure = FactoryBot.create(:martyr_resolution, :failed,
        active_player: @moment_resolution.active_player,
        conflict: dire_conflict,
        beneficiary_player: nil)
      expect(failure).to be_valid
      expect(failure.confirm!).to be false
      failure.beneficiary_player = FactoryBot.create(:participation)
      expect(failure).not_to be_valid
    end
  end
end
