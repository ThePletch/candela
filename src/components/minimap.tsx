import { forwardRef } from 'react';
import Badge from 'react-bootstrap/Badge';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import HopeDieIndicator from '@candela/components/minimap/tooltip/hope_die_indicator';
import TraitCardList from '@candela/components/minimap/tooltip/trait_card_list';
import PendingIndicator from '@candela/components/minimap/pending_indicator';
import TransferArrows from '@candela/components/minimap/transfer_arrows';
import CenteredRect from '@candela/components/svg/centered_rect';
import type { Game } from '@candela/types/game';
import type { Participation } from '@candela/types/participation';
import type { GameProps } from '@candela/types/props';
import { distributedPointX, distributedPointY } from '@candela/util/circle';
import { GameParticipationsContext } from '@candela/util/contexts';
import { useSubscriptionContext } from '@candela/util/state';

const ICON_SIZE = 6;
const ICON_BORDER_SIZE = 0.5;
const youColor = '#6699BB';
const otherColor = '#336699';
const aliveColor = '#777777';
const deadColor = '#770000';

type MinimapParticipationProps = {
  game: Game;
  participation: Participation;
  allParticipations: Participation[];
  isSelf: boolean;
  x: number;
  y: number;
};

function ParticipationDeathInfo({ participation }: { participation: Participation }) {
  if (!participation.alive) {
    return (
      <>
        <br />
        <Badge bg="danger">Dead</Badge>
      </>
    );
  }
  return null;
}

function YouBadge({ isSelf }: { isSelf: boolean }) {
  if (isSelf) {
    return (
      <Badge bg="success" className="float-right ml-1">
        you
      </Badge>
    );
  }

  return null;
}

const ParticipationIcon = forwardRef((forwardedProps: MinimapParticipationProps, ref) => {
  if (forwardedProps.participation.role === 'gm') {
    return (
      <svg {...forwardedProps} ref={ref as any}>
        <CenteredRect
          cx={forwardedProps.x}
          cy={forwardedProps.y}
          width={ICON_SIZE + ICON_BORDER_SIZE * 2}
          height={ICON_SIZE + ICON_BORDER_SIZE * 2}
          style={{ fill: aliveColor }}
        />
        <CenteredRect
          cx={forwardedProps.x}
          cy={forwardedProps.y}
          width={ICON_SIZE}
          height={ICON_SIZE}
          style={{ fill: forwardedProps.isSelf ? youColor : otherColor }}
        />
        <PendingIndicator
          x={forwardedProps.x}
          y={forwardedProps.y}
          participation={forwardedProps.participation}
          game={forwardedProps.game}
        />
      </svg>
    );
  }

  return (
    <svg {...forwardedProps} ref={ref as any}>
      <circle
        cx={forwardedProps.x}
        cy={forwardedProps.y}
        r={ICON_SIZE / 2 + ICON_BORDER_SIZE}
        style={{ fill: forwardedProps.participation.alive ? aliveColor : deadColor }}
      />
      <circle
        cx={forwardedProps.x}
        cy={forwardedProps.y}
        r={ICON_SIZE / 2}
        style={{ fill: forwardedProps.isSelf ? youColor : otherColor }}
      />
      <PendingIndicator
        x={forwardedProps.x}
        y={forwardedProps.y}
        participation={forwardedProps.participation}
        game={forwardedProps.game}
      />
    </svg>
  );
});

function MinimapParticipation(props: MinimapParticipationProps) {
  function renderParticipationInfo(subprops: any) {
    return (
      <Popover
        className="text-body"
        id={props.participation.name}
        {...subprops}
      >
        <Popover.Header>
          {props.participation.name}
          <YouBadge {...props} />
          <Badge bg="info" className="float-right">
            {props.participation.role}
          </Badge>
          <ParticipationDeathInfo {...props} />
        </Popover.Header>
        <Popover.Body>
          {props.participation.characterConcept}
          <HopeDieIndicator participation={props.participation} />
          <TraitCardList
            participation={props.participation}
            allParticipations={props.allParticipations}
            isActiveParticipation
          />
        </Popover.Body>
      </Popover>
    );
  }

  return (
    <OverlayTrigger placement="auto" overlay={renderParticipationInfo}>
      <ParticipationIcon />
    </OverlayTrigger>
  );
}

export default function Minimap(props: GameProps) {
  const participationDistance = 40;

  return useSubscriptionContext(
    GameParticipationsContext(props.game.id),
    'Loading players...',
    (participations) => (
      <svg
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 90 90"
        className="minimap"
      >
        {participations.map((p, i) => (
          <MinimapParticipation
            key={p.id}
            game={props.game}
            participation={p}
            allParticipations={participations}
            isSelf={p.id === props.me.id}
            x={distributedPointX(
              participationDistance,
              i,
              participations.length,
            )}
            y={distributedPointY(
              participationDistance,
              i,
              participations.length,
            )}
          />
        ))}
        <TransferArrows {...props} participations={participations} />
      </svg>
    ),
  );
}
