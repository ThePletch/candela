import BrinkForm from "./brink_form";

import SetupForm from "./setup_form";
import type { Participation, SelfParticipation } from "types/participation";
import type { GameProps } from "types/props";
import { activeParticipation } from "util/participations";
import { useHttpState, withModelListSubscription } from "util/state";

export default function BrinkPrompt(props: GameProps) {
  const { loading, makeRequest: advanceStage } = useHttpState(
    `/api/games/${props.gameId}/advance_setup_state`,
    "PATCH",
    { current_setup_state: "brinks" }
  );

  function playersWithUnfilledBrink(participations: Participation[]) {
    return participations.filter(playerWithBrinkUnfilled);
  }

  function playerWithBrinkUnfilled(participation: Participation) {
    return !participation.hasBrink;
  }

  function actions(
    participations: Participation[],
    activeParticipation: SelfParticipation
  ) {
    const unfilledBrinkPlayers = playersWithUnfilledBrink(participations);

    if (activeParticipation.role === "gm") {
      if (unfilledBrinkPlayers.length === 0) {
        return (
          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={() => advanceStage()}
          >
            Proceed to Card Order
          </button>
        );
      }
      return null;
    }
    return <BrinkForm participation={activeParticipation} />;
  }

  function status(
    participations: Participation[],
    activeParticipation: SelfParticipation
  ) {
    const unfilledBrinkPlayers = playersWithUnfilledBrink(participations);

    if (unfilledBrinkPlayers.length == 0) {
      if (activeParticipation.role == "player") {
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

  return withModelListSubscription(
    "ParticipationsChannel",
    { game_id: props.gameId },
    (participations: Participation[]) => {
      const me = activeParticipation(participations, props.participationId);
      return SetupForm(actions(participations, me), status(participations, me));
    }
  );
}
