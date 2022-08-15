import CardOrderForm from "@candela/components/game_setup/card_order_form";

import SetupForm from "@candela/components/game_setup/setup_form";

import type { Participation, SelfParticipation } from "types/participation";
import type { GameProps } from "types/props";
import { activeParticipation } from "util/participations";
import { useHttpState, withModelListSubscription } from "util/state";

export default function CardOrderPrompt(props: GameProps) {
  const { loading, makeRequest: advanceStage } = useHttpState(
    `/api/games/${props.gameId}/advance_setup_state`,
    "PATCH",
    { current_setup_state: "order_cards" }
  );

  function playersWithUnfilledCardOrder(participations: Participation[]) {
    return participations.filter(playerWithCardOrderUnfilled);
  }

  function playerWithCardOrderUnfilled(participation: Participation) {
    return participation.role === "player" && !participation.hasCardOrder;
  }

  function actions(
    participations: Participation[],
    activeParticipation: SelfParticipation
  ) {
    const unfilledCardOrderPlayers =
      playersWithUnfilledCardOrder(participations);

    if (activeParticipation.role === "gm") {
      if (unfilledCardOrderPlayers.length === 0) {
        return (
          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={() => advanceStage()}
          >
            Begin the Game
          </button>
        );
      }
      return null;
    }

    return <CardOrderForm participation={activeParticipation} />;
  }

  function status(
    participations: Participation[],
    activeParticipation: SelfParticipation
  ) {
    const unfilledCardOrderPlayers =
      playersWithUnfilledCardOrder(participations);

    if (unfilledCardOrderPlayers.length === 0) {
      if (activeParticipation.role === "player") {
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

  return withModelListSubscription(
    "ParticipationsChannel",
    { game_id: props.gameId },
    (participations: Participation[]) => {
      const me = activeParticipation(participations, props.participationId);
      return SetupForm(actions(participations, me), status(participations, me));
    }
  );
}
