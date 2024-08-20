import { getEdgeParams } from "@/lib/flowUtils";
import { EdgeProps, getBezierPath, useInternalNode } from "@xyflow/react";

function FloatingEdge({ id, source, target, markerEnd, style }: EdgeProps) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePosition, targetPosition } = getEdgeParams(
    sourceNode,
    targetNode
  );

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition,
    targetPosition,
    targetX: tx,
    targetY: ty,
  });

  return (
    <path
      id={id}
      className="react-flow__edge-path stroke-[4px]"
      d={edgePath}
      markerEnd={markerEnd}
      style={style}
      fill="none"
    />
  );
}

export default FloatingEdge;
