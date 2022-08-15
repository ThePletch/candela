import type { ReactNode } from "react";

import {
  BaseResolutionComponents,
  ConflictResult,
  type ResolutionProps,
} from "@candela/components/resolution/base";

export default function MomentResolution(
  props: ResolutionProps & { resolution: { type: "MomentResolution" } }
) {
  function additionalInfo(): ReactNode {
    if (props.resolution.successful) {
      return (
        <span>
          {props.resolution.resolver.name} lived their moment and has earned a
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
