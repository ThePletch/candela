FactoryBot.define do
  factory :conflict do
    # you may specify either one of in_game or in_scene and the factory
    # will extrapolate the other.
    # if you specify both, it will use in_scene. it will not confirm that they match.
    transient do
      game { FactoryBot.build(:game_ready) }
    end

    scene { association :scene_with_truths, game: game }

    dire { false }
    narrated { false }

    factory :conflict_narrated do
      narrated { true }

      factory :conflict_failed do
        transient do
          active_player { FactoryBot.build(:filled_in_participation, game: instance.scene.game) }
        end

        resolutions do
          [association(:resolution, :failed, :confirmed, active_player: active_player, conflict: instance)]
        end
      end

      factory :conflict_succeeded do
        transient do
          active_player { FactoryBot.build(:filled_in_participation, game: instance.scene.game) }
        end

        resolutions do
          [association(:resolution, :succeeded, :confirmed, active_player: active_player, conflict: instance)]
        end
      end
    end
  end
end
