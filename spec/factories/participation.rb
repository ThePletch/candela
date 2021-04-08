FactoryBot.define do
  factory :participation do
    sequence(:name){|i| "Test Player #{i}" }
    role { 'player' }

    game

    factory :filled_in_participation, aliases: [:active_player] do
      sequence :virtue do |i|
        "virtue #{i}"
      end
      sequence :vice do |i|
        "vice #{i}"
      end
      sequence :moment do |i|
        "moment #{i}"
      end
      sequence :character_concept do |i|
        "character concept #{i}"
      end
      sequence :brink do |i|
        "brink #{i}"
      end
      card_order { '012' }

      factory :participation_down_to_brink do
        game factory: :game_ready

        after(:create) do |participation, evaluator|
          # burned your virtue
          FactoryBot.create(:trait_resolution,
            active_player: participation,
            game: participation.game,
            burned_trait_type: '0')
          # burned your vice
          FactoryBot.create(:trait_resolution,
            active_player: participation,
            game: participation.game,
            burned_trait_type: '1')
          # lived your moment
          FactoryBot.create(:moment_resolution,
            active_player: participation,
            game: participation.game)
        end
      end
    end
  end
end
