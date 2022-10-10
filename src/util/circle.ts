function distributedPointAngleRadians(index: number, total: number): number {
  return index * ((Math.PI * 2) / total) - Math.PI / 2;
}

export function distributedPointX(
  distance: number,
  index: number,
  total: number,
): number {
  return (
    distance * Math.cos(-distributedPointAngleRadians(index, total))
    + distance
    + 5
  );
}

export function distributedPointY(
  distance: number,
  index: number,
  total: number,
): number {
  return (
    distance * Math.sin(-distributedPointAngleRadians(index, total))
    + distance
    + 5
  );
}
