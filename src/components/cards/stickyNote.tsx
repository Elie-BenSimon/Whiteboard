import { Node, useReactFlow } from "@xyflow/react";
import React, { useEffect, useRef, useState } from "react";
import BaseCard from "./baseCard";
import { cn } from "@/lib/utils";
import CardHeader from "../ui/cardHeader";

type StickyNoteProps = {
  title: string;
  description?: string;
};

const StickyNote: React.FC<Node<StickyNoteProps>> = (props) => {
  const { id, data } = props;
  const { updateNode } = useReactFlow();
  const [isDescriptionEditable, setIsDescriptionEditable] = useState(
    !!data.description
  );
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [data.description]);

  useEffect(() => {
    setTimeout(() => titleRef.current?.focus(), 10);
  }, []);

  const handleTitleSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (data.title.length && e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
      setIsDescriptionEditable(true);
      setTimeout(() => {
        if (textareaRef.current && !textareaRef.current.value) {
          textareaRef.current?.focus();
        }
      }, 0);
    }
  };

  const handleReturnInEmptyTextarea = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Backspace" && !data.description) {
      setIsDescriptionEditable(false);
      if (titleRef.current) {
        titleRef.current.focus();
      }
    }
  };

  return (
    <BaseCard {...props}>
      <div className="bg-background">
        <CardHeader color="bg-yellow-100" />
        <div className="min-h-[168px] w-48 p-4 bg-yellow-100/30 flex flex-col items-center justify-center border-t border-white rounded">
          <textarea
            ref={titleRef}
            className={cn(
              "nodrag h-auto focus:outline-none text-center text-lg font-bold mb-2 bg-transparent w-full overflow-hidden resize-none",
              !data.title.length && "border-b border-accent-foreground"
            )}
            value={data.title}
            onChange={(e) => {
              updateNode(id, { data: { ...data, title: e.target.value } });
            }}
            onKeyDown={handleTitleSubmit}
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
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
            />
          )}
        </div>
      </div>
    </BaseCard>
  );
};

export default StickyNote;
