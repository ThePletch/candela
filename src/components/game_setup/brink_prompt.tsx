import Button from 'react-bootstrap/Button';

import BrinkForm from "@candela/components/game_setup/brink_form";
import SetupForm from "@candela/components/game_setup/setup_form";
import type { Participation } from "@candela/types/participation";
import type { GameProps } from "@candela/types/props";
import { GameParticipationsContext } from '@candela/util/contexts';
import { useHttpState, useSubscriptionContext } from "@candela/util/state";

export default function BrinkPrompt(props: GameProps) {
  const { loading, makeRequest: advanceStage } = useHttpState(
    `api/games/${props.game.id}/advance_setup_state`,
    "PATCH",
    { current_setup_state: "brinks" }
  );

  return useSubscriptionContext(GameParticipationsContext, "Loading players...", (participations) => {
    function playersWithUnfilledBrink(participations: Participation[]) {
      return participations.filter(playerWithBrinkUnfilled);
    }

    function playerWithBrinkUnfilled(participation: Participation) {
      return !participation.hasWrittenBrink;
    }

    function actions(
      participations: Participation[]
    ) {
      const unfilledBrinkPlayers = playersWithUnfilledBrink(participations);

      if (props.me.role === "gm") {
        if (unfilledBrinkPlayers.length === 0) {
          return (
            <>
              <Button variant="primary"
                disabled={loading}
                onClick={() => advanceStage()}
              >
                Proceed to Card Order
              </Button>
              <BrinkForm participation={props.me} />
            </>
          );
        }
      }
      return <BrinkForm participation={props.me} />;
    }

    function status(
      participations: Participation[]
    ) {
      const unfilledBrinkPlayers = playersWithUnfilledBrink(participations);

      if (unfilledBrinkPlayers.length === 0) {
        if (props.me.role == "player") {
          return <em>All brinks submitted. Waiting for GM to continue...</em>;
        }
        return null;
      } else {
        return (
          <ul>
            {unfilledBrinkPlayers.map((player) => (
              <li key={player.id}>{player.name} is writing their brink...</li>
            ))}
          </ul>
        );
      }
    }

    return SetupForm(actions(participations), status(participations));
  });
}
