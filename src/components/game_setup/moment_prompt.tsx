import MomentForm from '@candela/components/game_setup/moment_form';
import ProceedButton from '@candela/components/game_setup/proceed_button';
import PopupForm from '@candela/components/popup_form';
import type { Participation } from '@candela/types/participation';
import type { GameProps } from '@candela/types/props';
import { GameParticipationsContext, MeContext } from '@candela/util/contexts';
import { useHttpState, useSubscriptionContexts } from '@candela/util/state';

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
      function playersWithUnfilledMoment(
        participations: Participation[],
      ): Participation[] {
        return participations.filter(playerWithMomentUnfilled);
      }

      function playerWithMomentUnfilled(participation: Participation) {
        return participation.role == 'player' && !participation.hasMoment;
      }

      const unfilledMomentPlayers = playersWithUnfilledMoment(participations);

      if (me.role === 'gm') {
        return (
          <ProceedButton
            label="Proceed to Brinks"
            httpRequest={advanceToBrinks}
            disabled={unfilledMomentPlayers.length > 0}
            disabledTooltip="Some players are still writing their moment."
          />
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
