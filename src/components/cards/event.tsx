import { Node } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

type EventCardProps = {
  title: string;
};
const EventCard: React.FC<Node<EventCardProps>> = (props) => {
  return <BaseCard {...props}>event</BaseCard>;
};

export default EventCard;
