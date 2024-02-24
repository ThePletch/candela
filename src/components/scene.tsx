import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import { useForm } from 'react-hook-form';

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

function FormOrWaiting({ me, nextTruthStater, sceneId }: TruthsPromptProps) {
  const {
    loading,
    makeRequest
  } = useHttpState(`api/scenes/${sceneId}/truths`, 'POST', me.guid);

  const { register, handleSubmit } = useForm();

  if (me.id === nextTruthStater.id) {
    return (
      <Form onSubmit={handleSubmit(makeRequest)}>
        <Form.Control
          as="textarea"
          {...register('truth.description', { required: true })}
        />

        <Button variant="primary" disabled={loading} type="submit">
          State Truth
        </Button>
      </Form>
    );
  }

  return (
    <em>
      Waiting for
      {' '}
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

function ConflictStartManager({
  scene,
  me,
}: SceneProps) {
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

  const conflictButtons = <ButtonGroup style={{ width: '100%' }}>
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
  </ButtonGroup>;

  const sceneUnderwayToast = <Toast>
    <Toast.Header closeButton={false}>
      The scene is underway.
    </Toast.Header>
    <Toast.Body>When a conflict occurs, you will be notified.</Toast.Body>
  </Toast>;

  return me.role === 'gm' ? conflictButtons : sceneUnderwayToast;
}


function OptionalConflictManager({
  scene,
  me,
  conflicts,
}: SceneProps & { conflicts: ConflictType[] }) {
  if (scene.state === 'truths_stated') {
    if (conflicts.every((c) => c.resolved)) {
      return (
        <ConflictStartManager
          scene={scene}
          me={me}
        />
      );
    }

    const lastConflict = conflicts[conflicts.length - 1];

    return <ModelListSubscription
      channel="ResolutionsChannel"
      params={{ conflict_id: lastConflict.id, guid: me.guid }}
      context={ConflictResolutionsContext(lastConflict.id)}
    >
      <Conflict me={me} conflict={lastConflict} />
    </ModelListSubscription>
  }

  return null;
}

function OptionalTruthsPrompt({
  scene,
  me,
}: SceneProps) {
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

function Scene(props: { scene: SceneType; me: SelfParticipation }) {
  const { scene, me } = props;

  return useSubscriptionContext(
    SceneConflictsContext(scene.id),
    'Loading conflicts...',
    (conflicts) => {

      return (
        <>
          <TruthsList
            sceneId={scene.id}
            truthsRemaining={scene.truthsRemaining}
          />
          <OptionalTruthsPrompt scene={scene} me={me} />
          <OptionalConflictManager scene={scene} me={me} conflicts={conflicts} />
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
