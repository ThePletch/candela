FactoryBot.define do
  factory :scene do
    game { association :game_ready, starting_scene: instance }

    factory :scene_with_truths do
      transient do
        truths_count { nil }
      end

      truths do
        Array.new(truths_count || instance.expected_truth_count) do |i|
          participations = instance.game.participations
          stater = participations[i % participations.length]
          association(:truth, scene: instance, participation: stater)
        end
      end
    end

    trait :failed do
      conflicts do
        [association(:conflict_failed, scene: instance)]
      end
    end
  end
end
