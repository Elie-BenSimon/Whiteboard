import { Node } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

type MediaCardProps = {
  title: string;
};

const MediaCard: React.FC<Node<MediaCardProps>> = (props) => {
  return <BaseCard {...props}>Media</BaseCard>;
};

export default MediaCard;
