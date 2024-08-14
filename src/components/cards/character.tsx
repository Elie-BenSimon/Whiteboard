import { Node } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

type CharacterCardProps = {
  title: string;
};

const CharacterCard: React.FC<Node<CharacterCardProps>> = (props) => {
  return <BaseCard {...props}>character</BaseCard>;
};

export default CharacterCard;
