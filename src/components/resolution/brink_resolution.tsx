import type { ReactNode } from 'react';

import {
  BaseResolutionComponents,
  ConflictResult,
  PlayerRollResult,
  type ResolutionProps,
} from '@candela/components/resolution/base';

export default function BrinkResolution(
  props: ResolutionProps & { resolution: { type: 'BrinkResolution' } },
) {
  const { resolution } = props;
  const base = BaseResolutionComponents({
    ...props,
    resolution: resolution.parentResolution,
  });

  function hopeDieLossMessage(): ReactNode {
    if (resolution.resolver.hopeDieCount === 1) {
      return <span>Their hope die has been lost.</span>;
    }

    if (resolution.resolver.hopeDieCount > 1) {
      return <span>All of their hope dice have been lost.</span>;
    }

    return null;
  }

  function additionalInfo(): ReactNode {
    if (!resolution.successful) {
      return (
        <div>
          <span>
            {resolution.resolver.name}
            {' '}
            has been consumed by their brink.
          </span>
          {hopeDieLossMessage()}
          <span>
            Their brink has been burned and can no longer be embraced.
          </span>
        </div>
      );
    }

    return base.additionalInfo;
  }

  const components = {
    ...BaseResolutionComponents(props),
    playerResult: (
      <div>
        {base.playerResult}
        <em>
          But
          {' '}
          {resolution.resolver.name}
          {' '}
          chose to embrace their brink.
        </em>
        <PlayerRollResult resolution={resolution} />
      </div>
    ),
    activePlayerInfo: base.activePlayerInfo,
    additionalInfo: additionalInfo(),
  };

  return <ConflictResult {...components} />;
}
