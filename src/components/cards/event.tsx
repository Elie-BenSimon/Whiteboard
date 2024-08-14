import { Node } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

const EventCard: React.FC<Node> = (props) => {
  return <BaseCard {...props}>event</BaseCard>;
};

export default EventCard;
