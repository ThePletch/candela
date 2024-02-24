import { useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import CandleIndicator from '@candela/components/candle_indicator';
import StartGamePrompt from '@candela/components/game_setup/start_game_prompt';
import TraitsPrompt from '@candela/components/game_setup/traits_prompt';
import ModuleIntroPrompt from '@candela/components/game_setup/module_intro_prompt';
import CharacterConceptPrompt from '@candela/components/game_setup/character_concept_prompt';
import MomentPrompt from '@candela/components/game_setup/moment_prompt';
import BrinkPrompt from '@candela/components/game_setup/brink_prompt';
import CardOrderPrompt from '@candela/components/game_setup/card_order_prompt';
import Minimap from '@candela/components/minimap';
import Scene from '@candela/components/scene';
import type { SelfParticipation } from '@candela/types/participation';
import type { GameProps } from '@candela/types/props';
import type { Scene as SceneType } from '@candela/types/scene';
import {
  GameContext,
  GameParticipationsContext,
  GameScenesContext,
} from '@candela/util/contexts';
import {
  ModelListSubscription,
  useSubscriptionContext,
} from '@candela/util/state';

function CurrentSetupStatePrompt({
  me,
  game,
  scene = undefined,
}: GameProps & { scene?: SceneType }) {
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
    case 'nascent':
      return <StartGamePrompt game={game} me={me} />;
    case 'traits':
      return <TraitsPrompt game={game} me={me} />;
    case 'module_intro':
      return <ModuleIntroPrompt game={game} me={me} />;
    case 'character_concept':
      return <CharacterConceptPrompt game={game} me={me} />;
    case 'moments':
      return <MomentPrompt game={game} me={me} />;
    case 'brinks':
      return <BrinkPrompt game={game} me={me} />;
    case 'order_cards':
      return <CardOrderPrompt game={game} me={me} />;
    case 'ready':
      if (!scene) {
        return <em>No active scene yet. Error?</em>;
      }

      return <Scene scene={scene} me={me} />;
    default:
      throw new Error(`Unknown setup state ${game?.setupState}`);
  }
}

function Game({ game, me }: GameProps) {
  const [pageTitle, setPageTitle] = useState('Loading game...');

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return useSubscriptionContext(
    GameScenesContext(game.id),
    'Loading scenes...',
    (scenes) => {
      const activeScene = scenes[scenes.length - 1];

      function dicePoolCount(scene: SceneType | undefined) {
        return scene?.basePlayerDicePool ?? 0;
      }

      const title = `${game.name} [${me.name}] - Candela`;
      if (pageTitle !== title) {
        setPageTitle(title);
      }

      const dicePoolInfo = (
        <Tooltip>
          Players are rolling
          {' '}
          {dicePoolCount(activeScene)}
          {' '}
          dice for conflicts.
          <br />
          {game.candlesLit}
          {' '}
          candles remain lit.
        </Tooltip>
      );

      return (
        <Container fluid className="game-interface">
          <OverlayTrigger overlay={dicePoolInfo} placement="bottom">
            <Badge bg="info" className="game-actions">
              {game.candlesLit}
              /
              {dicePoolCount(activeScene)}
            </Badge>
          </OverlayTrigger>
          <div className="game-actions">
            <CurrentSetupStatePrompt scene={activeScene} game={game} me={me} />
          </div>
          <Minimap game={game} me={me} />
          <CandleIndicator
            lit={game.candlesLit || 0}
            dicePool={dicePoolCount(activeScene)}
          />
        </Container>
      );
    },
  );
}

export default function GameWithSubscriptions({
  me,
}: {
  me: SelfParticipation;
}) {
  return useSubscriptionContext(
    GameContext(me.gameId),
    'Loading game...',
    (game) => {
      const gameIdParams = { game_id: game.id, guid: me.guid };

      return (
        <ModelListSubscription
          channel="ParticipationsChannel"
          params={gameIdParams}
          context={GameParticipationsContext(game.id)}
        >
          <ModelListSubscription
            channel="ScenesChannel"
            params={gameIdParams}
            context={GameScenesContext(game.id)}
          >
            <Game game={game} me={me} />
          </ModelListSubscription>
        </ModelListSubscription>
      );
    },
  );
}
