import { NodeProps } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

const StickyNote: React.FC<NodeProps> = (props) => {
  return (
    <BaseCard {...props} color="rgb(254 249 195)">
      note
    </BaseCard>
  );
};

export default StickyNote;
