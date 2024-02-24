import {
  BaseResolutionComponents,
  ConflictResult,
  type ResolutionProps,
} from '@candela/components/resolution/base';

export default function RollResolution(
  props: ResolutionProps & {
    resolution: { type: 'RollResolution' };
    gameId: number;
  },
) {
  return ConflictResult(BaseResolutionComponents(props));
}
