import { Node } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

type ChoicesCardProps = {
  title: string;
};
const ChoicesCard: React.FC<Node<ChoicesCardProps>> = (props) => {
  return <BaseCard {...props}>choices</BaseCard>;
};

export default ChoicesCard;
