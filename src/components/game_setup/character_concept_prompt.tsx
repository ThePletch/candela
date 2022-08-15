import CharacterConceptForm from "@candela/components/game_setup/character_concept_form";
import SetupForm from "@candela/components/game_setup/setup_form";
import type { Participation, SelfParticipation } from "types/participation";
import type { GameProps } from "types/props";
import { activeParticipation } from "util/participations";
import { useHttpState, withModelListSubscription } from "util/state";

export default function CharacterConceptPrompt(props: GameProps) {
  const { loading, makeRequest: advanceStage } = useHttpState(
    `/api/games/${props.gameId}/advance_setup_state`,
    "PATCH",
    { current_setup_state: "character_concept" }
  );

  function playersWithUnfilledConcept(participations: Participation[]) {
    return participations.filter(playerWithConceptUnfilled);
  }

  function playerWithConceptUnfilled(participation: Participation) {
    return (
      participation.role === "player" && participation.characterConcept == null
    );
  }

  function actions(
    participations: Participation[],
    activeParticipation: SelfParticipation
  ) {
    const unfilledConceptPlayers = playersWithUnfilledConcept(participations);

    if (activeParticipation.role === "gm") {
      if (unfilledConceptPlayers.length === 0) {
        return (
          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={() => advanceStage()}
          >
            Proceed to Moments
          </button>
        );
      }
      return null;
    }

    return <CharacterConceptForm participation={activeParticipation} />;
  }

  function status(
    participations: Participation[],
    activeParticipation: SelfParticipation
  ) {
    const unfilledConceptPlayers = playersWithUnfilledConcept(participations);

    if (unfilledConceptPlayers.length === 0) {
      if (activeParticipation.role === "player") {
        return (
          <em>
            All character concepts submitted. Waiting for GM to continue...
          </em>
        );
      }
      return null;
    }

    return (
      <ul>
        {unfilledConceptPlayers.map((player) => (
          <li key={player.id}>
            {player.name} is writing their character concept...
          </li>
        ))}
      </ul>
    );
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
