import { NodeProps, useReactFlow } from "@xyflow/react";
import React, { useState } from "react";
import BaseCard from "./baseCard";
import CardHeader from "../ui/cardHeader";
import AutoFitTextArea from "../ui/autoFitTextArea";

type StickyNoteProps = {
  title: string;
  description?: string;
};

const StickyNote: React.FC<NodeProps & StickyNoteProps> = (props) => {
  const { id, data } = props;
  const { title, description } = data as StickyNoteProps;
  const { updateNode } = useReactFlow();
  const [isDescriptionEditable, setIsDescriptionEditable] = useState(
    !!data.description
  );
  const titleId = id + "-title";
  const descriptionId = id + "-description";

  const handleTitleSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const titleElement = e.currentTarget;
    const descriptionElement = document.getElementById(
      descriptionId
    ) as HTMLTextAreaElement;
    const isCaretAtEnd =
      titleElement.selectionStart === titleElement.selectionEnd &&
      titleElement.selectionStart === titleElement.value.length;

    if (
      title.length &&
      e.key === "Enter" &&
      isCaretAtEnd &&
      !descriptionElement.value
    ) {
      e.preventDefault();
      e.currentTarget.blur();
      setIsDescriptionEditable(true);
      setTimeout(() => {
        descriptionElement?.focus();
      }, 0);
    }
  };

  const handleReturnInEmptyTextarea = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Backspace" && !data.description) {
      e.preventDefault();
      setIsDescriptionEditable(false);
      const titleElement = document.getElementById(titleId);
      titleElement?.focus();
    }
  };

  return (
    <BaseCard {...props}>
      <div className="bg-background">
        <CardHeader color="bg-yellow-100" />
        <div className="min-h-[168px] w-48 p-4 bg-yellow-100/30 flex flex-col items-center justify-center border-t border-white rounded">
          <AutoFitTextArea
            id={titleId}
            value={title}
            onChange={(newValue) => {
              updateNode(id, { data: { ...data, title: newValue } });
            }}
            onKeyDown={handleTitleSubmit}
            className="nodrag text-center text-lg font-bold"
          />
          {isDescriptionEditable && (
            <AutoFitTextArea
              id={descriptionId}
              value={description ?? ""}
              onChange={(newValue) => {
                updateNode(id, {
                  data: { ...data, description: newValue },
                });
              }}
              onKeyDown={handleReturnInEmptyTextarea}
              className="nodrag text-center"
            />
          )}
        </div>
      </div>
    </BaseCard>
  );
};

export default StickyNote;
