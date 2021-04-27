require 'rails_helper'

RSpec.describe Conflict, type: :model do
  it "is active if no confirmed resolution exists" do
    conflict = FactoryBot.create(:conflict)
    expect(conflict).to be_active
    resolution = FactoryBot.create(:resolution, :succeeded, :confirmed, conflict: conflict)
    expect(conflict).not_to be_active
  end

  it "validates that there are no other active conflicts for this scene" do
    conflict = FactoryBot.create(:conflict)
    expect(conflict).to be_valid
    another_active_conflict = FactoryBot.build(:conflict, scene: conflict.scene)
    expect(another_active_conflict).not_to be_valid
  end

  it "is valid if there are only active conflicts in other games" do
    conflict = FactoryBot.create(:conflict)
    expect(conflict).to be_valid
    another_active_conflict = FactoryBot.create(:conflict)
    expect(another_active_conflict).to be_valid
  end

  it "is valid if there are only other resolved conflicts in this game" do
    succeeded_conflict = FactoryBot.create(:conflict_succeeded)
    failed_conflict = FactoryBot.create(:conflict_failed, scene: succeeded_conflict.scene)
    expect(succeeded_conflict).to be_valid
    expect(failed_conflict).to be_valid

    new_active_conflict = FactoryBot.create(:conflict, scene: succeeded_conflict.scene)
    expect(new_active_conflict).to be_valid
  end

  it "is failed if a confirmed failed resolution exists" do
    conflict = FactoryBot.create(:conflict)
    expect(conflict).to be_active
    resolution = FactoryBot.create(:resolution, :failed, :confirmed, conflict: conflict)
    expect(conflict).not_to be_succeeded
  end

  it "succeeds if a confirmed successful resolution exists" do
    conflict = FactoryBot.create(:conflict)
    expect(conflict).to be_active
    resolution = FactoryBot.create(:resolution, :succeeded, :confirmed, conflict: conflict)
    expect(conflict).to be_succeeded
  end

  it "is active if an unconfirmed resolution that succeeded OR failed exists" do
    conflict = FactoryBot.create(:conflict)
    expect(conflict).to be_active
    resolution = FactoryBot.create(:resolution, :succeeded, conflict: conflict)
    expect(conflict).to be_active

    other_conflict = FactoryBot.create(:conflict)
    expect(other_conflict).to be_active
    resolution = FactoryBot.create(:resolution, :failed, conflict: other_conflict)
    expect(other_conflict).to be_active
  end
end
