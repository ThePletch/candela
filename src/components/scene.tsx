import { useState } from "react";

import Conflict from "@candela/components/conflict";
import TruthsList from "@candela/components/truths_list";
import type { Conflict as ConflictType } from "@candela/types/conflict";
import type { SelfParticipation } from "@candela/types/participation";
import type { Scene as SceneType } from "@candela/types/scene";
import {
  useHttpState,
  withModelListSubscription,
  withSingletonSubscription,
} from "@candela/util/state";

type TruthsPromptProps = {
  participationId: number;
  truthsRemaining: number;
  nextTruthStater: {
    id: number;
    name: string;
  };
  sceneId: number;
};

function TruthsPrompt(props: TruthsPromptProps) {
  const {
    loading,
    error,
    makeRequest: createTruth,
  } = useHttpState(`/api/scenes/${props.sceneId}/truths`, "POST");

  const [truth, setTruth] = useState<string>("");

  function FormOrWaiting() {
    if (props.participationId === props.nextTruthStater.id) {
      return (
        <form onSubmit={() => createTruth({ description: truth })}>
          <textarea
            className="form-control"
            name="description"
            onChange={(e) => setTruth(e.target.value)}
          />
          {error && <span>{error}</span>}
          <input
            className="btn btn-primary"
            type="submit"
            value="State Truth"
            disabled={loading}
          />
        </form>
      );
    }

    return <em>Waiting for {props.nextTruthStater.name} to state a truth.</em>;
  }

  return (
    <div>
      <FormOrWaiting />
      <br />
      <em>{props.truthsRemaining} truths remain to be stated.</em>
    </div>
  );
}

function ConflictManager(props: { scene: SceneType; participationId: number }) {
  const { loading, makeRequest: createConflict } = useHttpState(
    `/api/scenes/${props.scene.id}/conflicts`,
    "POST"
  );

  function createUndireConflict() {
    createConflict({ dire: false });
  }

  function createDireConflict() {
    createConflict({ dire: true });
  }

  return withSingletonSubscription(
    "ParticipationChannel",
    { id: props.participationId },
    (participation: SelfParticipation) => {
      if (participation.role === "gm") {
        return (
          <div>
            <h3>Click one of the below buttons to begin a conflict.</h3>
            <button
              className="btn btn-primary"
              disabled={loading}
              onClick={createUndireConflict}
            >
              CONFLICT
            </button>
            <button
              className="btn btn-danger"
              disabled={loading}
              onClick={createDireConflict}
            >
              DIRE CONFLICT
            </button>
          </div>
        );
      }

      return (
        <div>
          <h3>The scene is underway.</h3>
          <em>When a conflict occurs, you will see it here.</em>
        </div>
      );
    }
  );
}

type SceneProps = {
  scene: SceneType;
  participationId: number;
};

export default function Scene(props: SceneProps) {
  return withModelListSubscription(
    "ConflictsChannel",
    { scene_id: props.scene.id },
    (conflicts: ConflictType[]) => {
      function OptionalConflictManager() {
        if (
          props.scene.state === "truths_stated" &&
          conflicts.every((c) => c.resolved || !c.narrated)
        ) {
          return (
            <ConflictManager
              scene={props.scene}
              participationId={props.participationId}
            />
          );
        }

        return null;
      }

      function OptionalTruthsPrompt() {
        const scene = props.scene;
        if (scene.state !== "transitioning") {
          return null;
        }

        return (
          <TruthsPrompt
            participationId={props.participationId}
            nextTruthStater={scene.nextTruthStater}
            sceneId={scene.id}
            truthsRemaining={scene.truthsRemaining}
          />
        );
      }

      function LastActiveConflict() {
        const lastActiveConflict = conflicts.filter((c) => !c.resolved)[-1];
        if (lastActiveConflict) {
          return (
            <Conflict
              conflict={lastActiveConflict}
              participationId={props.participationId}
            />
          );
        }
        return null;
      }

      return (
        <div>
          <TruthsList
            sceneId={props.scene.id}
            truthsRemaining={props.scene.truthsRemaining}
          />
          <OptionalTruthsPrompt />
          <OptionalConflictManager />
          <LastActiveConflict />
        </div>
      );
    }
  );
}
