require 'rails_helper'

RSpec.describe Truth, type: :model do
  it "must have a value" do
    failed_first_scene = FactoryBot.create(:scene, :failed)
    second_scene = FactoryBot.create(:scene, game: failed_first_scene.game)

    truth = FactoryBot.build(:truth, description: nil, scene: second_scene)
    expect(truth).not_to be_valid
    truth = FactoryBot.create(:truth, description: 'something', scene: second_scene)
    expect(truth).to be_valid
  end

  it "cannot be created if the scene has no unstated truths" do
    failed_first_scene = FactoryBot.create(:scene, :failed)
    second_scene = FactoryBot.create(:scene, game: failed_first_scene.game)
    8.times { FactoryBot.create(:truth, scene: second_scene) }
    truth = FactoryBot.build(:truth, scene: second_scene)
    expect(truth).not_to be_valid
  end

  it "cannot be created at all for the first scene" do
    first_scene = FactoryBot.create(:game_ready).active_scene
    truth = FactoryBot.build(:truth, scene: first_scene)
    expect(truth).not_to be_valid
  end
end
