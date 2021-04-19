FactoryBot.define do
  factory :participation do
    sequence(:name){|i| "Test Player #{i}" }
    role { 'player' }

    game

    trait :with_written_traits do
      sequence :written_virtue do |i|
        "virtue #{i}"
      end
      sequence :written_vice do |i|
        "vice #{i}"
      end
    end

    trait :with_moment do
      sequence :moment do |i|
        "moment #{i}"
      end
    end

    trait :with_concept do
      sequence :character_concept do |i|
        "character concept #{i}"
      end
    end

    trait :with_written_brink do
      sequence :written_brink do |i|
        "brink #{i}"
      end
    end

    trait :with_traits do
      sequence :virtue do |i|
        "virtue #{i}"
      end
      sequence :vice do |i|
        "vice #{i}"
      end
    end

    trait :with_brink do
      sequence :brink do |i|
        "brink #{i}"
      end
    end

    trait :with_card_order do
      card_order { '012' }
    end

    factory :filled_in_participation,
            aliases: [:active_player],
            traits: [:with_traits, :with_moment, :with_concept, :with_brink, :with_card_order] do
      game factory: :game_ready

      factory :participation_down_to_brink do
        resolutions do
          [
            association(:trait_resolution,
              active_player: instance,
              game: instance.game,
              burned_trait_type: '0'),
            association(:trait_resolution,
              active_player: instance,
              game: instance.game,
              burned_trait_type: '1'),
            association(:moment_resolution,
              active_player: instance,
              game: instance.game)
          ]
        end
      end
    end
  end
end
