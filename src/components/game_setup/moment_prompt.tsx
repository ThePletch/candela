import Toast from 'react-bootstrap/Toast';

import MomentForm from '@candela/components/game_setup/moment_form';
import ProceedButton from '@candela/components/game_setup/proceed_button';
import PopupForm from '@candela/components/popup_form';
import type { Participation } from '@candela/types/participation';
import type { GameProps } from '@candela/types/props';
import { GameParticipationsContext, MeContext } from '@candela/util/contexts';
import { useHttpState, useSubscriptionContexts } from '@candela/util/state';

function playerWithMomentUnfilled(participation: Participation) {
  return participation.role === 'player' && !participation.hasMoment;
}

function playersWithUnfilledMoment(
  participations: Participation[],
): Participation[] {
  return participations.filter(playerWithMomentUnfilled);
}

export default function MomentPrompt(props: GameProps) {
  const advanceToBrinks = useHttpState(
    `api/games/${props.game.id}/advance_setup_state`,
    'PATCH',
    props.me.guid,
    { current_setup_state: 'moments' },
  );

  return useSubscriptionContexts(
    {
      participations: {
        context: GameParticipationsContext(props.game.id),
        loadingMessage: 'Loading players...',
      },
      me: {
        context: MeContext(props.me.guid),
        loadingMessage: 'Loading your information...',
      },
    },
    ({ me, participations }) => {
      const unfilledMomentPlayers = playersWithUnfilledMoment(participations);

      if (me.role === 'gm') {
        return (
          <>
            <Toast>
              <Toast.Body>
                The players are writing their moments. Pay attention to these.
                You'll want to look for chances throughout the story to let players
                get their moments of hope.
              </Toast.Body>
            </Toast>
            <ProceedButton
              label="Proceed to Brinks"
              httpRequest={advanceToBrinks}
              disabled={unfilledMomentPlayers.length > 0}
              disabledTooltip="Some players are still writing their moment."
            />
          </>
        );
      }

      return (
        <PopupForm label="Write your moment" formComplete={me.moment != null}>
          <MomentForm me={me} />
        </PopupForm>
      );
    },
  );
}
