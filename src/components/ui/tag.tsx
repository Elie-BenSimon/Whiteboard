import { cn } from "@/lib/utils";
import React from "react";

export type TagData = {
  id: string;
  title: string;
  color: string;
};

type TagProps = TagData & {
  removeTag: (tag: string) => void;
};

const Tag: React.FC<TagProps> = ({ id, title, color, removeTag }) => {
  return (
    <span
      className={cn(
        "border h-4 rounded-lg pr-0.5 pl-1.5 text-[8px] inline-flex gap-0.5 items-center align-middle hover:opacity-90 hover:-translate-y-[1px] hover:shadow transition-all",
        color
      )}
    >
      {title}
      <button
        onClick={() => removeTag(id)}
        className="h-3 w-3 items-center rounded-full hover:bg-white/60"
      >
        x
      </button>
    </span>
  );
};

export default Tag;
