import type { ResolutionProps } from "./base";

import BrinkResolution from "./brink_resolution";
import MartyrResolution from "./martyr_resolution";
import MomentResolution from "./moment_resolution";
import RollResolution from "./roll_resolution";
import TraitResolution from "./trait_resolution";

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
