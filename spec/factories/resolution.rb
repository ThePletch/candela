FactoryBot.define do
  factory :resolution, class: 'RollResolution' do
    transient do
      game { FactoryBot.build(:game_ready) }
      scene { FactoryBot.build(:scene_with_truths, game: game) }
    end

    conflict { association :conflict, scene: scene }
    active_player { association :active_player, game: conflict.scene.game }

    trait :failed do
      player_roll_result { instance.roll_for_player.gsub(/[56]/, '4') }
    end

    trait :at_least_one_one_rolled do
      player_roll_result { '1' + instance.roll_for_player[1..-1] }
    end

    trait :confirmed do
      state { 'confirmed' }
      succeeded { instance.successful? }
    end

    trait :succeeded do
      player_roll_result { '6' + instance.roll_for_player[1..-1] }
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

      active_player { association :participation_down_to_brink, game: game }
    end

    factory :martyr_resolution, class: 'MartyrResolution' do
      conflict { association :conflict_narrated, scene: scene, dire: true }
      parent_resolution { association :resolution, :failed, :confirmed, conflict: instance.conflict }

      active_player { association :active_player, game: instance.conflict.scene.game }
    end
  end
end
