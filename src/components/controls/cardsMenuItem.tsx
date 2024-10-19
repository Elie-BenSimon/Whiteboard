import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import React, { useState } from "react";
import Icon, { IconName } from "../ui/icon";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import { v4 as uuidV4 } from "uuid";

type CardsMenuItemProps = {
  nodeType: string;
  icon: IconName;
  color: string;
};

const CardsMenuItem: React.FC<CardsMenuItemProps> = ({
  nodeType,
  icon,
  color,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [axisPosition, setAxisPosition] = useState({ x: 0, y: 0 });
  const { addNodes } = useReactFlow();
  const nodeRef = React.useRef(null);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragStop = (e: DraggableEvent) => {
    const event = e as unknown as MouseEvent;
    setIsDragging(false);
    setAxisPosition({ x: 0, y: 0 });
    const target = event.target as Element;
    const isOnWhiteboard = target?.classList.contains("react-flow__pane");
    if (!isOnWhiteboard) return;

    addNodes({
      id: uuidV4(),
      type: nodeType,
      position: { x: event.clientX, y: event.clientY },
      data: { title: "" },
    });
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
      position={axisPosition}
    >
      <span ref={nodeRef} className={cn(isDragging && "pointer-events-none")}>
        <div
          className={cn(
            "group cursor-grab w-11 h-11 rounded flex justify-center items-center shadow-sm hover:scale-105 hover-shadow transition-all",
            color,
            isDragging && "shadow-md scale-110"
          )}
        >
          <Icon
            name={icon}
            className={cn(
              "group-hover:scale-105 transition-transform",
              isDragging && "scale-110"
            )}
          />
        </div>
      </span>
    </Draggable>
  );
};

export default CardsMenuItem;
