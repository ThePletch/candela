import Toast from 'react-bootstrap/Toast';

import ProceedButton from '@candela/components/game_setup/proceed_button';
import type { GameProps } from '@candela/types/props';
import { GameParticipationsContext } from '@candela/util/contexts';
import { useHttpState, useSubscriptionContext } from '@candela/util/state';

export default function StartGamePrompt(props: GameProps) {
  const startGame = useHttpState(
    `api/games/${props.game.id}/advance_setup_state`,
    'PATCH',
    props.me.guid,
    { current_setup_state: 'nascent' },
  );

  return useSubscriptionContext(
    GameParticipationsContext(props.game.id),
    'Loading players...',
    (participations) => {
      if (props.me.role === 'gm') {
        return (
          <ProceedButton
            label="Start the Game"
            httpRequest={startGame}
            disabled={participations.length < 3}
            disabledTooltip="You can't start the game unless you have at least two players."
          />
        );
      }

      return (
        <Toast>
          <Toast.Body>
            The GM will begin the game once all players have joined.
          </Toast.Body>
        </Toast>
      );
    },
  );
}
