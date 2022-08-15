import {
  BaseResolutionComponents,
  ConflictResult,
  type ResolutionProps,
} from "@candela/components/resolution/base";

export default function RollResolution(
  props: ResolutionProps & { resolution: { type: "RollResolution" } }
) {
  return ConflictResult(BaseResolutionComponents(props));
}
