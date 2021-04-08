FactoryBot.define do
  factory :scene do
    association :game, factory: :game_ready

    factory :scene_with_truths do
      transient do
        truths_count { 9 }
      end

      after(:create) do |scene, evaluator|
        participations = scene.game.participations
        evaluator.truths_count.times do |i|
          stater = participations[i % participations.count]
          FactoryBot.create(:truth, scene: scene, participation: stater)
        end
      end
    end

    trait :failed do
      after(:create) do |scene, evaluator|
        FactoryBot.create(:conflict_failed, scene: scene)
      end
    end
  end
end
