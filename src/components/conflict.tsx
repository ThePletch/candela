import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Toast from 'react-bootstrap/Toast';

import PopupForm from '@candela/components/popup_form';
import { Resolution } from '@candela/components/resolution/resolution';
import { getTopTrait } from '@candela/state-helpers/participations';
import type { Conflict as ConflictType } from '@candela/types/conflict';
import type { SelfParticipation } from '@candela/types/participation';
import { ConflictResolutionsContext } from '@candela/util/contexts';

import {
  type HttpState,
  ModelListSubscription,
  useHttpState,
  useSubscriptionContext,
} from '@candela/util/state';

type ConflictProps = {
  conflict: ConflictType;
  me: SelfParticipation;
};

function DireConflictWarning({ conflict }: { conflict: ConflictType }) {
  if (conflict.dire) {
    return (
      <strong>
        This is a dire conflict, and whoever rolls for it will die if they fail.
      </strong>
    );
  }

  return null;
}

function LiveMomentButton({
  me,
  resolutionHttpState,
}: {
  me: SelfParticipation;
  resolutionHttpState: HttpState<void>;
}) {
  const { loading, makeRequest } = resolutionHttpState;

  const liveMoment = () => {
    makeRequest({ type: 'MomentResolution' });
  };

  if (getTopTrait(me) === 'moment') {
    return (
      <Button variant="info" disabled={loading} onClick={liveMoment}>
        Live Moment
      </Button>
    );
  }

  return null;
}

function PlayerConflictOptions({ conflict, me }: ConflictProps) {
  const resolutionHttpState = useHttpState(
    `api/conflicts/${conflict.id}/resolutions`,
    'POST',
    me.guid,
  );

  const rollForConflict = () => {
    resolutionHttpState.makeRequest({ type: 'RollResolution' });
  };

  if (me.alive) {
    return (
      <>
        <h3>The GM has finished describing the conflict.</h3>
        <p>
          If your character will face this conflict, click the button below.
        </p>
        <DireConflictWarning conflict={conflict} />
        <div style={{ display: 'grid' }}>
          <ButtonGroup>
            <Button
              variant="primary"
              disabled={resolutionHttpState.loading}
              onClick={rollForConflict}
            >
              Roll
            </Button>
            <LiveMomentButton
              me={me}
              resolutionHttpState={resolutionHttpState}
            />
          </ButtonGroup>
        </div>
      </>
    );
  }

  return <h4>You have passed on and cannot face this conflict.</h4>;
}

function Conflict({ conflict, me }: ConflictProps) {
  const { loading, makeRequest: finishNarration } = useHttpState(
    `api/conflicts/${conflict.id}/finish_narration`,
    'PATCH',
    me.guid,
  );

  return useSubscriptionContext(
    ConflictResolutionsContext(conflict.id),
    'Loading resolutions...',
    (resolutions) => {
      if (resolutions.some((r) => r.confirmed)) {
        return null;
      }

      if (!conflict.narrated) {
        if (me.role === 'gm') {
          return (
            <PopupForm label="Narrate the conflict" formComplete={false}>
              <p>Narrate the conflict. What&apos;s happening?</p>
              <Button
                variant="primary"
                disabled={loading}
                onClick={() => finishNarration()}
              >
                Finish Narration
              </Button>
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
              gameId={me.gameId}
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
          <PlayerConflictOptions conflict={conflict} me={me} />
        </PopupForm>
      );
    },
  );
}

export default function ConflictWithSubscriptions({
  conflict,
  me,
}: ConflictProps) {
  return (
    <ModelListSubscription
      channel="ResolutionsChannel"
      params={{ conflict_id: conflict.id, guid: me.guid }}
      context={ConflictResolutionsContext(conflict.id)}
    >
      <Conflict conflict={conflict} me={me} />
    </ModelListSubscription>
  );
}
