import { type ReactElement, type ReactNode } from "react";
import Button from 'react-bootstrap/Button';

import SetupForm from "@candela/components/game_setup/setup_form";
import type { Participation } from "@candela/types/participation";
import type { GameProps } from "@candela/types/props";
import { GameParticipationsContext } from '@candela/util/contexts';
import { useHttpState, useSubscriptionContext } from "@candela/util/state";

export default function StartGamePrompt(props: GameProps): ReactElement {
  const {
    loading,
    error,
    makeRequest: advanceStage,
  } = useHttpState(
    `api/games/${props.game.id}/advance_setup_state`,
    "PATCH",
    { current_setup_state: "nascent" }
  );

  return useSubscriptionContext(GameParticipationsContext, "Loading players...", (participations) => {
    function StartGameButton(startGameButtonProps: {
      participationCount: number;
    }) {
      if (startGameButtonProps.participationCount >= 3) {
        return (
          <div>
            <p>{error?.message || ''}</p>
            <Button variant="primary"
              onClick={() => advanceStage()}
              disabled={loading}
            >
              Start the Game
            </Button>
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

    const participationCount = participations.length;
    const activeParticipationRole = props.me.role;
    return SetupForm(
      actions({ activeParticipationRole, participationCount }),
      status({ activeParticipationRole, participationCount })
    );
  });
}
