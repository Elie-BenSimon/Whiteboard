import { NodeProps, useReactFlow } from "@xyflow/react";
import React, { useState } from "react";
import BaseCard from "./baseCard";
import CardHeader from "../ui/cardHeader";
import { cn } from "@/lib/utils";
import AutoFitTextArea from "../ui/autoFitTextArea";

type LocationCardProps = {
  title: string;
  description?: string;
  image?: string;
};

const LocationCard: React.FC<NodeProps & LocationCardProps> = (props) => {
  const { id, data } = props;
  const {
    title,
    description,
    image: backgroundImage,
  } = data as LocationCardProps;
  const { updateNode } = useReactFlow();
  const [image, setImage] = useState<string>(
    backgroundImage || "/location.webp"
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        updateNode(id, {
          data: { ...data, image: ev.target?.result as string },
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <BaseCard {...props}>
      <div className="w-56 flex flex-col bg-background rounded overflow-hidden">
        <CardHeader color="bg-green-100" />
        <div className="bg-green-100/20 flex-grow">
          <div className="w-full rounded-lg background-cover bg-cover p-2 flex flex-col gap-2 justify-between">
            <div className="relative">
              <img
                src={image}
                className={cn(
                  "w-full h-full object-cover rounded-lg border-2 border-white shadow",
                  backgroundImage ? "opacity-90" : "opacity-30"
                )}
              />
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageChange}
              />
            </div>
            <AutoFitTextArea
              autofocus
              value={title}
              className={cn(
                "text-2xl font-bold p-1",
                !title.length && "border-b border-accent-foreground"
              )}
              onChange={(newValue) =>
                updateNode(id, { data: { ...data, title: newValue } })
              }
            />
            <AutoFitTextArea
              value={description || ""}
              className="text-xs p-1"
              onChange={(newValue) =>
                updateNode(id, {
                  data: { ...data, description: newValue },
                })
              }
            />
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default LocationCard;
