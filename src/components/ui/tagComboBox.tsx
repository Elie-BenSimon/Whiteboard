import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useState } from "react";
import Icon from "./icon";
import { TagData } from "./tag";

type TagComboboxProps = {
  addTag: (tagId: string) => void;
  tagsList: TagData[];
  addTagType: (tagTitle: string) => void;
  selectedTags: string[];
  removeTag: (tagId: string) => void;
};

const TagCombobox: React.FC<TagComboboxProps> = ({
  addTag,
  tagsList,
  addTagType,
  selectedTags,
  removeTag,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const tagExists = tagsList.some((tag) => tag.title === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div>
          <button className="bg-blue-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-sm border hover:opacity-90 hover:-translate-y-[1px] hover:shadow transition-all">
            +
          </button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 prevent-source-node">
        <Command>
          <CommandInput
            value={value}
            onValueChange={(newValue) => setValue(newValue)}
            placeholder="Search or create a tag..."
            className="h-9"
          />
          <CommandList>
            {!tagExists && value.trim() && (
              <CommandEmpty className="p-2">
                <Button
                  className="w-full"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addTagType(value);
                      setValue("");
                    }
                  }}
                  onClick={() => {
                    addTagType(value);
                    setValue("");
                  }}
                >
                  Créer: {value}
                </Button>
              </CommandEmpty>
            )}
            <CommandGroup>
              {tagsList.map((tag) => (
                <CommandItem
                  key={tag.id}
                  value={tag.id}
                  className="cursor-pointer"
                  onSelect={(currentValue) => {
                    setValue("");
                    if (selectedTags.includes(currentValue)) {
                      removeTag(currentValue);
                    } else {
                      addTag(currentValue);
                    }
                  }}
                >
                  {tag.title}
                  <Icon
                    name="Check"
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedTags.includes(tag.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TagCombobox;
