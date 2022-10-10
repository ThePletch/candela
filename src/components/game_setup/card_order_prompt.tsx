import CardOrderForm from '@candela/components/game_setup/card_order_form';
import ProceedButton from '@candela/components/game_setup/proceed_button';
import PopupForm from '@candela/components/popup_form';
import type { Participation } from '@candela/types/participation';
import type { GameProps } from '@candela/types/props';
import { GameParticipationsContext } from '@candela/util/contexts';
import { useHttpState, useSubscriptionContext } from '@candela/util/state';

export default function CardOrderPrompt(props: GameProps) {
  const beginTheGame = useHttpState(
    `api/games/${props.game.id}/advance_setup_state`,
    'PATCH',
    props.me.guid,
    { current_setup_state: 'order_cards' },
  );

  return useSubscriptionContext(
    GameParticipationsContext(props.game.id),
    'Loading players...',
    (participations) => {
      function playersWithUnfilledCardOrder(participations: Participation[]) {
        return participations.filter(playerWithCardOrderUnfilled);
      }

      function playerWithCardOrderUnfilled(participation: Participation) {
        return participation.role === 'player' && !participation.cardOrder;
      }

      const unfilledCardOrderPlayers = playersWithUnfilledCardOrder(participations);

      if (props.me.role === 'gm') {
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
          formComplete={props.me.cardOrder != undefined}
        >
          <CardOrderForm participation={props.me} />
        </PopupForm>
      );
    },
  );
}
