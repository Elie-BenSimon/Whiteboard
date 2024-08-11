import { NodeProps } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

const CharacterCard: React.FC<NodeProps> = ({ id }) => {
  return (
    <BaseCard id={id} color="rgb(219 234 254)">
      character
    </BaseCard>
  );
};

export default CharacterCard;
