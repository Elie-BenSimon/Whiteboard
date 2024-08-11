import { NodeProps } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

const LocationCard: React.FC<NodeProps> = ({ id }) => {
  return (
    <BaseCard id={id} color="rgb(220 252 231)">
      location
    </BaseCard>
  );
};

export default LocationCard;
