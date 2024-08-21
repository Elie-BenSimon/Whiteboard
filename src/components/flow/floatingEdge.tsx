import { EdgeShapes, getEdgeParams, getEdgePath } from "@/lib/flowUtils";
import { BaseEdge, EdgeProps, useInternalNode } from "@xyflow/react";

function FloatingEdge(props: EdgeProps) {
  const { source, target, data } = props;
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePosition, targetPosition } = getEdgeParams(
    sourceNode,
    targetNode
  );

  const [edgePath] = getEdgePath({
    shape: (data?.shape as EdgeShapes) ?? "bezier",
    sourceX: sx,
    sourceY: sy,
    sourcePosition,
    targetX: tx,
    targetY: ty,
    targetPosition,
  });

  return <BaseEdge {...props} path={edgePath} />;
}

export default FloatingEdge;
