import { type ReactElement, type ReactNode } from "react";

import SetupForm from "@candela/components/game_setup/setup_form";
import type { Participation } from "@candela/types/participation";
import { useHttpState, withModelListSubscription } from "@candela/util/state";
import type { GameProps } from "@candela/types/props";

export default function StartGamePrompt(props: GameProps): ReactElement {
  function StartGameButton(startGameButtonProps: {
    participationCount: number;
  }) {
    const {
      loading,
      error,
      makeRequest: advanceStage,
    } = useHttpState(
      `/api/games/${props.gameId}/advance_setup_state`,
      "PATCH",
      { current_setup_state: "nascent" }
    );

    if (startGameButtonProps.participationCount > 3) {
      return (
        <div>
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => advanceStage()}
            disabled={loading}
          >
            Start the Game
          </button>
        </div>
      );
    }

    return null;
  }

  function actions(actionsProps: {
    activeParticipationRole: Participation["role"];
    participationCount: number;
  }): ReactNode {
    if (actionsProps.activeParticipationRole === "gm") {
      return (
        <StartGameButton participationCount={actionsProps.participationCount} />
      );
    }

    return null;
  }

  function status(statusProps: {
    activeParticipationRole: Participation["role"];
    participationCount: number;
  }): ReactNode {
    if (statusProps.participationCount >= 3) {
      if (statusProps.activeParticipationRole === "player") {
        return <em>Waiting for GM to start game...</em>;
      }

      return null;
    } else {
      const additionalNeededPlayers = 3 - statusProps.participationCount;
      const persons = additionalNeededPlayers == 1 ? "person" : "people";
      return (
        <em>
          Waiting for {additionalNeededPlayers} more {persons}...
        </em>
      );
    }
  }

  return withModelListSubscription(
    "ParticipationsChannel",
    { game_id: props.gameId },
    (participations: Participation[]) => {
      const participationCount = participations.length;
      const activeParticipationRole = participations.find(
        (p) => p.id === props.participationId
      )?.role;
      if (!activeParticipationRole) {
        return <p>No participation!</p>;
      }
      return SetupForm(
        actions({ activeParticipationRole, participationCount }),
        status({ activeParticipationRole, participationCount })
      );
    }
  );
}
