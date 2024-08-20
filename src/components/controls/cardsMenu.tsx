import Icon from "../ui/icon";

const CardsMenu = () => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex gap-2 border rounded bg-card p-2">
      <div
        className="cursor-grab w-11 h-11 rounded bg-yellow-100 flex justify-center items-center"
        onDragStart={(event) => onDragStart(event, "stickyNote")}
        draggable
      >
        <Icon name="CaseSensitive" />
      </div>
      <div
        className="cursor-grab w-11 h-11 rounded bg-blue-100 flex items-center justify-center"
        onDragStart={(event) => onDragStart(event, "character")}
        draggable
      >
        <Icon name="Smile" />
      </div>
      <div
        className="cursor-grab w-11 h-11 rounded-sm bg-green-100 flex items-center justify-center"
        onDragStart={(event) => onDragStart(event, "location")}
        draggable
      >
        <Icon name="House" />
      </div>
      <div
        className="cursor-grab w-11 h-11 rounded-sm bg-red-100 flex items-center justify-center"
        onDragStart={(event) => onDragStart(event, "event")}
        draggable
      >
        <Icon name="CalendarDays" />
      </div>
      <div
        className="cursor-grab w-11 h-11 rounded-sm bg-teal-100 flex items-center justify-center"
        onDragStart={(event) => onDragStart(event, "choices")}
        draggable
      >
        <Icon name="Network" />
      </div>
      <div
        className="cursor-grab w-11 h-11 rounded-sm bg-violet-100 flex items-center justify-center"
        onDragStart={(event) => onDragStart(event, "media")}
        draggable
      >
        <Icon name="Image" />
      </div>
    </div>
  );
};

export default CardsMenu;
