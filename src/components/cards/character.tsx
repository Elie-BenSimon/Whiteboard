import { Node } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

const CharacterCard: React.FC<Node> = (props) => {
  return <BaseCard {...props}>character</BaseCard>;
};

export default CharacterCard;
