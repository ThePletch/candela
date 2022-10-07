import Button from 'react-bootstrap/Button';

import CharacterConceptForm from "@candela/components/game_setup/character_concept_form";
import SetupForm from "@candela/components/game_setup/setup_form";
import type { Participation } from "@candela/types/participation";
import type { GameProps } from "@candela/types/props";
import { GameParticipationsContext, MeContext } from '@candela/util/contexts';
import { useHttpState, useSubscriptionContext } from "@candela/util/state";

export default function CharacterConceptPrompt(props: GameProps) {
  const { loading, makeRequest: advanceStage } = useHttpState(
    `api/games/${props.game.id}/advance_setup_state`,
    "PATCH",
    { current_setup_state: "character_concept" }
  );

  return useSubscriptionContext(GameParticipationsContext, "Loading players...", (participations) => {
    return useSubscriptionContext(MeContext, "Loading your information...", (me) => {
      function playersWithUnfilledConcept(participations: Participation[]) {
        return participations.filter(playerWithConceptUnfilled);
      }

      function playerWithConceptUnfilled(participation: Participation) {
        return (
          participation.role === "player" && participation.characterConcept == null
        );
      }

      function actions(participations: Participation[]) {
        const unfilledConceptPlayers = playersWithUnfilledConcept(participations);

        if (me.role === "gm") {
          if (unfilledConceptPlayers.length === 0) {
            return (
              <Button variant="primary"
                disabled={loading}
                onClick={() => advanceStage()}
              >
                Proceed to Moments
              </Button>
            );
          }
          return null;
        }

        return <CharacterConceptForm participation={me} />;
      }

      function status(
        participations: Participation[]
      ) {
        const unfilledConceptPlayers = playersWithUnfilledConcept(participations);

        if (unfilledConceptPlayers.length === 0) {
          if (me.role === "player") {
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

      return SetupForm(actions(participations), status(participations));
    });
  });
}
