import { NodeProps, useReactFlow } from "@xyflow/react";
import React, { useEffect, useRef } from "react";
import BaseCard from "./baseCard";
import CardHeader from "../ui/cardHeader";
import Calendar from "react-calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Value } from "node_modules/react-calendar/dist/esm/shared/types";
import "react-calendar/dist/Calendar.css";
import { getDateParts } from "@/lib/utils";

type EventCardProps = {
  title: string;
  date?: Value;
};

const EventCard: React.FC<NodeProps & EventCardProps> = (props) => {
  const { id, data } = props;
  const { title, date } = data as EventCardProps;
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const { updateNode } = useReactFlow();

  useEffect(() => {
    setTimeout(() => titleRef.current?.focus(), 10);
  }, []);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [title]);

  const { dayNumber, dayName, monthName, year } = getDateParts(date);

  return (
    <BaseCard {...props}>
      <div className="w-56 flex flex-col bg-background rounded overflow-hidden shadow-lg">
        <CardHeader color="bg-red-100" />
        <div className="p-2 flex-grow flex flex-col gap-2 bg-red-100/20">
          <textarea
            id="name"
            ref={titleRef}
            value={title}
            onChange={(e) => {
              updateNode(id, {
                data: { ...data, title: e.target.value },
              });
            }}
            className="w-full border-b focus:outline-none p-1 text-xl font-bold resize-none overflow-hidden rounded"
            rows={1}
          />
          <Popover>
            <PopoverTrigger>
              <div className="flex flex-col items-center gap-2 p-2 bg-background rounded-lg border shadow cursor-pointer overflow-hidden">
                {date ? (
                  <>
                    <div className="flex justify-center gap-1 w-full font-semibold">
                      <span className="text-xl">{monthName}</span>
                      <span className="text-xl">{year}</span>
                    </div>
                    <div className="text-5xl font-bold">{dayNumber}</div>
                    <span className="text-xl">{dayName}</span>
                  </>
                ) : (
                  <div className="text-sm">Sélectionnez une date</div>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                value={date}
                onChange={(newDate) =>
                  updateNode(id, { data: { ...data, date: newDate } })
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </BaseCard>
  );
};

export default EventCard;
