import { useState } from "react";

import Conflict from "@candela/components/conflict";
import TruthsList from "@candela/components/truths_list";
import type { SelfParticipation } from "@candela/types/participation";
import type { Scene as SceneType } from "@candela/types/scene";
import { SceneConflictsContext, SceneTruthsContext } from '@candela/util/contexts';
import {
  ModelListSubscription,
  useHttpState,
  useSubscriptionContext,
} from "@candela/util/state";

type SceneProps = {
  scene: SceneType;
  me: SelfParticipation;
};

type TruthsPromptProps = {
  meId: number;
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
  } = useHttpState(`api/scenes/${props.sceneId}/truths`, "POST");

  const [truth, setTruth] = useState<string>("");

  // TODO hook form
  function FormOrWaiting() {
    if (props.meId === props.nextTruthStater.id) {
      return (
        <form onSubmit={() => createTruth({ description: truth })}>
          <textarea
            className="form-control"
            name="description"
            onChange={(e) => setTruth(e.target.value)}
          />
          {error && <span>{error.message}</span>}
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

function ConflictManager(props: SceneProps) {
  const { loading: createLoading, makeRequest: createConflict } = useHttpState(
    `api/scenes/${props.scene.id}/conflicts`,
    "POST"
  );

  function createUndireConflict() {
    createConflict({ dire: false });
  }

  function createDireConflict() {
    createConflict({ dire: true });
  }

  if (props.me.role === "gm") {
    return (
      <div>
        <h3>Click one of the below buttons to begin a conflict.</h3>
        <button
          className="btn btn-primary"
          disabled={createLoading}
          onClick={createUndireConflict}
        >
          CONFLICT
        </button>
        <button
          className="btn btn-danger"
          disabled={createLoading}
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

function Scene(props: { scene: SceneType, me: SelfParticipation }) {
  return useSubscriptionContext(SceneConflictsContext(props.scene.id), "Loading conflicts...", (conflicts) => {
    function OptionalConflictManager() {
      if (
        props.scene.state === "truths_stated" &&
        conflicts.every((c) => c.resolved || !c.narrated)
      ) {
        return (
          <ConflictManager
            {...props}
          />
        );
      }

      return null;
    }

    function OptionalTruthsPrompt() {
      if (props.scene.state !== "transitioning") {
        return null;
      }

      return (
        <TruthsPrompt
          meId={props.me.id}
          nextTruthStater={props.scene.nextTruthStater}
          sceneId={props.scene.id}
          truthsRemaining={props.scene.truthsRemaining}
        />
      );
    }

    function LastActiveConflict() {
      const lastActiveConflict = conflicts.filter((c) => !c.resolved)[-1];
      if (lastActiveConflict) {
        return (
          <Conflict
            conflict={lastActiveConflict}
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
  });
}

export default function(props: SceneProps) {
  return <ModelListSubscription channel="ConflictsChannel" params={{ scene_id: props.scene.id }} context={SceneConflictsContext(props.scene.id)}>
    <ModelListSubscription channel="TruthsChannel" params={{ scene_id: props.scene.id }} context={SceneTruthsContext(props.scene.id)}>
      <Scene {...props} />
    </ModelListSubscription>
  </ModelListSubscription>
}
