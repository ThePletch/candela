require 'rails_helper'

RSpec.describe Truth, type: :model do
  it "must have a value" do
    first_scene = FactoryBot.create(:scene, :failed)
    second_scene = FactoryBot.create(:scene, game: first_scene.game)

    truth = FactoryBot.build(:truth, description: nil, scene: second_scene)
    expect(truth).not_to be_valid
    truth = FactoryBot.create(:truth, description: 'something', scene: second_scene)
    expect(truth).to be_valid
  end

  it "cannot be created if the scene has no unstated truths" do
    first_scene = FactoryBot.create(:scene, :failed)
    second_scene = FactoryBot.create(:scene_with_truths, game: first_scene.game)
    truth = FactoryBot.build(:truth, scene: second_scene)
    expect(truth).not_to be_valid
  end

  it "cannot be created at all for the first scene" do
    first_scene = FactoryBot.create(:scene)
    truth = FactoryBot.build(:truth, scene: first_scene)
    expect(truth).not_to be_valid
  end
end
