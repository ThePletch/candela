FactoryBot.define do
  factory :resolution, class: 'RollResolution' do
    transient do
      game { create(:game_ready) }
      scene { create(:scene, game: game)}
    end

    conflict { association :conflict_narrated, scene: scene }
    active_player { game.participations.players.first }

    trait :failed do
      transient do
        confirmed { false }
      end

      after(:create) do |resolution, evaluator|
        # replace all 5's and 6's with 4's to prevent success even with hope dice
        new_player_roll = resolution.player_roll_result.chars.map do |single_roll|
          if ['5', '6'].include?(single_roll)
            '4'
          else
            single_roll
          end
        end.join

        resolution.update_attributes(player_roll_result: new_player_roll)

        resolution.confirm! if evaluator.confirmed
      end
    end

    trait :at_least_one_one_rolled do
      after(:create) do |resolution, evaluator|
        # turn the first die roll into a 1
        new_player_roll = resolution.player_roll_result.chars
        new_player_roll[0] = '1'

        resolution.update_attributes(player_roll_result: new_player_roll.join)
      end
    end

    trait :succeeded do
      transient do
        confirmed { false }
      end

      after(:create) do |resolution, evaluator|
        # turn the first die roll into a 6
        new_player_roll = resolution.player_roll_result.chars
        new_player_roll[0] = '6'

        resolution.update_attributes(player_roll_result: new_player_roll.join)
        resolution.confirm! if evaluator.confirmed
      end
    end

    trait :has_parent do
      parent_resolution { association :resolution, conflict: instance.conflict }
    end

    trait :has_same_player_parent do
      parent_resolution { association :resolution, conflict: instance.conflict, active_player: instance.active_player }
    end


    factory :moment_resolution, class: 'MomentResolution'

    factory :trait_resolution, class: 'TraitResolution' do
      parent_resolution { association :resolution, :at_least_one_one_rolled, conflict: instance.conflict, active_player: instance.active_player }
    end

    factory :brink_resolution, class: 'BrinkResolution' do
      has_same_player_parent
      active_player { association :participation_down_to_brink, game: instance.conflict.scene.game }
    end

    factory :martyr_resolution, class: 'MartyrResolution' do
      transient do
        confirmed { false }
      end

      conflict { association :conflict_narrated, scene: scene, dire: true }
      parent_resolution { association :resolution, :failed, confirmed: true, conflict: instance.conflict }
      beneficiary_player { instance.parent_resolution.active_player }
      active_player { game.participations.players.find{|p| p != instance.beneficiary_player } }

      after(:create) do |resolution, evaluator|
        resolution.confirm! if evaluator.confirmed
      end
    end
  end
end
