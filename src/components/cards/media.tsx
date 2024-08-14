import { Node } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

const MediaCard: React.FC<Node> = (props) => {
  return <BaseCard {...props}>Media</BaseCard>;
};

export default MediaCard;
