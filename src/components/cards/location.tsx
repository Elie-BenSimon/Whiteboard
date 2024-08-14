import { Node } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

const LocationCard: React.FC<Node> = (props) => {
  return <BaseCard {...props}>location</BaseCard>;
};

export default LocationCard;
