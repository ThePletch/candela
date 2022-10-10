import type { ReactNode } from 'react';

import {
  BaseResolutionComponents,
  ConflictResult,
  type ResolutionProps,
} from '@candela/components/resolution/base';

export default function MomentResolution(
  props: ResolutionProps & { resolution: { type: 'MomentResolution' } },
) {
  const { resolution } = props;
  function additionalInfo(): ReactNode {
    if (resolution.successful) {
      return (
        <span>
          {resolution.resolver.name}
          {' '}
          lived their moment and has earned a
          hope die.
        </span>
      );
    }

    return null;
  }

  const components = {
    ...BaseResolutionComponents(props),
    additionalInfo: additionalInfo(),
  };

  return <ConflictResult {...components} />;
}
