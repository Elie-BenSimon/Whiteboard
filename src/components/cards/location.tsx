import { NodeProps, useReactFlow } from "@xyflow/react";
import React, { useState, useRef, useEffect } from "react";
import BaseCard from "./baseCard";
import CardHeader from "../ui/cardHeader";
import { cn } from "@/lib/utils";

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
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
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

  useEffect(() => {
    setTimeout(() => titleRef.current?.focus(), 10);
  }, []);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [title]);

  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.height = "auto";
      descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
    }
  }, [description]);

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
            <textarea
              ref={titleRef}
              value={title}
              onChange={(e) =>
                updateNode(id, { data: { ...data, title: e.target.value } })
              }
              className={cn(
                "bg-transparent p-1 text-2xl font-bold border-0 focus:outline-none resize-none w-full overflow-hidden",
                !title.length && "border-b border-accent-foreground"
              )}
              rows={1}
            />
            <textarea
              ref={descriptionRef}
              value={description || ""}
              onChange={(e) =>
                updateNode(id, {
                  data: { ...data, description: e.target.value },
                })
              }
              className="bg-transparent p-1 w-full h-full flex-grow border-0 focus:outline-none resize-none text-xs"
              rows={1}
            />
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default LocationCard;
