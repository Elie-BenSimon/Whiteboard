import React, { useState } from "react";
import Icon from "../ui/icon";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Node, useReactFlow } from "@xyflow/react";
import {
  cn,
  deleteNodesFromLocalStorage,
  saveNodesToLocalStorage,
} from "@/lib/utils";
import { useWhiteBoardContext } from "@/hooks/useWhiteBoardContext";

type DrawerItemProps = {
  node: Node;
};

const DrawerItem: React.FC<DrawerItemProps> = ({ node }) => {
  const { setListNodes, setIsDraggingFromList, setWikiSelectedNodesId } =
    useWhiteBoardContext();
  const { screenToFlowPosition } = useReactFlow();
  const [isDragging, setIsDragging] = useState(false);
  const [axisPosition, setAxisPosition] = useState({ x: 0, y: 0 });
  const { addNodes } = useReactFlow();
  const nodeRef = React.useRef(null);

  const handleDragStart = () => {
    setIsDragging(true);
    setIsDraggingFromList(true);
    setWikiSelectedNodesId([node.id]);
  };

  const handleDragStop = (e: DraggableEvent) => {
    const event = e as unknown as MouseEvent;
    setAxisPosition({ x: 0, y: 0 });
    const target = event.target as Element;
    const isOnWhiteboard = target?.classList.contains("react-flow__pane");
    setIsDraggingFromList(false);
    setIsDragging(false);

    if (!isOnWhiteboard) return;

    const newNode = {
      ...node,
      position: screenToFlowPosition({ x: event.clientX, y: event.clientY }),
      dragging: false,
      selected: false,
    };
    addNodes(newNode);
    deleteNodesFromLocalStorage([newNode], "reactFlowNodesList");
    setListNodes((prevNodes) => prevNodes.filter((n) => n.id !== node.id));
    saveNodesToLocalStorage([newNode], "reactFlowNodes");
  };

  const handleDragging = (_: DraggableEvent, data: DraggableData) => {
    setAxisPosition({ x: data.x, y: data.y });
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      onStart={handleDragStart}
      onDrag={handleDragging}
      onStop={handleDragStop}
      position={isDragging ? axisPosition : { x: 0, y: 0 }}
    >
      <div
        ref={nodeRef}
        className={cn(
          "flex justify-between items-center group hover:bg-black/5 cursor-pointer transition-all px-1.5 rounded-sm",
          isDragging && "cursor-grabbing pointer-events-none"
        )}
        onClick={() => setWikiSelectedNodesId([node.id])}
      >
        <div className="truncate pointer-events-none">
          {String(node.data.title)}
        </div>
        <Icon
          name="GripHorizontal"
          size={18}
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
        />
      </div>
    </Draggable>
  );
};

export default DrawerItem;
