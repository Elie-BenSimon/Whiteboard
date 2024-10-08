import { NodeProps, useReactFlow } from "@xyflow/react";
import React, { useState } from "react";
import BaseCard from "./baseCard";
import Icon from "../ui/icon";
import Tag, { TagData } from "../ui/tag";
import TagCombobox from "../ui/tagComboBox";
import { getRandomColor200 } from "@/lib/utils";
import { v4 as uuidV4 } from "uuid";
import CardHeader from "../ui/cardHeader";
import AutoFitTextArea from "../ui/autoFitTextArea";

type CharacterCardProps = {
  title: string;
  description?: string;
  tagsList?: TagData[];
  image?: string;
};

const CharacterCard: React.FC<NodeProps & CharacterCardProps> = (props) => {
  const { id, data } = props;
  const {
    title,
    description,
    tagsList,
    image: characterImage,
  } = data as CharacterCardProps;
  const [image, setImage] = useState<string | null>(characterImage ?? null);
  const { updateNode } = useReactFlow();

  const [tagTypes, setTagTypes] = useState<TagData[]>([
    { id: "gentil", title: "Gentil", color: "bg-blue-200" },
    { id: "malin", title: "Malin", color: "bg-red-200" },
    { id: "honnête", title: "Honnête", color: "bg-green-200" },
    { id: "méchant", title: "Méchant", color: "bg-yellow-200" },
    { id: "mystérieux", title: "Mystérieux", color: "bg-purple-200" },
    { id: "débile", title: "Débile", color: "bg-pink-200" },
    { id: "énergique", title: "Énergique", color: "bg-indigo-200" },
    { id: "agile", title: "Agile", color: "bg-teal-200" },
    { id: "rapide", title: "Rapide", color: "bg-cyan-200" },
  ]);

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

  const addTag = (tagId: string) => {
    const existingTag = tagTypes.find((tag) => tag.id === tagId);
    if (!tagsList?.find((t) => t.id === tagId) && existingTag) {
      const newTags = [...(tagsList ?? []), existingTag];
      updateNode(id, { data: { ...data, tagsList: newTags } });
    }
  };

  const removeTag = (tag: string) => {
    if (tagsList?.find((t) => t.id === tag)) {
      const newTags = tagsList?.filter((t) => t.id !== tag);
      updateNode(id, { data: { ...data, tagsList: newTags } });
    }
  };

  const addTagType = (tag: string) => {
    const newTag = { id: uuidV4(), title: tag, color: getRandomColor200() };
    setTagTypes([...tagTypes, newTag]);
    updateNode(id, {
      data: { ...data, tagsList: [...(tagsList ?? []), newTag] },
    });
  };

  return (
    <BaseCard {...props}>
      <div className="w-72 flex flex-col bg-background rounded overflow-hidden">
        <CardHeader color="bg-blue-100" />
        <div className="bg-blue-100/20 flex-grow">
          <div className="flex gap-2 p-2 h-full">
            <div className="h-full flex flex-col gap-1">
              <div className="relative w-28 h-28 rounded-lg border-2 border-white bg-card overflow-hidden flex-shrink-0 shadow">
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
              <div className="flex flex-grow flex-wrap justify-start items-start gap-0.5 w-28">
                {tagsList?.map((tag) => (
                  <Tag key={tag.id} {...tag} removeTag={removeTag} />
                ))}
                <TagCombobox
                  addTag={addTag}
                  tagsList={tagTypes}
                  addTagType={addTagType}
                  selectedTags={tagsList?.map((t) => t.id) ?? []}
                  removeTag={removeTag}
                />
              </div>
            </div>
            <div className="flex flex-col flex-grow">
              <AutoFitTextArea
                autofocus
                id={id + "-name"}
                label="name"
                value={title}
                className="border-b p-1 rounded-sm font-semibold bg-background"
                onChange={(newValue) => {
                  updateNode(id, {
                    data: { ...data, title: newValue },
                  });
                }}
              />
              <AutoFitTextArea
                id={id + "-description"}
                label="description"
                value={description ?? ""}
                className="border-b p-1 rounded-sm bg-background text-xs flex-grow"
                containerClassName="flex-grow"
                onChange={(newValue) => {
                  updateNode(id, {
                    data: { ...data, description: newValue },
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default CharacterCard;
