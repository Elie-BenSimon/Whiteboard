import { getEdgeParams } from "@/lib/utils";
import { ConnectionLineComponentProps, getBezierPath } from "@xyflow/react";

function FloatingConnectionLine({
  toX,
  toY,
  fromNode,
}: ConnectionLineComponentProps) {
  if (!fromNode) {
    return null;
  }

  const targetNode = {
    id: "connection-target",
    measured: {
      width: 1,
      height: 1,
    },
    internals: {
      positionAbsolute: { x: toX, y: toY },
    },
  };

  const { sx, sy, sourcePos, targetPos } = getEdgeParams(fromNode, targetNode);
  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: toX,
    targetY: toY,
  });

  return (
    <g>
      <path
        fill="none"
        stroke="#222"
        strokeWidth={1.5}
        className="animated"
        d={edgePath}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke="#222"
        strokeWidth={1.5}
      />
    </g>
  );
}

export default FloatingConnectionLine;
