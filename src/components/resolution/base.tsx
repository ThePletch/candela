import { type ChangeEvent, type ReactNode, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ListGroup from 'react-bootstrap/ListGroup';

import type {
  Participation,
  SelfParticipation,
  TraitType,
} from '@candela/types/participation';
import type { Resolution } from '@candela/types/resolution';
import { GameParticipationsContext } from '@candela/util/contexts';
import { getTopTrait } from '@candela/state-helpers/participations';
import { useHttpState, useSubscriptionContext } from '@candela/util/state';

import DiceRoll from '@candela/components/resolution/dice_roll';

export type ResolutionProps = {
  me: SelfParticipation;
  resolution: Resolution;
};

function isValidRecipient(participation: Participation, me: SelfParticipation) {
  return participation.id !== me.id && participation.role !== 'gm';
}

function BurnTraitButton({ me, resolution }: ResolutionProps) {
  const myTopTrait = getTopTrait(me);
  const { loading, makeRequest } = useHttpState(
    `api/conflicts/${resolution.conflict.id}/resolutions`,
    'POST',
    me.guid,
    {
      type: 'TraitResolution',
      resolution_id: resolution.id,
      burned_trait_type: myTopTrait,
    },
  );

  if (!myTopTrait) {
    return null;
  }

  function canBurnTrait(topTrait: keyof Participation['traits']) {
    return (
      ['virtue', 'vice'].includes(topTrait)
      && resolution.playerRollResult.includes('1')
    );
  }

  if (canBurnTrait(myTopTrait)) {
    if (resolution.parentResolution) {
      return (
        <Button variant="warning" disabled>
          You cannot burn your
          {' '}
          {myTopTrait}
          . This result is final.
        </Button>
      );
    }
    return (
      <Button
        variant="warning"
        disabled={loading}
        onClick={() => makeRequest()}
      >
        Burn your
        {' '}
        {myTopTrait}
        {' '}
        (
        {me.traits[myTopTrait]?.value || '[not set]'}
        )
        to reroll ones.
      </Button>
    );
  }

  return null;
}

function EmbraceBrinkButton({ resolution, me }: ResolutionProps) {
  const { loading, makeRequest } = useHttpState(
    `api/conflicts/${resolution.conflict.id}/resolutions`,
    'POST',
    me.guid,
    {
      type: 'BrinkResolution',
      resolution_id: resolution.id,
    },
  );

  const myTopTrait = getTopTrait(me);

  if (!myTopTrait) {
    return null;
  }

  function canEmbraceBrink(topTrait: TraitType) {
    return (
      topTrait === 'brink'
      && (resolution.successful || resolution.narrativeControl.id !== me.id)
    );
  }

  if (canEmbraceBrink(myTopTrait)) {
    if (resolution.parentResolution != null) {
      return (
        <Button variant="danger" disabled>
          You cannot embrace your brink. This result is final.
        </Button>
      );
    }
    return (
      <Button variant="danger" disabled={loading} onClick={() => makeRequest()}>
        Embrace your brink
      </Button>
    );
  }
  return null;
}

function ConfirmResultButton({
  resolution,
  me,
  gameId,
}: ResolutionProps & { gameId: number }) {
  const [beneficiary, setBeneficiary] = useState<string | null>(null);
  const { loading, makeRequest } = useHttpState(
    `api/resolutions/${resolution.id}/confirm`,
    'PATCH',
    me.guid,
  );

  function confirm() {
    const body = {} as {
      beneficiary_player_id?: string;
    };

    if (beneficiary) {
      body.beneficiary_player_id = beneficiary;
    }

    makeRequest(body);
  }

  function changeBeneficiary(event: ChangeEvent<HTMLSelectElement>) {
    setBeneficiary(event.target?.value);
  }

  function playerWillDie(): boolean {
    return !resolution.successful && resolution.conflict.dire;
  }

  return useSubscriptionContext(
    GameParticipationsContext(gameId),
    'Loading players...',
    (participations) => {
      if (
        playerWillDie()
        && me.hopeDieCount > 0
        && resolution.type === 'MartyrResolution'
      ) {
        return (
          <div>
            <select
              disabled={participations.length === 0}
              onChange={changeBeneficiary}
            >
              <option disabled={participations.length > 0}>
                {participations.length === 0
                  ? 'Loading hope die recipients...'
                  : 'Choose who will receive your hope die.'}
              </option>
              <option key="0" value={undefined}>
                No one
              </option>
              {participations
                .filter((p) => isValidRecipient(p, me))
                .map((participation) => (
                  <option key={participation.id} value={participation.id}>
                    {participation.name}
                  </option>
                ))}
            </select>
            <Button
              variant="primary"
              onClick={() => confirm()}
              disabled={loading || beneficiary === null}
            >
              Confirm Result
            </Button>
          </div>
        );
      }
      return (
        <Button variant="primary" disabled={loading} onClick={() => confirm()}>
          Confirm Result
        </Button>
      );
    },
  );
}

function ResolutionAcceptanceOptions({
  resolution,
  me,
  gameId,
}: ResolutionProps & { gameId: number }) {
  const { loading: martyrLoading, makeRequest: martyr } = useHttpState(
    `api/conflicts/${resolution.conflict.id}/resolutions`,
    'POST',
    me.guid,
    {
      type: 'MartyrResolution',
      resolution_id: resolution.id,
    },
  );

  if (me.id === resolution.resolver.id) {
    return (
      <div style={{ display: 'grid' }}>
        <ButtonGroup>
          <ConfirmResultButton
            resolution={resolution}
            me={me}
            gameId={gameId}
          />
          <BurnTraitButton resolution={resolution} me={me} />
          <EmbraceBrinkButton resolution={resolution} me={me} />
        </ButtonGroup>
      </div>
    );
  }
  if (
    resolution.conflict.dire
    && !resolution.successful
    && !resolution.parentResolution
  ) {
    return (
      <div>
        <Button
          variant="primary"
          disabled={martyrLoading}
          onClick={() => martyr()}
        >
          Martyr yourself to save
          {' '}
          {resolution.resolver.name}
        </Button>
      </div>
    );
  }

  return (
    <em>
      Waiting for
      {resolution.resolver.name}
      {' '}
      to resolve this conflict.
    </em>
  );
}

export function PlayerRollResult({ resolution }: { resolution: Resolution }) {
  return (
    <div>
      <DiceRoll
        roller="player"
        roll={resolution.playerRollResult}
        hopeDieCount={resolution.resolver.hopeDieCount}
      />
    </div>
  );
}

export function GmRollResult({ resolution }: { resolution: Resolution }) {
  return (
    <div>
      <DiceRoll roller="gm" roll={resolution.gmRollResult} hopeDieCount={0} />
    </div>
  );
}

type Components<T extends string> = {
  [K in T]: ReactNode;
};

type ConflictResultComponents = Components<
| 'activePlayerInfo'
| 'playerResult'
| 'gmResult'
| 'successMessage'
| 'additionalInfo'
| 'narrativeControlInfo'
| 'acceptanceOptions'
>;

export function ConflictResult({
  activePlayerInfo,
  playerResult,
  gmResult,
  successMessage,
  additionalInfo,
  narrativeControlInfo,
  acceptanceOptions,
}: ConflictResultComponents) {
  return (
    <>
      <h3>Conflict results</h3>
      <ListGroup>
        <ListGroup.Item>{activePlayerInfo}</ListGroup.Item>
        <ListGroup.Item>
          <h5>PLAYER</h5>
          {playerResult}
        </ListGroup.Item>
        <ListGroup.Item>
          <h5>GM</h5>
          {gmResult}
        </ListGroup.Item>
        <ListGroup.Item>{successMessage}</ListGroup.Item>
        <ListGroup.Item>{additionalInfo}</ListGroup.Item>
        <ListGroup.Item>{narrativeControlInfo}</ListGroup.Item>
      </ListGroup>
      {acceptanceOptions}
    </>
  );
}

// todo better indicate when someone martyrs themselves
export function BaseResolutionComponents({
  resolution,
  me,
  gameId,
}: ResolutionProps & { gameId: number }): ConflictResultComponents {
  function activePlayerInfo() {
    return (
      <span>
        {resolution.resolver.name}
        {' '}
        chose to face this conflict.
      </span>
    );
  }

  function successMessage() {
    return (
      <span>
        {resolution.resolver.name}
        {' '}
        {resolution.successful ? 'succeeded.' : 'failed.'}
      </span>
    );
  }

  function narrativeControlInfo() {
    return (
      <span>
        Narrative control will go to
        {' '}
        {resolution.narrativeControl.name}
        .
      </span>
    );
  }

  return {
    activePlayerInfo: activePlayerInfo(),
    playerResult: <PlayerRollResult resolution={resolution} />,
    gmResult: <GmRollResult resolution={resolution} />,
    additionalInfo: null,
    successMessage: successMessage(),
    narrativeControlInfo: narrativeControlInfo(),
    acceptanceOptions: (
      <ResolutionAcceptanceOptions
        resolution={resolution}
        me={me}
        gameId={gameId}
      />
    ),
  };
}
