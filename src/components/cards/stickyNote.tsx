import { cn } from "@/lib/utils";
import { Handle, NodeProps, Position, useConnection } from "@xyflow/react";
import React from "react";

const StickyNote: React.FC<NodeProps> = ({ id }) => {
  const connection = useConnection();
  const connectionInProgress = connection.inProgress;
  const isTarget = connectionInProgress && connection.fromNode.id !== id;

  return (
    <div className="relative group p-6">
      <div className="relative w-32 h-32 bg-yellow-100">
        <Handle
          id="target"
          type="target"
          position={Position.Right}
          className={cn(
            "bg-transparent w-full h-full absolute top-0 left-0 translate-x-0 rounded-none border-0",
            isTarget && "z-20"
          )}
        ></Handle>
        <div>
          <div className="h-full w-6 absolute top-0 right-0 translate-x-full">
            <Handle
              id="source-right"
              type="source"
              position={Position.Right}
              className={cn(
                "invisible w-6 h-6 bg-primary text-primary-foreground border-2 -translate-y-1/2 -translate-x-full group-hover:translate-x-0 top-1/2 flex justify-center items-center",
                !connectionInProgress && "group-hover:visible"
              )}
            >
              +
            </Handle>
          </div>
          <div className="h-full w-6 absolute top-0 left-0 -translate-x-full">
            <Handle
              id="source-left"
              type="source"
              position={Position.Left}
              className={cn(
                "invisible w-6 h-6 bg-primary text-primary-foreground border-2 -translate-y-1/2 translate-x-full group-hover:translate-x-0 top-1/2 flex justify-center items-center",
                !connectionInProgress && "group-hover:visible"
              )}
            >
              +
            </Handle>
          </div>
          <div className="w-full h-6 absolute top-0 left-0 -translate-y-full">
            <Handle
              id="source-top"
              type="source"
              position={Position.Top}
              className={cn(
                "invisible w-6 h-6 bg-primary text-primary-foreground border-2 -translate-x-1/2 translate-y-full group-hover:translate-y-0 left-1/2 flex justify-center items-center",
                !connectionInProgress && "group-hover:visible"
              )}
            >
              +
            </Handle>
          </div>
          <div className="w-full h-6 absolute bottom-0 left-0 translate-y-full">
            <Handle
              id="source-bottom"
              type="source"
              position={Position.Bottom}
              className={cn(
                "invisible w-6 h-6 bg-primary text-primary-foreground border-2 -translate-x-1/2 -translate-y-full group-hover:translate-y-0 left-1/2 flex justify-center items-center",
                !connectionInProgress && "group-hover:visible"
              )}
            >
              +
            </Handle>
          </div>
        </div>
        <div className="relative w-full h-full">Notes</div>
      </div>
    </div>
  );
};

export default StickyNote;
