import { NodeProps } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

const EventCard: React.FC<NodeProps> = (props) => {
  return (
    <BaseCard {...props} color="rgb(254 226 226)">
      event
    </BaseCard>
  );
};

export default EventCard;
