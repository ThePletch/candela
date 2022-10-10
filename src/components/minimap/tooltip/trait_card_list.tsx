import ListGroup from 'react-bootstrap/ListGroup';

import TraitCard from '@candela/components/minimap/tooltip/trait_card';
import { getLeftParticipation, getRightParticipation } from '@candela/state-helpers/participations';
import type {
  Participation,
  TraitType,
} from '@candela/types/participation';

type ParticipationProps = {
  participation: Participation;
  allParticipations: Participation[];
  isActiveParticipation: boolean;
};

export default function TraitCardList(props: ParticipationProps) {
  function getGiver(type: TraitType): Participation {
    switch (type) {
      case 'brink':
        return getRightParticipation(props.participation, props.allParticipations, { skipGm: false });
      case 'vice':
        return getRightParticipation(props.participation, props.allParticipations, { skipGm: true });
      case 'virtue':
        return getLeftParticipation(props.participation, props.allParticipations, { skipGm: true });
      case 'moment':
        return props.participation;
    }
  }

  return (
    <ListGroup>
      {props.participation.cardOrder.map((trait, i) => {
        const traitInfo = props.participation.traits[trait];
        if (traitInfo === undefined) {
          return null;
        }

        return (
          <TraitCard
            key={i}
            burned={traitInfo.burned}
            giverRole={getGiver(trait).role}
            holderRole={props.participation.role}
            isTop={i === 0}
            type={trait}
            value={traitInfo.value}
          />
        );
      })}
    </ListGroup>
  );
}
