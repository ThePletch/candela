import Button from 'react-bootstrap/Button';

import MomentForm from "@candela/components/game_setup/moment_form";
import SetupForm from "@candela/components/game_setup/setup_form";
import type { Participation } from "@candela/types/participation";
import type { GameProps } from "@candela/types/props";
import { GameParticipationsContext, MeContext } from '@candela/util/contexts';
import { useHttpState, useSubscriptionContext } from "@candela/util/state";

export default function MomentPrompt(props: GameProps) {
  const { loading, makeRequest: advanceStage } = useHttpState(
    `api/games/${props.game.id}/advance_setup_state`,
    "PATCH",
    { current_setup_state: "moments" }
  );

  return useSubscriptionContext(GameParticipationsContext, "Loading players...", (participations) => {
    return useSubscriptionContext(MeContext, "Loading your information...", (me) => {
      function playersWithUnfilledMoment(
        participations: Participation[]
      ): Participation[] {
        return participations.filter(playerWithMomentUnfilled);
      }

      function playerWithMomentUnfilled(participation: Participation) {
        return participation.role == "player" && !participation.hasMoment;
      }

      function actions(participations: Participation[]) {
        const unfilledMomentPlayers = playersWithUnfilledMoment(participations);

        if (
          unfilledMomentPlayers.length === 0 &&
          me.role === "gm"
        ) {
          return (
            <Button variant="primary"
              disabled={loading}
              onClick={() => advanceStage()}
            >
              Proceed to Brinks
            </Button>
          );
        }

        return <MomentForm participation={me} />;
      }

      function status(
        participations: Participation[]
      ) {
        const unfilledMomentPlayers = playersWithUnfilledMoment(participations);

        if (unfilledMomentPlayers.length === 0) {
          if (me.role === "player") {
            return <em>All moments submitted. Waiting for GM to continue...</em>;
          }
          return null;
        } else {
          return (
            <ul>
              {unfilledMomentPlayers.map((player) => (
                <li key={player.id}>{player.name} is writing their moment...</li>
              ))}
            </ul>
          );
        }
      }

      return SetupForm(actions(participations), status(participations));
    });
  });
}
