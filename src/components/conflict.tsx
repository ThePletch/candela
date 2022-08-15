import { Resolution } from "@candela/components/resolution/resolution";
import type { Conflict as ConflictType } from "@candela/types/conflict";
import type { SelfParticipation } from "@candela/types/participation";
import type { Resolution as ResolutionType } from "@candela/types/resolution";
import { getTopTrait } from "@candela/util/participations";
import {
  useHttpState,
  withModelListSubscription,
  withSingletonSubscription,
} from "@candela/util/state";

function PlayerConflictOptions(props: {
  activeParticipation: SelfParticipation;
  conflict: ConflictType;
}) {
  const { loading, makeRequest } = useHttpState(
    `/api/conflicts/${props.conflict.id}/resolutions`,
    "POST"
  );

  function rollForConflict() {
    makeRequest({ type: "RollResolution" });
  }

  function liveMoment() {
    makeRequest({ type: "MomentResolution" });
  }

  function LiveMomentButton() {
    if (getTopTrait(props.activeParticipation)?.type === "moment") {
      return (
        <button
          className="btn btn-primary"
          disabled={loading}
          onClick={liveMoment}
        >
          Live Moment
        </button>
      );
    }

    return null;
  }

  function DireConflictWarning() {
    if (props.conflict.dire) {
      return (
        <strong>
          This is a dire conflict, and whoever rolls for it will die if they
          fail.
        </strong>
      );
    }

    return null;
  }

  if (props.activeParticipation.alive) {
    return (
      <div>
        <h3>The GM has finished describing the conflict.</h3>
        <p>
          If your character will face this conflict, click the button below.
        </p>
        <DireConflictWarning />
        <button
          className="btn btn-primary"
          disabled={loading}
          onClick={rollForConflict}
        >
          Roll
        </button>
        <LiveMomentButton />
      </div>
    );
  }

  return <h4>You have passed on and cannot face this conflict.</h4>;
}

type ConflictProps = {
  participationId: number;
  conflict: ConflictType;
};

export default function Conflict(props: ConflictProps) {
  const { loading, makeRequest: finishNarration } = useHttpState(
    `/api/conflicts/${props.conflict.id}/finish_narration`,
    "PATCH"
  );

  return withSingletonSubscription(
    "ParticipationChannel",
    { id: props.participationId },
    (activeParticipation: SelfParticipation) => {
      return withModelListSubscription(
        "ResolutionsChannel",
        { conflict_id: props.conflict.id },
        (resolutions: ResolutionType[]) => {
          if (!props.conflict.narrated) {
            if (activeParticipation.role == "gm") {
              return (
                <div>
                  <p>Narrate the conflict. What's happening?</p>
                  <button
                    className="btn btn-primary"
                    disabled={loading}
                    onClick={() => finishNarration()}
                  >
                    Finish Narration
                  </button>
                </div>
              );
            }
            return (
              <div>
                <h3>
                  A conflict has begun. The GM is explaining the situation.
                </h3>
                <em>Stand by to react.</em>
              </div>
            );
          }

          const activeResolutions = resolutions.filter((r) => !r.confirmed);
          if (activeResolutions.length > 0) {
            return (
              <Resolution
                gameId={props.conflict.gameId}
                resolution={activeResolutions[0]}
                activeParticipation={activeParticipation}
              />
            );
          }

          if (activeParticipation.role === "gm") {
            return (
              <h3>The players are deciding who will face the challenge.</h3>
            );
          }

          return (
            <PlayerConflictOptions
              activeParticipation={activeParticipation}
              conflict={props.conflict}
            />
          );
        }
      );
    }
  );
}
