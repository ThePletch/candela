import _ from "lodash";

import CandleIndicator from "@candela/components/candle_indicator";
import ParticipationsList from "@candela/components/participations_list";
import StartGamePrompt from "@candela/components/game_setup/start_game_prompt";
import TraitsPrompt from "@candela/components/game_setup/traits_prompt";
import ModuleIntroPrompt from "@candela/components/game_setup/module_intro_prompt";
import CharacterConceptPrompt from "@candela/components/game_setup/character_concept_prompt";
import MomentPrompt from "@candela/components/game_setup/moment_prompt";
import BrinkPrompt from "@candela/components/game_setup/brink_prompt";
import CardOrderPrompt from "@candela/components/game_setup/card_order_prompt";
import Scene from "@candela/components/scene";
import type { Scene as SceneType } from "@candela/types/scene";
import {
  withModelListSubscription,
  withSingletonSubscription,
} from "@candela/util/state";

type GameProps = {
  participationId: number;
  gameId: number;
};

type Game = {
  name: string;
  candlesLit: number;
  activeScene?: any;
  isOver: boolean;
  setupState: string;
};

export default function Game(props: GameProps) {
  return withSingletonSubscription(
    "GameChannel",
    { id: props.gameId },
    (game: Game) => {
      return withModelListSubscription(
        "ScenesChannel",
        { game_id: props.gameId },
        (scenes: SceneType[]) => {
          const activeScene = scenes.find((s) => !s.failed);
          function dicePoolCount() {
            return activeScene?.basePlayerDicePool ?? 0;
          }

          function currentSetupStatePrompt() {
            if (game.isOver) {
              return (
                <div>
                  <em>These things are true...</em>
                  <br />
                  <strong>The world is dark.</strong>
                  <br />
                  <br />
                  <small>Thank you for playing.</small>
                </div>
              );
            }

            switch (game.setupState) {
              case "nascent":
                return (
                  <StartGamePrompt
                    gameId={props.gameId}
                    participationId={props.participationId}
                  />
                );
              case "traits":
                return (
                  <TraitsPrompt
                    gameId={props.gameId}
                    participationId={props.participationId}
                  />
                );
              case "module_intro":
                return (
                  <ModuleIntroPrompt
                    gameId={props.gameId}
                    participationId={props.participationId}
                  />
                );
              case "character_concept":
                return (
                  <CharacterConceptPrompt
                    gameId={props.gameId}
                    participationId={props.participationId}
                  />
                );
              case "moments":
                return (
                  <MomentPrompt
                    gameId={props.gameId}
                    participationId={props.participationId}
                  />
                );
              case "brinks":
                return (
                  <BrinkPrompt
                    gameId={props.gameId}
                    participationId={props.participationId}
                  />
                );
              case "order_cards":
                return (
                  <CardOrderPrompt
                    gameId={props.gameId}
                    participationId={props.participationId}
                  />
                );
              case "ready":
                if (!activeScene) {
                  throw new Error("Game is ready, but no active scene.");
                }
                return (
                  <Scene
                    scene={activeScene}
                    participationId={props.participationId}
                  />
                );
              default:
                throw new Error(`Unknown setup state ${game.setupState}`);
            }
          }

          return (
            <div className="container-fluid game-interface">
              <h1>{game.name}</h1>
              <CandleIndicator
                lit={game.candlesLit}
                dicePool={dicePoolCount()}
              />
              <div className="game-main">
                <div>{currentSetupStatePrompt()}</div>
              </div>
              <div className="info-panel">
                <ParticipationsList
                  participationId={props.participationId}
                  gameId={props.gameId}
                />
                <div className="game-stats">
                  <div className="stat-button">
                    Candles lit:
                    <span className="stat-number">{game.candlesLit}</span>
                  </div>
                  <div className="stat-button">
                    Player dice pool:
                    <span className="stat-number">{dicePoolCount()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      );
    }
  );
}
