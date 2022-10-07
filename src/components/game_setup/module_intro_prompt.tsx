import Button from 'react-bootstrap/Button';

import SetupForm from "@candela/components/game_setup/setup_form";
import type { SelfParticipation } from "@candela/types/participation";
import type { GameProps } from '@candela/types/props';
import { MeContext } from '@candela/util/contexts';
import { useHttpState, useSubscriptionContext } from "@candela/util/state";

export default function ModuleIntroPrompt(props: GameProps) {
  const { loading, makeRequest: advanceStage } = useHttpState(
    `api/games/${props.game.id}/advance_setup_state`,
    "PATCH",
    { current_setup_state: "module_intro" }
  );

  return useSubscriptionContext(MeContext, "Loading your information...", (me) => {
    function actions(participation: SelfParticipation) {
      if (participation.role === "gm") {
        return (
          <div>
            <em>Introduce the scenario for the game to your players.</em>
            <Button variant="primary"
              className="d-block"
              disabled={loading}
              onClick={() => advanceStage()}
            >
              Done introducing scenario
            </Button>
          </div>
        );
      }

      return null;
    }

    function status(participation: SelfParticipation) {
      if (participation.role === "player") {
        return <em>GM is introducing the scenario...</em>;
      }
      return null;
    }

    return SetupForm(actions(me), status(me))
  });
}
