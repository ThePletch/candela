import lodashIsEmpty from 'lodash/isEmpty';
import CardOrderForm from '@candela/components/game_setup/card_order_form';
import ProceedButton from '@candela/components/game_setup/proceed_button';
import PopupForm from '@candela/components/popup_form';
import type { Participation } from '@candela/types/participation';
import type { GameProps } from '@candela/types/props';
import { GameParticipationsContext } from '@candela/util/contexts';
import { useHttpState, useSubscriptionContext } from '@candela/util/state';

function playerWithCardOrderUnfilled(participation: Participation) {
  return participation.role === 'player' && lodashIsEmpty(participation.cardOrder);
}

function playersWithUnfilledCardOrder(participations: Participation[]) {
  return participations.filter(playerWithCardOrderUnfilled);
}

export default function CardOrderPrompt({ game, me }: GameProps) {
  const beginTheGame = useHttpState(
    `api/games/${game.id}/advance_setup_state`,
    'PATCH',
    me.guid,
    { current_setup_state: 'order_cards' },
  );

  return useSubscriptionContext(
    GameParticipationsContext(game.id),
    'Loading players...',
    (participations) => {
      const unfilledCardOrderPlayers = playersWithUnfilledCardOrder(participations);
      if (me.role === 'gm') {
        return (
          <ProceedButton
            label="Begin the Game"
            httpRequest={beginTheGame}
            disabled={unfilledCardOrderPlayers.length > 0}
            disabledTooltip="Some players are still ordering their cards."
          />
        );
      }

      return (
        <PopupForm
          label="Order your cards"
          formComplete={!lodashIsEmpty(me.cardOrder)}
        >
          <CardOrderForm participation={me} />
        </PopupForm>
      );
    },
  );
}
