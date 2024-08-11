import { NodeProps } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

const StickyNote: React.FC<NodeProps> = ({ id }) => {
  return <BaseCard id={id}>note</BaseCard>;
};

export default StickyNote;
