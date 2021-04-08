FactoryBot.define do
  factory :game do
    name { 'Test Game' }

    factory :game_with_players do
      transient do
        players_count { 2 }
        include_gm { true }
      end

      after(:create) do |game, evaluator|
        if evaluator.include_gm
          create(:participation, game: game, role: 'gm')
        end

        create_list(:participation, evaluator.players_count, game: game, role: 'player')
      end

      factory :game_in_traits_stage do
        after(:create) do |game, evaluator|
          game.transition_to_next_stage!
        end

        factory :game_in_module_intro do
          after(:create) do |game, evaluator|
            game.participations.players.each do |player|
              player.written_virtue = player.name + ' Virtue'
              player.written_vice = player.name + ' Vice'
              player.save!
            end

            game.transition_to_next_stage!
          end

          factory :game_in_concepts_stage do
            after(:create) do |game, evaluator|
              game.transition_to_next_stage!
            end

            factory :game_in_moments_stage do
              after(:create) do |game, evaluator|
                game.participations.players.each do |player|
                  player.character_concept = player.name + ' Concept'
                  player.save!
                end

                game.transition_to_next_stage!
              end

              factory :game_in_brinks_stage do
                after(:create) do |game, evaluator|
                  game.participations.players.each do |player|
                    player.moment = player.name + ' Moment'
                    player.save!
                  end

                  game.transition_to_next_stage!
                end

                factory :game_in_card_ordering_stage do
                  after(:create) do |game, evaluator|
                    game.participations.each do |player|
                      player.written_brink = player.name + ' Brink'
                      player.save!
                    end

                    game.transition_to_next_stage!
                  end

                  factory :game_ready do
                    after(:create) do |game, evaluator|
                      game.participations.players.each do |player|
                        player.card_order = '012'
                        player.save!
                      end

                      game.transition_to_next_stage!
                    end
                  end
                end
              end
            end
          end
        end
      end
    end
  end
end
