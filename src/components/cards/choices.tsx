import { NodeProps } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

const ChoicesCard: React.FC<NodeProps> = (props) => {
  return (
    <BaseCard {...props} color="rgb(204 251 241)">
      choices
    </BaseCard>
  );
};

export default ChoicesCard;
