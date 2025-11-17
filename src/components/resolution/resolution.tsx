import type { ResolutionProps } from "@candela/components/resolution/base";
import BrinkResolution from "@candela/components/resolution/BrinkResolution";
import MartyrResolution from "@candela/components/resolution/MartyrResolution";
import MomentResolution from "@candela/components/resolution/MomentResolution";
import RollResolution from "@candela/components/resolution/RollResolution";
import TraitResolution from "@candela/components/resolution/TraitResolution";

export function renderResolutionByType({
  me,
  resolution,
  gameId,
}: ResolutionProps & { gameId: number }) {
  switch (resolution.type) {
    case "BrinkResolution":
      return (
        <BrinkResolution resolution={resolution} me={me} gameId={gameId} />
      );
    case "MartyrResolution":
      return (
        <MartyrResolution resolution={resolution} me={me} gameId={gameId} />
      );
    case "MomentResolution":
      return (
        <MomentResolution resolution={resolution} me={me} gameId={gameId} />
      );
    case "RollResolution":
      return <RollResolution resolution={resolution} me={me} gameId={gameId} />;
    case "TraitResolution":
      return (
        <TraitResolution resolution={resolution} me={me} gameId={gameId} />
      );
  }
}

export function Resolution(props: ResolutionProps & { gameId: number }) {
  return renderResolutionByType(props);
}
