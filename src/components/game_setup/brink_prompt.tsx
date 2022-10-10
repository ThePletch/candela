import BrinkForm from '@candela/components/game_setup/brink_form';
import ProceedButton from '@candela/components/game_setup/proceed_button';
import PopupForm from '@candela/components/popup_form';
import type { Participation } from '@candela/types/participation';
import type { GameProps } from '@candela/types/props';
import { GameParticipationsContext } from '@candela/util/contexts';
import { useHttpState, useSubscriptionContext } from '@candela/util/state';

export default function BrinkPrompt(props: GameProps) {
  const advanceToCardOrder = useHttpState(
    `api/games/${props.game.id}/advance_setup_state`,
    'PATCH',
    props.me.guid,
    { current_setup_state: 'brinks' },
  );

  return useSubscriptionContext(
    GameParticipationsContext(props.game.id),
    'Loading players...',
    (participations) => {
      function playersWithUnfilledBrink(participations: Participation[]) {
        return participations.filter(playerWithBrinkUnfilled);
      }

      function playerWithBrinkUnfilled(participation: Participation) {
        return !participation.hasWrittenBrink;
      }

      const unfilledBrinkPlayers = playersWithUnfilledBrink(participations);
      const brinkForm = (
        <PopupForm
          label="Write your brink"
          formComplete={props.me.writtenBrink != undefined}
        >
          <BrinkForm
            participation={props.me}
            allParticipations={participations}
          />
        </PopupForm>
      );
      if (props.me.role === 'gm') {
        return (
          <>
            <ProceedButton
              label="Proceed to Card Order"
              httpRequest={advanceToCardOrder}
              disabled={unfilledBrinkPlayers.length > 0}
              disabledTooltip="Some people are still writing their brinks."
            />
            {brinkForm}
          </>
        );
      }

      return brinkForm;
    },
  );
}
