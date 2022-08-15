import SetupForm from "@candela/components/game_setup/setup_form";
import type { SelfParticipation } from "@candela/types/participation";
import type { GameProps } from "@candela/types/props";
import { useHttpState, withSingletonSubscription } from "@candela/util/state";

export default function ModuleIntroPrompt(props: GameProps) {
  const { loading, makeRequest: advanceStage } = useHttpState(
    `/api/games/${props.gameId}/advance_setup_state`,
    "PATCH",
    { current_setup_state: "module_intro" }
  );

  function actions(participation: SelfParticipation) {
    if (participation.role === "gm") {
      return (
        <div>
          <em>Introduce the scenario for the game to your players.</em>
          <button
            className="btn btn-primary d-block"
            disabled={loading}
            onClick={() => advanceStage()}
          >
            Done introducing scenario
          </button>
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

  return withSingletonSubscription(
    "ParticipationChannel",
    { id: props.participationId },
    (participation: SelfParticipation) =>
      SetupForm(actions(participation), status(participation))
  );
}
