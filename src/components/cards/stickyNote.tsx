import { Node, useReactFlow } from "@xyflow/react";
import React, { useEffect, useRef, useState } from "react";
import BaseCard from "./baseCard";
import { cn } from "@/lib/utils";

type StickyNoteProps = {
  title: string;
  description?: string;
};

const StickyNote: React.FC<Node<StickyNoteProps>> = (props) => {
  const { id, data } = props;
  const { updateNode } = useReactFlow();
  const [isEditingTitle, setIsEditingTitle] = useState(true);
  const [isDescriptionEditable, setIsDescriptionEditable] = useState(
    !!data.description
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize for the textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [data.description]);

  useEffect(() => {
    if (inputRef.current && isEditingTitle) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isEditingTitle]);

  const handleTitleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (data.title.length && e.key === "Enter") {
      setIsEditingTitle(false);
      setIsDescriptionEditable(true);
      setTimeout(() => {
        if (textareaRef.current && !textareaRef.current.value) {
          textareaRef.current?.focus();
        }
      }, 0);
    }
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleReturnInEmptyTextarea = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Backspace" && !data.description) {
      setIsDescriptionEditable(false);
      setIsEditingTitle(true);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <BaseCard {...props}>
      <div className="min-h-48 w-48 p-4 bg-yellow-100 flex flex-col items-center justify-center">
        {isEditingTitle ? (
          <input
            ref={inputRef}
            className={cn(
              "nodrag h-auto focus:outline-none text-center text-lg font-bold mb-2 bg-transparent w-full overflow-hidden",
              !data.title.length && "border-b border-accent-foreground"
            )}
            value={data.title}
            onChange={(e) => {
              updateNode(id, { data: { ...data, title: e.target.value } });
            }}
            onKeyDown={handleTitleSubmit}
            maxLength={30}
            onBlur={() => {
              if (data.title.length) setIsEditingTitle(false);
            }}
          />
        ) : (
          <div
            className="w-full text-center text-lg font-bold mb-2 cursor-text overflow-hidden truncate"
            onClick={handleTitleClick}
          >
            {data.title}
          </div>
        )}
        {isDescriptionEditable && (
          <textarea
            ref={textareaRef}
            className="nodrag h-auto focus:outline-none text-center resize-none overflow-hidden w-full bg-transparent"
            value={data.description || ""}
            onChange={(e) => {
              updateNode(id, {
                data: { ...data, description: e.target.value },
              });
            }}
            rows={1}
            onKeyDown={handleReturnInEmptyTextarea}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
            maxLength={300}
          />
        )}
      </div>
    </BaseCard>
  );
};

export default StickyNote;
