import {
  Position,
  Node,
  XYPosition,
  InternalNode,
  getBezierPath,
  getStraightPath,
  getSmoothStepPath,
} from "@xyflow/react";

export type EdgeShapes = "bezier" | "straight" | "step";

export type EdgeParams = {
  color: string;
  animated: boolean;
  shape: EdgeShapes;
  width: number;
};

const getNodeIntersection = (
  intersectionNode: InternalNode<Node>,
  targetNode: InternalNode<Node>,
  n = 0
): XYPosition => {
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
};

export const getPositionsByAngle = (
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  sideAngle: number = 45
): { sourcePosition: Position; targetPosition: Position } => {
  const deltaX = targetX - sourceX;
  const deltaY = targetY - sourceY;
  const angleRadians = Math.atan2(deltaY, deltaX);
  const angleDegrees = (angleRadians * 180) / Math.PI;

  let sourcePosition = Position.Bottom;
  let targetPosition = Position.Top;

  if (angleDegrees >= -sideAngle && angleDegrees <= sideAngle) {
    sourcePosition = Position.Right;
    targetPosition = Position.Left;
  } else if (angleDegrees > sideAngle && angleDegrees < 180 - sideAngle) {
    sourcePosition = Position.Bottom;
    targetPosition = Position.Top;
  } else if (
    angleDegrees >= 180 - sideAngle ||
    angleDegrees <= -(180 - sideAngle)
  ) {
    sourcePosition = Position.Left;
    targetPosition = Position.Right;
  } else if (angleDegrees < -sideAngle && angleDegrees > -(180 - sideAngle)) {
    sourcePosition = Position.Top;
    targetPosition = Position.Bottom;
  }

  return { sourcePosition, targetPosition };
};

export const getEdgeParams = (
  source: InternalNode<Node>,
  target: InternalNode<Node>
) => {
  const sourceIntersectionPointWithMargin = getNodeIntersection(source, target);
  const targetIntersectionPointWithMargin = getNodeIntersection(target, source);

  const { sourcePosition, targetPosition } = getPositionsByAngle(
    sourceIntersectionPointWithMargin.x,
    sourceIntersectionPointWithMargin.y,
    targetIntersectionPointWithMargin.x,
    targetIntersectionPointWithMargin.y
  );

  return {
    sx: sourceIntersectionPointWithMargin.x,
    sy: sourceIntersectionPointWithMargin.y,
    tx: targetIntersectionPointWithMargin.x,
    ty: targetIntersectionPointWithMargin.y,
    sourcePosition,
    targetPosition,
  };
};

type EdgePathParams = {
  shape: EdgeShapes;
  sourceX: number;
  sourceY: number;
  sourcePosition: Position;
  targetX: number;
  targetY: number;
  targetPosition: Position;
};

export const getEdgePath = ({ shape, ...rest }: EdgePathParams) => {
  switch (shape) {
    case "bezier":
      return getBezierPath(rest);
    case "straight":
      return getStraightPath(rest);
    case "step":
      return getSmoothStepPath(rest);
  }
};
