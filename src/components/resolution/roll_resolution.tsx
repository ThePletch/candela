import {
  BaseResolutionComponents,
  ConflictResult,
  type ResolutionProps,
} from "./base";

export default function RollResolution(
  props: ResolutionProps & { resolution: { type: "RollResolution" } }
) {
  return ConflictResult(BaseResolutionComponents(props));
}
