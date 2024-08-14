import { Node, useReactFlow } from "@xyflow/react";
import React, { useState, useRef, useEffect } from "react";
import BaseCard from "./baseCard";
import Icon from "../ui/icon";

type CharacterCardProps = {
  title: string;
};

const CharacterCard: React.FC<Node<CharacterCardProps>> = (props) => {
  const { id, data } = props;
  const [image, setImage] = useState<string | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { updateNode } = useReactFlow();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [props.data.title]);

  return (
    <BaseCard {...props}>
      <div className="w-72 h-48 flex flex-col bg-background rounded overflow-hidden">
        <div className="bg-blue-100 p-1 h-6"></div>
        <div className="bg-blue-100/20 h-full">
          <div className="flex gap-2 p-2">
            <div className="relative w-28 h-28 rounded-lg border-2 bg-card overflow-hidden flex-shrink-0 shadow">
              {image ? (
                <img
                  src={image}
                  alt="Character"
                  className="absolute inset-0 object-cover w-full h-full"
                />
              ) : (
                <Icon name="Smile" size={"100%"} />
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageChange}
              />
            </div>
            <div className="flex flex-col flex-grow">
              <label htmlFor="name" className="text-xs text-muted-foreground">
                name
              </label>
              <textarea
                id="name"
                ref={textAreaRef}
                value={props.data.title}
                onChange={(e) => {
                  updateNode(id, { data: { ...data, title: e.target.value } });
                }}
                className="w-full border-b focus:outline-none px-1 resize-none overflow-hidden rounded-sm"
                rows={1}
              />
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default CharacterCard;
