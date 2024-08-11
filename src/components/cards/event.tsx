import { NodeProps } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

const EventCard: React.FC<NodeProps> = ({ id }) => {
  return (
    <BaseCard id={id} color="rgb(254 226 226)">
      event
    </BaseCard>
  );
};

export default EventCard;
