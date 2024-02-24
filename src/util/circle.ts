import { GAME_MAP_SIZE } from "@candela/constants";
import { Coordinate } from "@candela/types/svg";

const DISTRIBUTION_OFFSET = -Math.PI / 2;

export function distributedPointAngleRadians(index: number, total: number): number {
  return index * ((Math.PI * 2) / total) + DISTRIBUTION_OFFSET;
}

export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

export function distributedPointX(
  distance: number,
  index: number,
  total: number,
): number {
  return (
    distance * Math.cos(-distributedPointAngleRadians(index, total))
    + GAME_MAP_SIZE / 2
  );
}

export function distributedPointY(
  distance: number,
  index: number,
  total: number,
): number {
  return (
    distance * Math.sin(-distributedPointAngleRadians(index, total))
    + GAME_MAP_SIZE / 2
  );
}

export function positionFor(playerIndex: number, totalCount: number): Coordinate {
  return [
    distributedPointX(
      40,
      playerIndex,
      totalCount,
    ),
    distributedPointY(
      40,
      playerIndex,
      totalCount,
    ),
  ];
}

export function tangentFrom(position: Coordinate, pointAngle: number, byDistance: number): Coordinate {
  const [baseX, baseY] = position;

  return [
    baseX + byDistance * Math.sin(pointAngle),
    baseY + byDistance * Math.cos(pointAngle),
  ];
}
