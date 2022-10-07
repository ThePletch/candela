import Badge from 'react-bootstrap/Badge';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import HopeDieIndicator from '@candela/components/minimap_tooltip/hope_die_indicator';
import TraitCardList from '@candela/components/minimap_tooltip/trait_card_list';
import type { Participation } from '@candela/types/participation';
import { GameParticipationsContext } from "@candela/util/contexts";
import { useSubscriptionContext } from "@candela/util/state";

function MinimapParticipation(props: { participation: Participation, x: number, y: number }) {
  const gmColor = "#00dd00";
  const playerColor = "#336699";
  const aliveColor = "#777777";
  const deadColor = "#770000";

  function ParticipationDeathInfo() {
    if (!props.participation.alive) {
      return <>
        <br />
        <Badge bg="danger">Dead</Badge>
      </>;
    }
    return null;
  }

  function renderParticipationInfo(subprops: any) {
    return <Popover className="text-body" id={props.participation.name} {...subprops}>
      <Popover.Header>
        {props.participation.name} ({props.participation.role})
        <ParticipationDeathInfo />
      </Popover.Header>
      <Popover.Body>
        {props.participation.characterConcept}
        <HopeDieIndicator participation={props.participation} />
        <TraitCardList participation={props.participation} isActiveParticipation={true} />
      </Popover.Body>
    </Popover>;
  }

  return <OverlayTrigger placement="auto" overlay={renderParticipationInfo}>
    <svg>
      <circle
        cx={props.x}
        cy={props.y}
        r="3.5"
        style={{ fill: props.participation.alive ? aliveColor : deadColor }}
      />
      <circle
        cx={props.x}
        cy={props.y}
        r="3"
        style={{ fill: props.participation.role == "gm" ? gmColor : playerColor }}
      />
    </svg>
  </OverlayTrigger>;
}

export default function Minimap() {
  const participationDistance = 40;

  function participationAngleRadians(index: number, total: number): number {
    return index * ((Math.PI * 2) / total) - Math.PI / 3;
  }

  function participationX(index: number, total: number): number {
    return participationDistance * Math.cos(participationAngleRadians(index, total)) + 45;
  }

  function participationY(index: number, total: number): number {
    return participationDistance * Math.sin(participationAngleRadians(index, total)) + 45;
  }

  return useSubscriptionContext(GameParticipationsContext, "Loading players...", (participations) => {
    return <svg
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 90 90"
      className="minimap"
    >
      {participations.map(
        (p, i) =>
          <MinimapParticipation key={p.id} participation={p} x={participationX(i, participations.length)} y={participationY(i, participations.length)} />
      )}
    </svg>
  });
}
