import { NodeProps } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

const MediaCard: React.FC<NodeProps> = (props) => {
  return (
    <BaseCard {...props} color="rgb(237 233 254)">
      Media
    </BaseCard>
  );
};

export default MediaCard;
