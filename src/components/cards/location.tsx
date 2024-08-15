import { Node } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";
import CardHeader from "../ui/cardHeader";
import backgroundImage from "/location.webp";

type LocationCardProps = {
  title: string;
};

const LocationCard: React.FC<Node<LocationCardProps>> = (props) => {
  return (
    <BaseCard {...props}>
      <div className="w-80 flex flex-col bg-background rounded overflow-hidden">
        <CardHeader color="bg-green-100" />
        <div className="bg-green-100/20 flex-grow">
          <div className="flex gap-2 p-2 h-full">
            <div className="relative h-48 w-full rounded-lg background-cover bg-cover p-6 flex flex-col justify-between">
              <img
                src={backgroundImage}
                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg border-2 border-white opacity-30"
              />
              <div className="relative text-3xl font-bold">Test</div>
              <div className="relative w-48 h-48">carte</div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default LocationCard;
