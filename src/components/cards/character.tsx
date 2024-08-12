import { NodeProps } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

const CharacterCard: React.FC<NodeProps> = (props) => {
  return (
    <BaseCard {...props} color="rgb(219 234 254)">
      character
    </BaseCard>
  );
};

export default CharacterCard;
