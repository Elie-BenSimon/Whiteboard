import { NodeProps, useReactFlow } from "@xyflow/react";
import React from "react";
import BaseCard from "./baseCard";
import CardHeader from "../ui/cardHeader";
import Calendar from "react-calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Value } from "node_modules/react-calendar/dist/esm/shared/types";
import "react-calendar/dist/Calendar.css";
import { getDateParts } from "@/lib/utils";
import AutoFitTextArea from "../ui/autoFitTextArea";

type EventCardProps = {
  title: string;
  date?: Value;
};

const EventCard: React.FC<NodeProps & EventCardProps> = (props) => {
  const { id, data } = props;
  const { title, date } = data as EventCardProps;
  const { updateNode } = useReactFlow();

  const { dayNumber, dayName, monthName, year } = getDateParts(date);

  return (
    <BaseCard {...props}>
      <div className="w-56 flex flex-col bg-background rounded overflow-hidden">
        <CardHeader color="bg-red-100" />
        <div className="p-2 flex-grow flex flex-col gap-2 bg-red-100/20">
          <AutoFitTextArea
            autofocus
            value={title}
            className="p-1 text-xl font-bold rounded bg-background border-b"
            onChange={(newValue) => {
              updateNode(id, {
                data: { ...data, title: newValue },
              });
            }}
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
