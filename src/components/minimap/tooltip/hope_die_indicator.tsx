import _ from 'lodash';
import Badge from 'react-bootstrap/Badge';

import type { Participation } from '@candela/types/participation';

export default function HopeDieIndicator({
  participation,
}: {
  participation: Participation;
}) {
  if (participation.hopeDieCount > 0) {
    return (
      <>
        <br />
        {_.times(participation.hopeDieCount, (index) => (
          <Badge pill key={index} bg="info" className="mr-1">
            &nbsp;&nbsp;
          </Badge>
        ))}
        <span>Found hope.</span>
      </>
    );
  }

  return null;
}
