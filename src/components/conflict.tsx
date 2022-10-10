import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Toast from 'react-bootstrap/Toast';

import PopupForm from '@candela/components/popup_form';
import { Resolution } from '@candela/components/resolution/resolution';
import { getTopTrait } from '@candela/state-helpers/participations';
import type { Conflict as ConflictType } from '@candela/types/conflict';
import type { SelfParticipation } from '@candela/types/participation';
import { ConflictResolutionsContext, MeContext } from '@candela/util/contexts';

import {
  useHttpState,
  ModelListSubscription,
  useSubscriptionContext,
  useSubscriptionContexts,
} from '@candela/util/state';

function PlayerConflictOptions(props: {
  conflict: ConflictType;
  me: SelfParticipation;
}) {
  const { loading, makeRequest } = useHttpState(
    `api/conflicts/${props.conflict.id}/resolutions`,
    'POST',
    props.me.guid,
  );

  return useSubscriptionContext(
    MeContext(props.me.guid),
    'Loading your information...',
    (me) => {
      function rollForConflict() {
        makeRequest({ type: 'RollResolution' });
      }

      function liveMoment() {
        makeRequest({ type: 'MomentResolution' });
      }

      function LiveMomentButton() {
        if (getTopTrait(me) === 'moment') {
          return (
            <Button variant="info" disabled={loading} onClick={liveMoment}>
              Live Moment
            </Button>
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

      if (me.alive) {
        return (
          <>
            <h3>The GM has finished describing the conflict.</h3>
            <p>
              If your character will face this conflict, click the button below.
            </p>
            <DireConflictWarning />
            <div style={{ display: 'grid' }}>
              <ButtonGroup>
                <Button
                  variant="primary"
                  disabled={loading}
                  onClick={rollForConflict}
                >
                  Roll
                </Button>
                <LiveMomentButton />
              </ButtonGroup>
            </div>
          </>
        );
      }

      return <h4>You have passed on and cannot face this conflict.</h4>;
    },
  );
}

type ConflictProps = {
  conflict: ConflictType;
  me: SelfParticipation;
};

function Conflict(props: ConflictProps) {
  const { loading, makeRequest: finishNarration } = useHttpState(
    `api/conflicts/${props.conflict.id}/finish_narration`,
    'PATCH',
    props.me.guid,
  );

  return useSubscriptionContexts(
    {
      me: {
        context: MeContext(props.me.guid),
        loadingMessage: 'Loading your information...',
      },
      resolutions: {
        context: ConflictResolutionsContext(props.conflict.id),
        loadingMessage: 'Loading resolutions...',
      },
    },
    ({ me, resolutions }) => {
      if (resolutions.some((r) => r.confirmed)) {
        return null;
      }

      if (!props.conflict.narrated) {
        if (me.role == 'gm') {
          return (
            <PopupForm label="Narrate the conflict" formComplete={false}>
              <p>Narrate the conflict. What's happening?</p>
              <button
                className="btn btn-primary"
                disabled={loading}
                onClick={() => finishNarration()}
              >
                Finish Narration
              </button>
            </PopupForm>
          );
        }
        return (
          <Toast>
            <Toast.Header closeButton={false}>
              A conflict has begun.
            </Toast.Header>
            <Toast.Body>
              The GM is explaining the situation. Stand by to react.
            </Toast.Body>
          </Toast>
        );
      }

      const activeResolutions = resolutions.filter((r) => !r.confirmed);
      if (activeResolutions.length > 0) {
        return (
          <PopupForm label="View conflict results" formComplete={false}>
            <Resolution
              gameId={props.conflict.gameId}
              resolution={activeResolutions[0]}
              me={me}
            />
          </PopupForm>
        );
      }

      if (me.role === 'gm') {
        return (
          <Toast>
            <Toast.Body>
              The players are deciding who will face the challenge.
            </Toast.Body>
          </Toast>
        );
      }

      return (
        <PopupForm label="Handle the conflict" formComplete={false}>
          <PlayerConflictOptions conflict={props.conflict} me={props.me} />
        </PopupForm>
      );
    },
  );
}

export default function (props: ConflictProps) {
  return (
    <ModelListSubscription
      channel="ResolutionsChannel"
      params={{ conflict_id: props.conflict.id, guid: props.me.guid }}
      context={ConflictResolutionsContext(props.conflict.id)}
    >
      <Conflict {...props} />
    </ModelListSubscription>
  );
}
