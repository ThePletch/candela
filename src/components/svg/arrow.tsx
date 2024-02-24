import type { SVGProps } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Coordinate } from '@candela/types/svg';

type ArrowProps = {
  startCoordinate: Coordinate;
  endCoordinate: Coordinate;
  arrowHeight?: number;
  arrowWidth?: number;
  lateralOffset?: number;
  color?: string;
  title?: string;
} & Omit<SVGProps<SVGPathElement>, 'd' | 'children'>;

export default function Arrow({
  startCoordinate,
  endCoordinate,
  arrowHeight = 2,
  arrowWidth = 3,
  color = '#ff0000',
  title = undefined,
}: ArrowProps) {
  const [startX, startY] = startCoordinate;
  const [endX, endY] = endCoordinate;
  const dy = endY - startY;
  const dx = endX - startX;
  const lineAngle = Math.atan2(dy, dx);
  const adjustedEndX = endX - (arrowHeight / 2 + 3) * Math.cos(lineAngle);
  const adjustedEndY = endY - (arrowHeight / 2 + 3) * Math.sin(lineAngle);
  const tooltip = <Tooltip>{title}</Tooltip>;
  const arrowSvg = (
    <svg>
      <defs>
        <marker
          id={`arrowhead-${color}`}
          orient="auto"
          markerWidth={arrowHeight}
          markerHeight={arrowWidth}
          stroke="none"
          fill={color}
          refX={arrowHeight / 2}
          refY={arrowWidth / 2}
        >
          <path d={`M0,0 V${arrowWidth} L${arrowHeight},${arrowWidth / 2} Z`} />
        </marker>
      </defs>

      <path
        markerEnd={`url(#arrowhead-${color})`}
        strokeWidth="1"
        stroke={color}
        fill="none"
        opacity={0.5}
        /**
         * Move the cursor to startX, startY (M command), then
         * draw a line from there to endX, endY (L command)
         */
        d={`M${startX},${startY} L${adjustedEndX},${adjustedEndY}`}
      />
    </svg>
  );

  if (title) {
    return (
      <OverlayTrigger overlay={tooltip} placement="auto">
        {arrowSvg}
      </OverlayTrigger>
    );
  }

  return arrowSvg;
}
