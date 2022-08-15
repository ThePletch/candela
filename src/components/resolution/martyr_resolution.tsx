import type { ReactNode } from "react";

import {
  BaseResolutionComponents,
  ConflictResult,
  type ResolutionProps,
} from "@candela/components/resolution/base";

export default function MartyrResolution(
  props: ResolutionProps & { resolution: { type: "MartyrResolution" } }
) {
  function narrativeControlInfo(): ReactNode {
    let originalPlayer = props.resolution.parentResolution.resolver;
    return (
      <span>
        {props.resolution.narrativeControl.name} sacrificed themselves to save{" "}
        {originalPlayer.name}. They have narrative control.
      </span>
    );
  }

  const base = BaseResolutionComponents({
    ...props,
    resolution: props.resolution.parentResolution,
  });

  const components = {
    ...BaseResolutionComponents(props),
    activePlayerInfo: base.activePlayerInfo,
    successMessage: (
      <span>
        {props.resolution.parentResolution.resolver.name} failed, but has been
        saved.
      </span>
    ),
    narrativeControlInfo: narrativeControlInfo(),
  };

  return <ConflictResult {...components} />;
}
