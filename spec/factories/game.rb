FactoryBot.define do
  factory :game do
    name { 'Test Game' }

    factory :game_with_players do
      transient do
        players_count { 2 }
        include_gm { true }
      end

      participations do
        Array.new(players_count) do
          association :participation, role: 'player', game: instance
        end + [association(:participation, role: 'gm', game: instance)]
      end

      factory :game_in_traits_stage do
        setup_state { 'traits' }

        factory :game_in_module_intro do
          setup_state { 'module_intro' }

          participations do
            Array.new(players_count) do
              association :participation, :with_traits, role: 'player', game: instance
            end + [association(:participation, role: 'gm', game: instance)]
          end

          factory :game_in_concepts_stage do
            setup_state { 'character_concept' }

            factory :game_in_moments_stage do
              setup_state { 'moments' }

              participations do
                Array.new(players_count) do
                  association :participation,
                    :with_traits,
                    :with_concept,
                    role: 'player',
                    game: instance
                end + [association(:participation, role: 'gm', game: instance)]
              end

              factory :game_in_brinks_stage do
                setup_state { 'brinks' }

                participations do
                  Array.new(players_count) do
                    association :participation,
                      :with_traits,
                      :with_concept,
                      :with_moment,
                      role: 'player',
                      game: instance
                  end + [association(:participation, role: 'gm', game: instance)]
                end

                factory :game_in_card_ordering_stage do
                  setup_state { 'order_cards' }

                  participations do
                    Array.new(players_count) do
                      association :participation,
                        :with_traits,
                        :with_concept,
                        :with_moment,
                        :with_brink,
                        role: 'player',
                        game: instance
                    end + [association(:participation, role: 'gm', game: instance)]
                  end

                  factory :game_ready do
                    setup_state { 'ready' }

                    transient do
                      starting_scene { FactoryBot.build(:scene, game: instance) }
                    end

                    scenes { [starting_scene] }

                    participations do
                      Array.new(players_count) do
                        association :participation,
                          :with_traits,
                          :with_concept,
                          :with_moment,
                          :with_brink,
                          :with_card_order,
                          role: 'player',
                          game: instance
                      end + [association(:participation, role: 'gm', game: instance)]
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
