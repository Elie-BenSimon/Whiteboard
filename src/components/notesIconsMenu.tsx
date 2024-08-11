const NotesIconsMenu = () => {
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
        className="cursor-grab w-11 h-11 rounded bg-yellow-100"
        onDragStart={(event) => onDragStart(event, "stickyNote")}
        draggable
      />
      <div className="w-11 h-11 rounded-full bg-blue-400" />
      <div className="w-11 h-11 rounded-full bg-blue-400" />
      <div className="w-11 h-11 rounded-full bg-blue-400" />
      <div className="w-11 h-11 rounded-full bg-blue-400" />
    </div>
  );
};

export default NotesIconsMenu;
