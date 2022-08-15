import type { ResolutionProps } from "@candela/components/resolution/base";
import BrinkResolution from "@candela/components/resolution/brink_resolution";
import MartyrResolution from "@candela/components/resolution/martyr_resolution";
import MomentResolution from "@candela/components/resolution/moment_resolution";
import RollResolution from "@candela/components/resolution/roll_resolution";
import TraitResolution from "@candela/components/resolution/trait_resolution";

export function renderResolutionByType(props: ResolutionProps) {
  switch (props.resolution.type) {
    case "RollResolution":
      return (
        <RollResolution
          gameId={props.gameId}
          activeParticipation={props.activeParticipation}
          resolution={props.resolution}
        />
      );
    case "MomentResolution":
      return (
        <MomentResolution
          gameId={props.gameId}
          activeParticipation={props.activeParticipation}
          resolution={props.resolution}
        />
      );
    case "MartyrResolution":
      return (
        <MartyrResolution
          gameId={props.gameId}
          activeParticipation={props.activeParticipation}
          resolution={props.resolution}
        />
      );
    case "BrinkResolution":
      return (
        <BrinkResolution
          gameId={props.gameId}
          activeParticipation={props.activeParticipation}
          resolution={props.resolution}
        />
      );
    case "TraitResolution":
      return (
        <TraitResolution
          gameId={props.gameId}
          activeParticipation={props.activeParticipation}
          resolution={props.resolution}
        />
      );
  }
}

export function Resolution(props: ResolutionProps) {
  return renderResolutionByType(props);
}
