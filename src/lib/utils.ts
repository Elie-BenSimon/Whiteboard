import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { Position, Node, XYPosition, InternalNode } from "@xyflow/react";

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(
  intersectionNode: InternalNode<Node>,
  targetNode: InternalNode<Node>,
  n = 0
): XYPosition {
  const { width, height } = intersectionNode.measured;
  const intersectionNodeWidth = width ?? 0;
  const intersectionNodeHeight = height ?? 0;
  const intersectionNodePosition = intersectionNode.internals.positionAbsolute;
  const targetPosition = targetNode.internals.positionAbsolute;

  const w = intersectionNodeWidth / 2 - n;
  const h = intersectionNodeHeight / 2 - n;

  const x2 = intersectionNodePosition.x + intersectionNodeWidth / 2;
  const y2 = intersectionNodePosition.y + intersectionNodeHeight / 2;
  const x1 = targetPosition.x + (targetNode.measured.width ?? 0) / 2;
  const y1 = targetPosition.y + (targetNode.measured.height ?? 0) / 2;

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
  node: InternalNode<Node>,
  intersectionPoint: XYPosition
): Position {
  const n = { ...node.internals.positionAbsolute, ...node };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + (node.measured.width ?? 0) - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (
    py >=
    node.internals.positionAbsolute.y + (node.measured.height ?? 0) - 1
  ) {
    return Position.Bottom;
  }

  return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(
  source: InternalNode<Node>,
  target: InternalNode<Node>
): {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  sourcePos: Position;
  targetPos: Position;
} {
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

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const saveNodesToLocalStorage = (nodes: Node[], key: string): void => {
  const prevSavedNodes = JSON.parse(localStorage.getItem(key) || "[]");
  const savedNodesSet = new Set(prevSavedNodes);

  nodes.forEach((node) => {
    localStorage.setItem(`${key}-${node.id}`, JSON.stringify(node));
    savedNodesSet.add(node.id);
  });

  localStorage.setItem(key, JSON.stringify([...savedNodesSet]));
};

export const loadNodesFromLocalStorage = (key: string): Node[] => {
  const savedNodes = localStorage.getItem(key);

  if (savedNodes) {
    const nodeIds = JSON.parse(savedNodes);

    if (Array.isArray(nodeIds)) {
      return nodeIds
        .map((nodeId) => {
          const rawNode = localStorage.getItem(`${key}-${nodeId}`);
          return rawNode ? JSON.parse(rawNode) : null;
        })
        .filter((node) => node !== null) as Node[];
    }
  }

  return [];
};

export const deleteNodesFromLocalStorage = (
  nodes: Node[],
  key: string
): void => {
  const savedNodes = localStorage.getItem(key);

  if (savedNodes) {
    const nodeIds = JSON.parse(savedNodes);

    if (Array.isArray(nodeIds)) {
      const nodeIdsSet = new Set(nodeIds);

      nodes.forEach((node) => {
        localStorage.removeItem(`${key}-${node.id}`);
        nodeIdsSet.delete(node.id);
      });

      localStorage.setItem(key, JSON.stringify([...nodeIdsSet]));
    }
  }
};
export const getRandomColor200 = () => {
  const colors = [
    "bg-red-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-indigo-200",
    "bg-teal-200",
    "bg-cyan-200",
  ];
  const index = Math.floor(Math.random() * colors.length);

  return colors[index];
};
