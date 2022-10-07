import { type ReactElement, type ReactNode } from "react";
import Button from 'react-bootstrap/Button';

import SetupForm from "@candela/components/game_setup/setup_form";
import TraitsForm from "@candela/components/game_setup/traits_form";
import type { Game } from "@candela/types/game";
import type { Participation } from "@candela/types/participation";
import { GameParticipationsContext, MeContext } from "@candela/util/contexts";
import { useHttpState, useSubscriptionContext } from "@candela/util/state";

export default function TraitsPrompt(props: { game: Game }): ReactElement {
  return useSubscriptionContext(GameParticipationsContext, "Loading players...", (participations) => {
    return useSubscriptionContext(MeContext, "Loading your information...", (me) => {
      const {
        loading,
        error,
        makeRequest: advanceStage,
      } = useHttpState(`api/games/${props.game.id}/advance_setup_state`, "PATCH", {
        current_setup_state: "traits",
      });

      function playersWithUnfilledTraits(participations: Participation[]) {
        return participations.filter(playerWithTraitsUnfilled);
      }

      function playerWithTraitsUnfilled(participation: Participation) {
        return (
          participation.role === "player" &&
          !(participation.hasWrittenVirtue && participation.hasWrittenVice)
        );
      }

      function actions(participations: Participation[]): ReactNode {
        const unfilledTraitPlayers = playersWithUnfilledTraits(participations);
        if (me.role === "gm") {
          if (unfilledTraitPlayers.length === 0) {
            return (
              <div>
                <p>{error?.message || ""}</p>
                <Button variant="primary"
                  disabled={loading}
                  onClick={() => advanceStage()}
                >
                  Proceed to Scenario
                </Button>
              </div>
            );
          }

          return null;
        } else {
          return (
            <TraitsForm
              participation={me}
            />
          );
        }
      }

      function status(participations: Participation[]) {
        const unfilledTraitPlayers = playersWithUnfilledTraits(participations);

        if (
          unfilledTraitPlayers.length === 0 && me.role !== "gm"
        ) {
          return <em>Waiting for GM to continue...</em>;
        } else {
          return (
            <ul>
              {unfilledTraitPlayers.map((player) => (
                <li key={player.id}>{player.name} is filling in traits...</li>
              ))}
            </ul>
          );
        }
      }

      return SetupForm(actions(participations), status(participations))
    });
  });
}
