import MomentForm from "@candela/components/game_setup/moment_form";
import SetupForm from "@candela/components/game_setup/setup_form";
import type { Participation, SelfParticipation } from "types/participation";
import type { GameProps } from "types/props";
import { activeParticipation } from "util/participations";
import { useHttpState, withModelListSubscription } from "util/state";

export default function MomentPrompt(props: GameProps) {
  const { loading, makeRequest: advanceStage } = useHttpState(
    `/api/games/${props.gameId}/advance_setup_state`,
    "PATCH",
    { current_setup_state: "moments" }
  );

  function playersWithUnfilledMoment(
    participations: Participation[]
  ): Participation[] {
    return participations.filter(playerWithMomentUnfilled);
  }

  function playerWithMomentUnfilled(participation: Participation) {
    return participation.role == "player" && !participation.hasMoment;
  }

  function actions(
    participations: Participation[],
    activeParticipation: SelfParticipation
  ) {
    const unfilledMomentPlayers = playersWithUnfilledMoment(participations);

    if (
      unfilledMomentPlayers.length === 0 &&
      activeParticipation.role === "gm"
    ) {
      return (
        <button
          className="btn btn-primary"
          disabled={loading}
          onClick={() => advanceStage()}
        >
          Proceed to Brinks
        </button>
      );
    }

    return <MomentForm participation={activeParticipation} />;
  }

  function status(
    participations: Participation[],
    activeParticipation: SelfParticipation
  ) {
    const unfilledMomentPlayers = playersWithUnfilledMoment(participations);

    if (unfilledMomentPlayers.length === 0) {
      if (activeParticipation.role === "player") {
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

  return withModelListSubscription(
    "ParticipationsChannel",
    { game_id: props.gameId },
    (participations: Participation[]) => {
      const me = activeParticipation(participations, props.participationId);
      return SetupForm(actions(participations, me), status(participations, me));
    }
  );
}
