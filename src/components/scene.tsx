import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';

import Conflict from '@candela/components/conflict';
import TruthsList from '@candela/components/truths_list';
import type { Conflict as ConflictType } from '@candela/types/conflict';
import type { SelfParticipation } from '@candela/types/participation';
import type { Scene as SceneType } from '@candela/types/scene';
import {
  ConflictResolutionsContext,
  SceneConflictsContext,
  SceneTruthsContext,
} from '@candela/util/contexts';
import {
  ModelListSubscription,
  useHttpState,
  useSubscriptionContext,
} from '@candela/util/state';

type SceneProps = {
  scene: SceneType;
  me: SelfParticipation;
};

type TruthsPromptProps = {
  me: SelfParticipation;
  nextTruthStater: {
    id: number;
    name: string;
  };
  sceneId: number;
};

// TODO hook form
function FormOrWaiting({ me, nextTruthStater, sceneId }: TruthsPromptProps) {
  const {
    loading,
    error,
    makeRequest: createTruth,
  } = useHttpState(`api/scenes/${sceneId}/truths`, 'POST', me.guid);

  const [truth, setTruth] = useState<string>('');

  if (me.id === nextTruthStater.id) {
    return (
      <Form onSubmit={() => createTruth({ description: truth })}>
        <Form.Control
          as="textarea"
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
      </Form>
    );
  }

  return (
    <em>
      Waiting for
      {nextTruthStater.name}
      {' '}
      to state a truth.
    </em>
  );
}

function TruthsPrompt(props: TruthsPromptProps & { truthsRemaining: number }) {
  const { truthsRemaining } = props;
  return (
    <div>
      <FormOrWaiting {...props} />
      <br />
      <em>
        {truthsRemaining}
        {' '}
        truths remain to be stated.
      </em>
    </div>
  );
}

function ConflictManager({
  scene,
  me,
  lastConflict,
}: SceneProps & { lastConflict: ConflictType | undefined }) {
  const { loading: createLoading, makeRequest: createConflict } = useHttpState(
    `api/scenes/${scene.id}/conflicts`,
    'POST',
    me.guid,
  );

  function createUndireConflict() {
    createConflict({ dire: false });
  }

  function createDireConflict() {
    createConflict({ dire: true });
  }

  return useSubscriptionContext(
    ConflictResolutionsContext(lastConflict?.id || 0),
    'Loading conflict info...',
    (resolutions) => {
      if (resolutions.every((r) => !r.confirmed)) {
        // Don't render conflict starting options if the latest conflict is unresolved.
        return null;
      }

      if (me.role === 'gm') {
        return (
          <ButtonGroup style={{ width: '100%' }}>
            <Button
              variant="primary"
              disabled={createLoading}
              onClick={() => createUndireConflict()}
            >
              Start a conflict
            </Button>
            <Button
              variant="danger"
              disabled={createLoading}
              onClick={() => createDireConflict()}
            >
              Start a dire conflict
            </Button>
          </ButtonGroup>
        );
      }

      return (
        <Toast>
          <Toast.Header closeButton={false}>
            The scene is underway.
          </Toast.Header>
          <Toast.Body>When a conflict occurs, you will be notified.</Toast.Body>
        </Toast>
      );
    },
  );
}

function Scene(props: { scene: SceneType; me: SelfParticipation }) {
  const { scene, me } = props;
  return useSubscriptionContext(
    SceneConflictsContext(scene.id),
    'Loading conflicts...',
    (conflicts) => {
      function OptionalConflictManager() {
        if (scene.state === 'truths_stated') {
          return (
            <ConflictManager
              {...props}
              lastConflict={conflicts[conflicts.length - 1]}
            />
          );
        }

        return null;
      }

      function OptionalTruthsPrompt() {
        if (scene.state !== 'transitioning') {
          return null;
        }

        return (
          <TruthsPrompt
            me={me}
            nextTruthStater={scene.nextTruthStater}
            sceneId={scene.id}
            truthsRemaining={scene.truthsRemaining}
          />
        );
      }

      function ActiveConflict() {
        const lastConflict = conflicts[conflicts.length - 1];
        if (lastConflict) {
          return <Conflict me={me} conflict={lastConflict} />;
        }
        return null;
      }

      return (
        <>
          <TruthsList
            sceneId={scene.id}
            truthsRemaining={scene.truthsRemaining}
          />
          <OptionalTruthsPrompt />
          <OptionalConflictManager />
          <ActiveConflict />
        </>
      );
    },
  );
}

export default function SceneWithSubscriptions(props: SceneProps) {
  const { scene, me } = props;
  const sceneIdParams = { scene_id: scene.id, guid: me.guid };
  return (
    <ModelListSubscription
      channel="ConflictsChannel"
      params={sceneIdParams}
      context={SceneConflictsContext(scene.id)}
    >
      <ModelListSubscription
        channel="TruthsChannel"
        params={sceneIdParams}
        context={SceneTruthsContext(scene.id)}
      >
        <Scene {...props} />
      </ModelListSubscription>
    </ModelListSubscription>
  );
}
