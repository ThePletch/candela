FactoryBot.define do
  factory :conflict do
    transient do
      game { create(:game_ready) }
    end

    scene { association :scene, game: game }
    dire { false }
    narrated { false }

    factory :conflict_narrated do
      narrated { true }

      factory :conflict_failed do
        after(:create) do |conflict, evaluator|
          FactoryBot.create(:resolution, :failed, conflict: conflict, confirmed: true)
        end
      end

      factory :conflict_succeeded do
        after(:create) do |conflict, evaluator|
          FactoryBot.create(:resolution, :succeeded, conflict: conflict, confirmed: true)
        end
      end
    end
  end
end
