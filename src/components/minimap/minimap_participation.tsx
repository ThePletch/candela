import { Game } from "@candela/types/game";
import { Participation } from "@candela/types/participation";
import { forwardRef } from "react";
import { Badge, OverlayTrigger, Popover } from "react-bootstrap";
import CenteredRect from "@candela/components/svg/centered_rect";
import PendingIndicator from "./pending_indicator";
import HopeDieIndicator from "./tooltip/hope_die_indicator";
import TraitCardList from "./tooltip/trait_card_list";
import { Coordinate } from "@candela/types/svg";
import TraitIcons from "./trait_icons";

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
  position: Coordinate;
  angle: number;
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

const ParticipationIcon = forwardRef<SVGSVGElement, Omit<MinimapParticipationProps, 'allParticipations'>>(
  (props, ref) => {
    const {
      participation, position, angle, isSelf, game, ...forwardedProps
    } = props;
    const [x, y] = position;

    const defaultComponents = <>
      <text
        x={x}
        y={y}
        dy={6}
        stroke="none"
        fill="#ffffff"
        style={{ fontSize: '0.1em' }}
        textAnchor="middle"
      >
        {participation.name}
      </text>
      <PendingIndicator
        position={position}
        participation={participation}
        game={game}
      />
    </>;
    if (participation.role === 'gm') {
      return (
        <svg {...forwardedProps} ref={ref}>
          <CenteredRect
            center={position}
            width={ICON_SIZE + ICON_BORDER_SIZE * 2}
            height={ICON_SIZE + ICON_BORDER_SIZE * 2}
            style={{ fill: aliveColor }}
          />
          <CenteredRect
            center={position}
            width={ICON_SIZE}
            height={ICON_SIZE}
            style={{ fill: isSelf ? youColor : otherColor }}
          />
          {defaultComponents}
        </svg>
      );
    }

    game.setupState === "traits"

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
        {defaultComponents}
        {game.setupState === "traits" && <TraitIcons position={position} angle={angle} />}
      </svg>
    );
  },
);

export default function MinimapParticipation(props: MinimapParticipationProps) {
  const {
    participation, allParticipations, isSelf, position, angle, game,
  } = props;

  const participationInfo = <Popover className="text-body" id={participation.name}>
    <Popover.Header>
      <span className="mx-1">{participation.name}</span>
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
  </Popover>;

  return (
    <OverlayTrigger placement="auto" overlay={participationInfo}>
      <ParticipationIcon
        game={game}
        isSelf={isSelf}
        position={position}
        angle={angle}
        participation={participation}
      />
    </OverlayTrigger>
  );
}
