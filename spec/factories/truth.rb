FactoryBot.define do
  factory :truth do
    scene
    sequence :description do |i|
      "Truth #{i}"
    end

    before(:create) do |truth, evaluator|
      truth.participation = truth.scene.next_truth_stater
    end
  end
end
