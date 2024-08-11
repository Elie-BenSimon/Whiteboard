import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import {
  Position,
  MarkerType,
  InternalNode,
  Node,
  XYPosition,
} from "@xyflow/react";

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(
  intersectionNode: {
    measured: { width: number; height: number };
    internals: { positionAbsolute: XYPosition };
  },
  targetNode: {
    internals: { positionAbsolute: { x: number; y: number } };
    measured: { width: number; height: number };
  },
  n = 0
) {
  const { width: intersectionNodeWidth, height: intersectionNodeHeight } =
    intersectionNode.measured;
  const intersectionNodePosition = intersectionNode.internals.positionAbsolute;
  const targetPosition = targetNode.internals.positionAbsolute;

  const w = intersectionNodeWidth / 2 - n;
  const h = intersectionNodeHeight / 2 - n;

  const x2 = intersectionNodePosition.x + intersectionNodeWidth / 2;
  const y2 = intersectionNodePosition.y + intersectionNodeHeight / 2;
  const x1 = targetPosition.x + targetNode.measured.width / 2;
  const y1 = targetPosition.y + targetNode.measured.height / 2;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(
  node: { internals: { positionAbsolute: any } },
  intersectionPoint: XYPosition
) {
  const n = { ...node.internals.positionAbsolute, ...node };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + n.measured.width - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + n.measured.height - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(
  source: InternalNode<Node>,
  target: InternalNode<Node>
) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);
  const sourceIntersectionPointWithMargin = getNodeIntersection(
    source,
    target,
    24
  );
  const targetIntersectionPointWithMargin = getNodeIntersection(
    target,
    source,
    24
  );

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPointWithMargin.x,
    sy: sourceIntersectionPointWithMargin.y,
    tx: targetIntersectionPointWithMargin.x,
    ty: targetIntersectionPointWithMargin.y,
    sourcePos,
    targetPos,
  };
}

export function createNodesAndEdges() {
  const nodes = [];
  const edges = [];
  const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  nodes.push({ id: "target", data: { label: "Target" }, position: center });

  for (let i = 0; i < 8; i++) {
    const degrees = i * (360 / 8);
    const radians = degrees * (Math.PI / 180);
    const x = 250 * Math.cos(radians) + center.x;
    const y = 250 * Math.sin(radians) + center.y;

    nodes.push({ id: `${i}`, data: { label: "Source" }, position: { x, y } });

    edges.push({
      id: `edge-${i}`,
      target: "target",
      source: `${i}`,
      type: "floating",
      markerEnd: {
        type: MarkerType.Arrow,
      },
    });
  }

  return { nodes, edges };
}

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};
