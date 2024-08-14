import { Node } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

const ChoicesCard: React.FC<Node> = (props) => {
  return <BaseCard {...props}>choices</BaseCard>;
};

export default ChoicesCard;
