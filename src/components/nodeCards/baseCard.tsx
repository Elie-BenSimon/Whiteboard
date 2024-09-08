import { useWhiteBoardContext } from "@/hooks/useWhiteBoardContext";
import { cn } from "@/lib/utils";
import { Handle, Position, NodeProps } from "@xyflow/react";
import React from "react";

type BaseCardProps = {
  children: React.ReactNode;
};

const BaseCard: React.FC<BaseCardProps & NodeProps> = (props) => {
  const { id, children, selected } = props;
  const { onCardClick, sourceNode, setMousePosition } = useWhiteBoardContext();
  const isSourceNode = sourceNode?.id === id;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (sourceNode === null) {
      let targetElement = e.target as Element;
      while (
        targetElement &&
        !["BUTTON", "INPUT", "TEXTAREA"].includes(targetElement.tagName) &&
        !targetElement.classList.contains("prevent-source-node")
      ) {
        targetElement = targetElement.parentElement as Element;
      }

      if (
        targetElement &&
        (["BUTTON", "INPUT", "TEXTAREA"].includes(targetElement.tagName) ||
          targetElement.classList.contains("prevent-source-node"))
      ) {
        return;
      }
    }
    setMousePosition({ x: e.clientX, y: e.clientY });
    onCardClick(props);
  };

  return (
    <div
      className={cn(
        "rounded transition-transform p-1",
        isSourceNode && "border-dance animate-border-dance",
        selected ? "scale-[105%] hover:scale-[106%]" : "hover:scale-[101%]"
      )}
    >
      <div
        className={cn(
          "relative shadow rounded border-2 border-[#17171f] transition-all duration-75 ease-cubic",
          selected
            ? "shadow-card-selected hover:shadow-card-selected-hover"
            : "shadow-md-plus hover:shadow-card-hover"
        )}
        onClick={handleCardClick}
      >
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
