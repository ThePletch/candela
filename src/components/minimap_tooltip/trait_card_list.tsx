import ListGroup from 'react-bootstrap/ListGroup';

import TraitCard from '@candela/components/minimap_tooltip/trait_card';
import type {
  AdjacentParticipation,
  Participation,
  TraitType,
} from "@candela/types/participation";

type ParticipationProps = {
  participation: Participation;
  isActiveParticipation: boolean;
};

export default function TraitCardList(props: ParticipationProps) {
  function getGiver(type: TraitType): AdjacentParticipation {
    switch (type) {
      case "brink":
        return props.participation.rightParticipation;
      case "vice":
        return props.participation.rightPlayer;
      case "virtue":
        return props.participation.leftPlayer;
      case "moment":
        return props.participation;
    }
  }

  return (
    <ListGroup>
      {props.participation.traits.map((trait, i) => (
        <TraitCard
          key={i}
          burned={trait.burned}
          giverRole={getGiver(trait.type).role}
          holderRole={props.participation.role}
          isTop={i === 0}
          type={trait.type}
          value={trait.value}
        />
      ))}
    </ListGroup>
  );
}
