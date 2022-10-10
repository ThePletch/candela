import type { ResolutionProps } from '@candela/components/resolution/base';
import BrinkResolution from '@candela/components/resolution/brink_resolution';
import MartyrResolution from '@candela/components/resolution/martyr_resolution';
import MomentResolution from '@candela/components/resolution/moment_resolution';
import RollResolution from '@candela/components/resolution/roll_resolution';
import TraitResolution from '@candela/components/resolution/trait_resolution';

export function renderResolutionByType(props: ResolutionProps) {
  switch (props.resolution.type) {
    case 'BrinkResolution':
      return (
        <BrinkResolution
          resolution={props.resolution}
          me={props.me}
          gameId={props.gameId}
        />
      );
    case 'MartyrResolution':
      return (
        <MartyrResolution
          resolution={props.resolution}
          me={props.me}
          gameId={props.gameId}
        />
      );
    case 'MomentResolution':
      return (
        <MomentResolution
          resolution={props.resolution}
          me={props.me}
          gameId={props.gameId}
        />
      );
    case 'RollResolution':
      return (
        <RollResolution
          resolution={props.resolution}
          me={props.me}
          gameId={props.gameId}
        />
      );
    case 'TraitResolution':
      return (
        <TraitResolution
          resolution={props.resolution}
          me={props.me}
          gameId={props.gameId}
        />
      );
  }
}

export function Resolution(props: ResolutionProps) {
  return renderResolutionByType(props);
}
