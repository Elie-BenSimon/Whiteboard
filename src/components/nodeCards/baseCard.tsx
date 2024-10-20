import { cn } from "@/lib/utils";
import { Handle, Position, NodeProps } from "@xyflow/react";
import React from "react";

type BaseCardProps = {
  children: React.ReactNode;
};

const BaseCard: React.FC<BaseCardProps & NodeProps> = (props) => {
  const { children, selected } = props;

  return (
    <div
      className={cn(
        "rounded transition-transform p-1",
        selected && "border-dance animate-border-dance scale-105"
      )}
    >
      <div className="relative rounded overflow-hidden border-2 border-[#17171f] transition-all duration-75 ease-cubic shadow-md">
        <Handle
          id="target"
          type="target"
          position={Position.Top}
          className="bg-transparent w-full h-full absolute top-0 left-0 translate-x-0 rounded-none border-0"
        />
        <Handle
          id="source"
          type="source"
          position={Position.Bottom}
          className="bg-transparent w-full h-full absolute top-0 left-0 translate-x-0 rounded-none border-0"
        />
        <div className="relative w-fit h-full shadow-lg">{children}</div>
      </div>
    </div>
  );
};

export default BaseCard;
