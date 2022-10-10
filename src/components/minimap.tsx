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

function ParticipationDeathInfo({
  participation,
}: {
  participation: Participation;
}) {
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

const ParticipationIcon = forwardRef<SVGSVGElement, MinimapParticipationProps>(
  (forwardedProps, ref) => {
    const {
      participation, x, y, isSelf, game,
    } = forwardedProps;
    if (participation.role === 'gm') {
      return (
        <svg {...forwardedProps} ref={ref}>
          <CenteredRect
            cx={x}
            cy={y}
            width={ICON_SIZE + ICON_BORDER_SIZE * 2}
            height={ICON_SIZE + ICON_BORDER_SIZE * 2}
            style={{ fill: aliveColor }}
          />
          <CenteredRect
            cx={x}
            cy={y}
            width={ICON_SIZE}
            height={ICON_SIZE}
            style={{ fill: isSelf ? youColor : otherColor }}
          />
          <PendingIndicator
            x={x}
            y={y}
            participation={participation}
            game={game}
          />
        </svg>
      );
    }

    return (
      <svg {...forwardedProps} ref={ref}>
        <circle
          cx={x}
          cy={y}
          r={ICON_SIZE / 2 + ICON_BORDER_SIZE}
          style={{ fill: participation.alive ? aliveColor : deadColor }}
        />
        <circle
          cx={x}
          cy={y}
          r={ICON_SIZE / 2}
          style={{ fill: isSelf ? youColor : otherColor }}
        />
        <PendingIndicator
          x={x}
          y={y}
          participation={participation}
          game={game}
        />
      </svg>
    );
  },
);

function ParticipationInfo({
  participation,
  allParticipations,
  isSelf,
  ...subprops
}: {
  participation: Participation;
  allParticipations: Participation[];
  isSelf: boolean;
}) {
  return (
    <Popover className="text-body" id={participation.name} {...subprops}>
      <Popover.Header>
        {participation.name}
        <YouBadge isSelf={isSelf} />
        <Badge bg="info" className="float-right">
          {participation.role}
        </Badge>
        <ParticipationDeathInfo participation={participation} />
      </Popover.Header>
      <Popover.Body>
        {participation.characterConcept}
        <HopeDieIndicator participation={participation} />
        <TraitCardList
          participation={participation}
          allParticipations={allParticipations}
        />
      </Popover.Body>
    </Popover>
  );
}

function MinimapParticipation(props: MinimapParticipationProps) {
  const {
    participation, allParticipations, isSelf, x, y, game,
  } = props;

  // we have to extend unknown here so React doesn't parse the angle brackets
  // as JSX
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  const renderParticipationInfo = <K extends unknown>(additionalProps: K) => (
    <ParticipationInfo
      participation={participation}
      allParticipations={allParticipations}
      isSelf={isSelf}
      {...additionalProps}
    />
  );

  return (
    <OverlayTrigger placement="auto" overlay={renderParticipationInfo}>
      <ParticipationIcon
        game={game}
        isSelf={isSelf}
        x={x}
        y={y}
        participation={participation}
        allParticipations={allParticipations}
      />
    </OverlayTrigger>
  );
}

export default function Minimap({ game, me }: GameProps) {
  const participationDistance = 40;

  return useSubscriptionContext(
    GameParticipationsContext(game.id),
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
            game={game}
            participation={p}
            allParticipations={participations}
            isSelf={p.id === me.id}
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
        <TransferArrows game={game} me={me} participations={participations} />
      </svg>
    ),
  );
}
