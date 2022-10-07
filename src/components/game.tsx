import _ from "lodash";
import Container from 'react-bootstrap/Container';

import CandleIndicator from "@candela/components/candle_indicator";
import ParticipationsList from "@candela/components/participations_list";
import StartGamePrompt from "@candela/components/game_setup/start_game_prompt";
import TraitsPrompt from "@candela/components/game_setup/traits_prompt";
import ModuleIntroPrompt from "@candela/components/game_setup/module_intro_prompt";
import CharacterConceptPrompt from "@candela/components/game_setup/character_concept_prompt";
import MomentPrompt from "@candela/components/game_setup/moment_prompt";
import BrinkPrompt from "@candela/components/game_setup/brink_prompt";
import CardOrderPrompt from "@candela/components/game_setup/card_order_prompt";
import Minimap from "@candela/components/minimap";
import Scene from "@candela/components/scene";
import type { Game as GameType } from "@candela/types/game";
import type { SelfParticipation } from '@candela/types/participation';
import type { GameProps } from '@candela/types/props';
import type { Scene as SceneType } from "@candela/types/scene";
import { GameContext, GameParticipationsContext, GameScenesContext } from '@candela/util/contexts';
import { ModelListSubscription, useSubscriptionContext } from '@candela/util/state';

function Game(props: GameProps) {
  return useSubscriptionContext(GameScenesContext, "Loading scenes...", (scenes) => {
    const activeScene = scenes.find((s) => !s.failed);

    function dicePoolCount(activeScene: SceneType | undefined) {
      return activeScene?.basePlayerDicePool ?? 0;
    }

    function currentSetupStatePrompt(game: GameType) {
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
              {...props}
            />
          );
        case "traits":
          return (
            <TraitsPrompt
              {...props}
            />
          );
        case "module_intro":
          return (
            <ModuleIntroPrompt
              {...props}
            />
          );
        case "character_concept":
          return (
            <CharacterConceptPrompt
              {...props}
            />
          );
        case "moments":
          return (
            <MomentPrompt
              {...props}
            />
          );
        case "brinks":
          return (
            <BrinkPrompt
              {...props}
            />
          );
        case "order_cards":
          return (
            <CardOrderPrompt
              {...props}
            />
          );
        case "ready":
          if (!activeScene) {
            return (<em>No active scene yet. Error?</em>);
          }
          return (
            <Scene
              scene={activeScene}
              {...props}
            />
          );
        default:
          throw new Error(`Unknown setup state ${game?.setupState}`);
      }
    }

    return (
      <Container fluid className="game-interface">
        <h1>{props.game.name || "Loading"}</h1>
        <Minimap />
        <CandleIndicator
          lit={props.game.candlesLit || 0}
          dicePool={dicePoolCount(activeScene)}
        />
        <div className="game-main">
          <div>{currentSetupStatePrompt(props.game)}</div>
        </div>
        <div className="info-panel">
          <ParticipationsList me={props.me} />
          <div className="game-stats">
            <div className="stat-button">
              Candles lit:
              <span className="stat-number">{props.game.candlesLit}</span>
            </div>
            <div className="stat-button">
              Player dice pool:
              <span className="stat-number">{dicePoolCount(activeScene)}</span>
            </div>
          </div>
        </div>
      </Container>
    );
  });
};

export default function(props: { me: SelfParticipation }) {
  return useSubscriptionContext(GameContext, "Loading game...", (game) => {
    const gameIdParams = { game_id: game.id };

    return <ModelListSubscription channel="ParticipationsChannel" params={gameIdParams} context={GameParticipationsContext}>
      <ModelListSubscription channel="ScenesChannel" params={gameIdParams} context={GameScenesContext}>
        <Game game={game} me={props.me} />
      </ModelListSubscription>
    </ModelListSubscription>;
  });
}
