import type { ResolutionProps } from '@candela/components/resolution/base';
import BrinkResolution from '@candela/components/resolution/brink_resolution';
import MartyrResolution from '@candela/components/resolution/martyr_resolution';
import MomentResolution from '@candela/components/resolution/moment_resolution';
import RollResolution from '@candela/components/resolution/roll_resolution';
import TraitResolution from '@candela/components/resolution/trait_resolution';

// consistent-return can't detect exhaustive types :/
// eslint-disable-next-line consistent-return
export function renderResolutionByType({
  me,
  resolution,
  gameId,
}: ResolutionProps & { gameId: number }) {
  switch (resolution.type) {
    case 'BrinkResolution':
      return (
        <BrinkResolution resolution={resolution} me={me} gameId={gameId} />
      );
    case 'MartyrResolution':
      return (
        <MartyrResolution resolution={resolution} me={me} gameId={gameId} />
      );
    case 'MomentResolution':
      return (
        <MomentResolution resolution={resolution} me={me} gameId={gameId} />
      );
    case 'RollResolution':
      return <RollResolution resolution={resolution} me={me} gameId={gameId} />;
    case 'TraitResolution':
      return (
        <TraitResolution resolution={resolution} me={me} gameId={gameId} />
      );
  }
}

export function Resolution(props: ResolutionProps & { gameId: number }) {
  return renderResolutionByType(props);
}
