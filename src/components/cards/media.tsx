import { NodeProps } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

const MediaCard: React.FC<NodeProps> = ({ id }) => {
  return (
    <BaseCard id={id} color="rgb(237 233 254)">
      Media
    </BaseCard>
  );
};

export default MediaCard;
