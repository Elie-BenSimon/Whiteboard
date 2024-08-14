import { Node } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

type LocationCardProps = {
  title: string;
};

const LocationCard: React.FC<Node<LocationCardProps>> = (props) => {
  return <BaseCard {...props}>location</BaseCard>;
};

export default LocationCard;
