import {
  BaseResolutionComponents,
  ConflictResult,
  PlayerRollResult,
  type ResolutionProps,
} from '@candela/components/resolution/base';

export default function TraitResolution(
  props: ResolutionProps & { resolution: { type: 'TraitResolution' } },
) {
  const base = BaseResolutionComponents({
    ...props,
    resolution: props.resolution.parentResolution,
  });

  return ConflictResult({
    ...BaseResolutionComponents(props),
    playerResult: (
      <div>
        {base.playerResult}
        <em>
          But
          {' '}
          {props.resolution.resolver.name}
          {' '}
          burned their
          {' '}
          {props.resolution.burnedTrait.type}
          {' '}
          to reroll ones.
        </em>
        <PlayerRollResult resolution={props.resolution} />
      </div>
    ),
  });
}
