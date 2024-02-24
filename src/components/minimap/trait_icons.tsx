import { Coordinate } from "@candela/types/svg";
import { tangentFrom } from "@candela/util/circle";

type TraitIconsProps = {
  position: Coordinate;
  angle: number;
}

export const TRAIT_ICON_DISTANCE = 10;
export default function TraitIcons({
  position,
  angle,
}: TraitIconsProps) {
  const [virtueX, virtueY] = tangentFrom(position, angle, TRAIT_ICON_DISTANCE);
  const [viceX, viceY] = tangentFrom(position, angle, -TRAIT_ICON_DISTANCE);

  return <>
    <text
      x={virtueX}
      y={virtueY}
      dy={1}
      dx={-1}
      stroke="none"
      fill="#ffffff"
      style={{ fontSize: '0.1em' }}
    >
      virtue
    </text>
    <text
      x={viceX}
      y={viceY}
      dy={1}
      dx={-1}
      stroke="none"
      fill="#ffffff"
      style={{ fontSize: '0.1em' }}
    >
      vice
    </text>
  </>;
}
