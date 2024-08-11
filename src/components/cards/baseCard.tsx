import { cn } from "@/lib/utils";
import { Handle, Position, useConnection } from "@xyflow/react";
import React, { useState } from "react";

type BaseCardProps = {
  id: string;
  children: React.ReactNode;
  color?: string;
};
const BaseCard: React.FC<BaseCardProps> = ({ id, children, color }) => {
  const connection = useConnection();
  const connectionInProgress = connection.inProgress;
  const isTarget = connectionInProgress && connection.fromNode.id !== id;

  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - box.left;
    const mouseY = event.clientY - box.top;

    const top =
      mouseY > box.height - 24 ? box.height - 24 : mouseY < 24 ? 0 : mouseY;
    const left =
      mouseX > box.width - 24 ? box.width - 24 : mouseX < 24 ? 0 : mouseX;

    setPosition({ top, left });
  };

  return (
    <div className="relative group p-6 z-10" onMouseMove={handleMouseMove}>
      {/* <button
        className="absolute bg-blue-500 text-white px-2 py-1 rounded"
        style={{ top: position.top, left: position.left }}
      >
        Suivez-moi
      </button> */}
      <Handle
        id="source"
        type="source"
        position={Position.Right}
        className={cn(
          "bg-transparent w-full h-full absolute top-0 left-0 translate-x-0 rounded-none border-0",
          isTarget && "-z-10"
        )}
      />
      <div
        className="relative w-32 h-32 bg-yellow-100"
        style={{ backgroundColor: color ? color : "" }}
      >
        <Handle
          id="target"
          type="target"
          position={Position.Right}
          className={cn(
            "bg-transparent -z-10 w-full h-full absolute top-0 left-0 translate-x-0 rounded-none border-0",
            isTarget && "z-10"
          )}
        />

        <div className="relative w-full h-full">{children}</div>
      </div>
    </div>
  );
};

export default BaseCard;
