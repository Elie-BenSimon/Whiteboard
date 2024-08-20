"use client";
import {
  getBezierPath,
  InternalNode,
  Node,
  useReactFlow,
  ViewportPortal,
} from "@xyflow/react";
import { useWhiteBoardContext } from "@/contexts/whiteboardContext";
import { getEdgeParams } from "@/lib/flowUtils";

const TempConnectionLine = () => {
  const { screenToFlowPosition } = useReactFlow();
  const { mousePosition, sourceNode, edgeColor } = useWhiteBoardContext();

  const flowMousePosition = screenToFlowPosition({
    x: mousePosition.x,
    y: mousePosition.y,
  });

  const sourceNodeFormated: InternalNode<Node> = {
    id: sourceNode?.id ?? "",
    measured: {
      width: sourceNode?.width,
      height: sourceNode?.height,
    },
    data: sourceNode?.data ?? {},
    position: {
      x: sourceNode?.positionAbsoluteX ?? 0,
      y: sourceNode?.positionAbsoluteY ?? 0,
    },
    internals: {
      positionAbsolute: {
        x: sourceNode?.positionAbsoluteX ?? 0,
        y: sourceNode?.positionAbsoluteY ?? 0,
      },
      z: 0,
      userNode: {
        id: "dummy",
        position: {
          x: sourceNode?.positionAbsoluteX ?? 0,
          y: sourceNode?.positionAbsoluteY ?? 0,
        },
        data: {},
      },
    },
  };

  const targetDummyNode: InternalNode = {
    id: "connection-target",
    measured: {
      width: 1,
      height: 1,
    },
    position: { x: flowMousePosition.x, y: flowMousePosition.y },
    data: {},
    internals: {
      positionAbsolute: { x: flowMousePosition.x, y: flowMousePosition.y },
      z: 0,
      userNode: {
        id: "dummy",
        position: { x: flowMousePosition.x, y: flowMousePosition.y },
        data: {},
      },
    },
  };

  const { sx, sy, sourcePosition, targetPosition } = getEdgeParams(
    sourceNodeFormated,
    targetDummyNode
  );

  // prevent path cropping
  const margin = 20;

  const offsetX = flowMousePosition.x - sx;
  const offsetY = flowMousePosition.y - sy;

  const minX = Math.min(sx, flowMousePosition.x) - margin;
  const minY = Math.min(sy, flowMousePosition.y) - margin;
  const width = Math.abs(offsetX) + margin * 2;
  const height = Math.abs(offsetY) + margin * 2;

  const adjustedSourceX = sx < flowMousePosition.x ? margin : width - margin;
  const adjustedSourceY = sy < flowMousePosition.y ? margin : height - margin;
  const adjustedTargetX = flowMousePosition.x > sx ? width - margin : margin;
  const adjustedTargetY = flowMousePosition.y > sy ? height - margin : margin;

  const [edgePath] = getBezierPath({
    sourceX: adjustedSourceX,
    sourceY: adjustedSourceY,
    sourcePosition,
    targetX: adjustedTargetX,
    targetY: adjustedTargetY,
    targetPosition,
  });

  return (
    <ViewportPortal>
      <svg
        className="pointer-events-none z-50"
        style={{
          left: minX,
          top: minY,
          width: Math.max(1, width),
          height: Math.max(1, height),
          position: "absolute",
          stroke: edgeColor,
        }}
      >
        <path
          className="stroke-[4px] z-20"
          d={edgePath}
          strokeWidth={4}
          fill="none"
        />
        <circle
          className="stroke-[4px] z-20"
          cx={adjustedTargetX}
          cy={adjustedTargetY}
          r={6}
          fill="white"
        />
      </svg>
    </ViewportPortal>
  );
};

export default TempConnectionLine;
