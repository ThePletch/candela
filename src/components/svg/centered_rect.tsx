import { Coordinate } from '@candela/types/svg';
import type { SVGProps } from 'react';

type CenteredRectProps = {
  center: Coordinate;
  width: number;
  height: number;
} & Omit<SVGProps<SVGRectElement>, 'x' | 'y'>;

export default function CenteredRect(props: CenteredRectProps) {
  const {
    center, width, height, ...remainingProps
  } = props;
  const [cx, cy] = center;
  return <rect x={cx - width / 2} y={cy - height / 2} width={width} height={height} {...remainingProps} />;
}
