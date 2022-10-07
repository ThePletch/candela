import Button from 'react-bootstrap/Button';

import CardOrderForm from "@candela/components/game_setup/card_order_form";
import SetupForm from "@candela/components/game_setup/setup_form";
import type { Participation } from "@candela/types/participation";
import type { GameProps } from "@candela/types/props";
import { GameParticipationsContext } from '@candela/util/contexts';
import { useHttpState, useSubscriptionContext } from "@candela/util/state";

export default function CardOrderPrompt(props: GameProps) {
  const { loading, makeRequest: advanceStage } = useHttpState(
    `api/games/${props.game.id}/advance_setup_state`,
    "PATCH",
    { current_setup_state: "order_cards" }
  );

  return useSubscriptionContext(GameParticipationsContext, "Loading players...", (participations) => {
    function playersWithUnfilledCardOrder(participations: Participation[]) {
      return participations.filter(playerWithCardOrderUnfilled);
    }

    function playerWithCardOrderUnfilled(participation: Participation) {
      return participation.role === "player" && !participation.hasCardOrder;
    }

    function actions(
      participations: Participation[]
    ) {
      const unfilledCardOrderPlayers =
        playersWithUnfilledCardOrder(participations);

      if (props.me.role === "gm") {
        if (unfilledCardOrderPlayers.length === 0) {
          return (
            <Button variant="primary"
              disabled={loading}
              onClick={() => advanceStage()}
            >
              Begin the Game
            </Button>
          );
        }
        return null;
      }

      return <CardOrderForm participation={props.me} />;
    }

    function status(
      participations: Participation[]
    ) {
      const unfilledCardOrderPlayers =
        playersWithUnfilledCardOrder(participations);

      if (unfilledCardOrderPlayers.length === 0) {
        if (props.me.role === "player") {
          return (
            <em>
              All players have ordered their cards. Waiting for GM to continue...
            </em>
          );
        }
        return null;
      }
      return (
        <ul>
          {unfilledCardOrderPlayers.map((player) => (
            <li key={player.id}>{player.name} is ordering their cards...</li>
          ))}
        </ul>
      );
    }

    return SetupForm(actions(participations), status(participations));
  });
}
