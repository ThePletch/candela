import BrinkForm from '@candela/components/game_setup/brink_form';
import ProceedButton from '@candela/components/game_setup/proceed_button';
import PopupForm from '@candela/components/popup_form';
import type { Participation } from '@candela/types/participation';
import type { GameProps } from '@candela/types/props';
import { GameParticipationsContext } from '@candela/util/contexts';
import { useHttpState, useSubscriptionContext } from '@candela/util/state';

function playerWithBrinkUnfilled(participation: Participation) {
  return !participation.hasWrittenBrink;
}

function playersWithUnfilledBrink(participations: Participation[]) {
  return participations.filter(playerWithBrinkUnfilled);
}

export default function BrinkPrompt({ game, me }: GameProps) {
  const advanceToCardOrder = useHttpState(
    `api/games/${game.id}/advance_setup_state`,
    'PATCH',
    me.guid,
    { current_setup_state: 'brinks' },
  );

  return useSubscriptionContext(
    GameParticipationsContext(game.id),
    'Loading players...',
    (participations) => {
      const unfilledBrinkPlayers = playersWithUnfilledBrink(participations);
      const brinkForm = (
        <PopupForm
          label="Write your brink"
          formComplete={me.writtenBrink !== undefined}
        >
          <BrinkForm participation={me} allParticipations={participations} />
        </PopupForm>
      );
      if (me.role === 'gm') {
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
