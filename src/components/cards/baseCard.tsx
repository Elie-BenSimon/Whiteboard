import { cn } from "@/lib/utils";
import {
  Handle,
  Node,
  Position,
  useConnection,
  useViewport,
} from "@xyflow/react";
import React, { useState } from "react";
import Icon from "../ui/icon";

type BaseCardProps = {
  children: React.ReactNode;
};

const BaseCard: React.FC<BaseCardProps & Node> = ({
  id,
  children,
  selected,
}) => {
  const connection = useConnection();
  const connectionInProgress = connection.inProgress;
  const isTarget = connectionInProgress && connection.fromNode.id !== id;
  const { zoom } = useViewport();

  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonSize = 24;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const mouseX = (event.clientX - box.left) / zoom;
    const mouseY = (event.clientY - box.top) / zoom;

    let top = mouseY;
    let left = mouseX;

    if (mouseY < buttonSize) {
      top = 0;
    } else if (mouseY > box.height / zoom - buttonSize) {
      top = box.height / zoom - buttonSize;
    } else {
      top = mouseY - buttonSize / 2;
    }

    if (mouseX < buttonSize) {
      left = 0;
    } else if (mouseX > box.width / zoom - buttonSize) {
      left = box.width / zoom - buttonSize;
    } else {
      left = mouseX - buttonSize / 2;
    }

    setPosition({ top, left });
  };

  return (
    <div className="relative group p-6 z-10" onMouseMove={handleMouseMove}>
      {!connectionInProgress && (
        <button
          className="opacity-0 absolute bg-blue-500 text-white group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full"
          style={{
            top: position.top,
            left: position.left,
            width: buttonSize,
            height: buttonSize,
          }}
        >
          <Icon name="Plus" size={18} />
        </button>
      )}
      <Handle
        id="source"
        type="source"
        position={Position.Bottom}
        className={cn(
          "!cursor-pointer bg-transparent w-full h-full absolute top-0 left-0 translate-x-0 rounded-none border-0",
          isTarget && "-z-10"
        )}
      />
      <div
        className={cn(
          "relative shadow rounded border transition-all duration-75",
          selected && "shadow-lg scale-105"
        )}
      >
        <Handle
          id="target"
          type="target"
          position={Position.Top}
          className={cn(
            "bg-transparent w-full h-full absolute top-0 left-0 translate-x-0 rounded-none border-0",
            connectionInProgress && "z-10"
          )}
        />
        <div className="relative w-fit h-full">{children}</div>
      </div>
    </div>
  );
};

export default BaseCard;
