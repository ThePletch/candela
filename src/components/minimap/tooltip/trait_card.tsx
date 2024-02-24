import ListGroup from 'react-bootstrap/ListGroup';

import type { Participation, TraitType } from '@candela/types/participation';

type TraitCardProps = {
  giverRole: Participation['role'];
  holderRole: Participation['role'];
  isTop: boolean;
  type: TraitType;
  value: string;
};

// consistent-return can't detect exhaustive types :/
// eslint-disable-next-line consistent-return
function pretext(
  type: TraitType,
  giverRole: Participation['role'],
  holderRole: Participation['role'],
): string {
  switch (type) {
    case 'brink':
      if (giverRole === 'gm') {
        return "They've seen you...";
      }

      if (holderRole === 'gm') {
        return "I've seen Them...";
      }

      return "I've seen you...";
    case 'virtue':
      return '';
    case 'vice':
      return '';
    case 'moment':
      return 'I will find hope...';
  }
}

export default function TraitCard({
  giverRole,
  holderRole,
  isTop,
  type,
  value,
}: TraitCardProps) {
  return (
    <ListGroup.Item key={type} active={isTop}>
      <h6>{type}</h6>
      <div>
        <em>{pretext(type, giverRole, holderRole)}</em>
      </div>
      <span>{value}</span>
    </ListGroup.Item>
  );
}
