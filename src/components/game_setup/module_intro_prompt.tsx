import Toast from 'react-bootstrap/Toast';

import ProceedButton from '@candela/components/game_setup/proceed_button';
import type { GameProps } from '@candela/types/props';
import { MeContext } from '@candela/util/contexts';
import { useHttpState, useSubscriptionContext } from '@candela/util/state';

export default function ModuleIntroPrompt(props: GameProps) {
  const moveOnToConcept = useHttpState(
    `api/games/${props.game.id}/advance_setup_state`,
    'PATCH',
    props.me.guid,
    { current_setup_state: 'module_intro' },
  );

  return useSubscriptionContext(
    MeContext(props.me.guid),
    'Loading your information...',
    (me) => {
      if (me.role === 'gm') {
        return (
          <>
            <Toast>
              <Toast.Body>
                Introduce the scenario to the players, including the setting
                and how the world has become dark in the last few days to weeks.
              </Toast.Body>
            </Toast>
            <ProceedButton
              label="Done introducing scenario"
              httpRequest={moveOnToConcept}
              disabled={false}
              disabledTooltip=""
            />
          </>
        );
      }

      return (
        <Toast>
          <Toast.Body>The GM is introducing the scenario.</Toast.Body>
        </Toast>
      );
    },
  );
}
