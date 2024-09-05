import { NodeProps } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";

type MediaCardProps = {
  title: string;
};

const MediaCard: React.FC<NodeProps & MediaCardProps> = (props) => {
  return <BaseCard {...props}>Media</BaseCard>;
};

export default MediaCard;
