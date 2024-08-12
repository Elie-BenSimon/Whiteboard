import { NodeProps } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

const LocationCard: React.FC<NodeProps> = (props) => {
  return (
    <BaseCard {...props} color="rgb(220 252 231)">
      location
    </BaseCard>
  );
};

export default LocationCard;
