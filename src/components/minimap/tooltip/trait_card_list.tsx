import ListGroup from 'react-bootstrap/ListGroup';

import TraitCard from '@candela/components/minimap/tooltip/trait_card';
import {
  getLeftParticipation,
  getRightParticipation,
} from '@candela/state-helpers/participations';
import type { Participation, TraitType } from '@candela/types/participation';

type ParticipationProps = {
  participation: Participation;
  allParticipations: Participation[];
};

export default function TraitCardList({
  participation,
  allParticipations,
}: ParticipationProps) {
  // consistent-return can't detect exhaustive types :/
  // eslint-disable-next-line consistent-return
  function getGiver(type: TraitType): Participation {
    switch (type) {
      case 'brink':
        return getRightParticipation(participation, allParticipations, {
          skipGm: false,
        });
      case 'vice':
        return getRightParticipation(participation, allParticipations, {
          skipGm: true,
        });
      case 'virtue':
        return getLeftParticipation(participation, allParticipations, {
          skipGm: true,
        });
      case 'moment':
        return participation;
    }
  }

  return (
    <ListGroup>
      {participation.cardOrder.map((trait, i) => {
        const traitInfo = participation.traits[trait];
        if (traitInfo === undefined) {
          return null;
        }

        return (
          <TraitCard
            key={trait}
            giverRole={getGiver(trait).role}
            holderRole={participation.role}
            isTop={i === 0}
            type={trait}
            value={traitInfo.value}
          />
        );
      })}
    </ListGroup>
  );
}
