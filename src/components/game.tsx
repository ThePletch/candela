// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import _ from "lodash";

import CandleIndicator from "./candle_indicator";
import ParticipationsList from "./participations_list";
import StartGamePrompt from "./game_setup/start_game_prompt";
import TraitsPrompt from "./game_setup/traits_prompt";
import ModuleIntroPrompt from "./game_setup/module_intro_prompt";
import CharacterConceptPrompt from "./game_setup/character_concept_prompt";
import MomentPrompt from "./game_setup/moment_prompt";
import BrinkPrompt from "./game_setup/brink_prompt";
import CardOrderPrompt from "./game_setup/card_order_prompt";
import Scene from "./scene";
import type { Scene as SceneType } from "types/scene";
import {
  withModelListSubscription,
  withSingletonSubscription,
} from "util/state";

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

function Game(props: GameProps) {
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

export default Game;
