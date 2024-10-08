import { getEdgeParams } from "@/lib/flowUtils";
import {
  ConnectionLineComponentProps,
  getBezierPath,
  InternalNode,
} from "@xyflow/react";

function FloatingConnectionLine({
  toX,
  toY,
  fromNode,
}: ConnectionLineComponentProps) {
  if (!fromNode) {
    return null;
  }

  const targetNode: InternalNode = {
    id: "connection-target",
    measured: {
      width: 1,
      height: 1,
    },
    position: { x: 0, y: 0 },
    data: {},
    internals: {
      positionAbsolute: { x: toX, y: toY },
      z: 0,
      userNode: {
        id: "dummy",
        position: { x: 0, y: 0 },
        data: {},
      },
    },
  };

  const { sx, sy, sourcePosition, targetPosition } = getEdgeParams(
    fromNode,
    targetNode
  );
  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition,
    targetPosition,
    targetX: toX,
    targetY: toY,
  });

  return (
    <g>
      <path
        fill="none"
        stroke="#222"
        strokeWidth={4}
        className="animated"
        d={edgePath}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke="#222"
        strokeWidth={4}
      />
    </g>
  );
}

export default FloatingConnectionLine;
