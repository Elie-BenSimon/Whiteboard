import CardsMenuItem from "./cardsMenuItem";

const CardsMenu = () => {
  return (
    <div className="flex gap-2 border rounded bg-card p-2">
      <CardsMenuItem
        nodeType="stickyNote"
        icon="CaseSensitive"
        color="bg-yellow-100"
      />
      <CardsMenuItem nodeType="character" icon="Smile" color="bg-blue-100" />
      <CardsMenuItem nodeType="location" icon="House" color="bg-green-100" />
      <CardsMenuItem nodeType="event" icon="CalendarDays" color="bg-red-100" />
      <CardsMenuItem nodeType="choices" icon="Network" color="bg-teal-100" />
      <CardsMenuItem nodeType="media" icon="Image" color="bg-violet-100" />
    </div>
  );
};

export default CardsMenu;
