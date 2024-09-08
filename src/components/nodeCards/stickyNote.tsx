import { NodeProps, useReactFlow } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";
import CardHeader from "../ui/cardHeader";
import AutoFitTextArea from "../ui/autoFitTextArea";
import { cn } from "@/lib/utils";

type StickyNoteProps = {
  title: string;
  description?: string;
};

const StickyNote: React.FC<NodeProps & StickyNoteProps> = (props) => {
  const { id, data } = props;
  const { title, description } = data as StickyNoteProps;
  const { updateNode } = useReactFlow();

  return (
    <BaseCard {...props}>
      <div className="bg-background">
        <CardHeader color="bg-yellow-100" />
        <div className="min-h-[168px] w-48 p-4 bg-yellow-100/30 flex flex-col items-center justify-center border-t border-white rounded">
          <AutoFitTextArea
            autofocus
            placeholder="nouvelle note"
            value={title}
            onChange={(newValue) => {
              updateNode(id, { data: { ...data, title: newValue } });
            }}
            className={cn(
              "nodrag text-center text-lg font-bold mb-1",
              !title && "border-b"
            )}
          />
          <AutoFitTextArea
            value={description ?? ""}
            onChange={(newValue) => {
              updateNode(id, {
                data: { ...data, description: newValue },
              });
            }}
            className="nodrag text-center"
          />
        </div>
      </div>
    </BaseCard>
  );
};

export default StickyNote;
