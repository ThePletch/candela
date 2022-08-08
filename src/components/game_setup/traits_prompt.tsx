import { type ReactElement, type ReactNode } from "react";

import SetupForm from "./setup_form";
import TraitsForm from "./traits_form";
import { activeParticipation } from "util/participations";
import type { Participation } from "types/participation";
import type { GameProps } from "types/props";
import { useHttpState, withModelListSubscription } from "util/state";

export default function TraitsPrompt(props: GameProps): ReactElement {
  const {
    loading,
    error,
    makeRequest: advanceStage,
  } = useHttpState(`/api/games/${props.gameId}/advance_setup_state`, "PATCH", {
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

    if (
      unfilledTraitPlayers.length == 0 &&
      activeParticipation(participations, props.participationId)?.role == "gm"
    ) {
      return (
        <div>
          <p>{error}</p>
          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={() => advanceStage()}
          >
            Proceed to Scenario
          </button>
        </div>
      );
    } else if (
      playerWithTraitsUnfilled(
        activeParticipation(participations, props.participationId)
      )
    ) {
      return (
        <TraitsForm
          gameId={props.gameId}
          participationId={props.participationId}
        />
      );
    } else {
      return null;
    }
  }

  function status(participations: Participation[]) {
    const unfilledTraitPlayers = playersWithUnfilledTraits(participations);

    if (
      unfilledTraitPlayers.length == 0 &&
      activeParticipation(participations, props.participationId)?.role !== "gm"
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
  return withModelListSubscription(
    "ParticipationsChannel",
    { game_id: props.gameId },
    (participations: Participation[]) =>
      SetupForm(actions(participations), status(participations))
  );
}
