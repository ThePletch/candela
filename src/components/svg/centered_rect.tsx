import type { SVGProps } from 'react';

type CenteredRectProps = {
  cx: number;
  cy: number;
  width: number;
  height: number;
} & Omit<SVGProps<SVGRectElement>, 'x' | 'y'>;

export default function CenteredRect(props: CenteredRectProps) {
  const {
    cx, cy, width, height, ...remainingProps
  } = props;
  return <rect x={cx - width / 2} y={cy - height / 2} width={width} height={height} {...remainingProps} />;
}
