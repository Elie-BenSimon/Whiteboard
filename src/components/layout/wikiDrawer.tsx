import { useState, useRef, useEffect } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import WikiCard from "../ui/wikiCard";
import Icon from "../ui/icon";
import { cn } from "@/lib/utils";
import { useWhiteBoardContext } from "@/hooks/useWhiteBoardContext";
import { useReactFlow } from "@xyflow/react";
import AutoFitTextArea from "../ui/autoFitTextArea";

const HANDLE_WIDTH = 60;

const WikiDrawer = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startDragX, setStartDragX] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [wikiWidth, setWikiWidth] = useState(0);
  const [drawerWidth, setDrawerWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const wikiContainerRef = useRef<HTMLDivElement>(null);
  const { wikiSelectedNodes, setWikiSelectedNodesId } = useWhiteBoardContext();
  const selectedNodesLength = wikiSelectedNodes.length;
  const { updateNode } = useReactFlow();

  useEffect(() => {
    setPosition({ x: wikiWidth - HANDLE_WIDTH, y: 0 });
  }, [wikiWidth]);

  useEffect(() => {
    if (wikiContainerRef.current) {
      setWikiWidth(wikiContainerRef.current.offsetWidth);
    }
  }, [wikiContainerRef, wikiContainerRef.current?.parentElement?.offsetWidth]);

  const handleDragStop = (_: DraggableEvent, data: DraggableData) => {
    const deltaX = data.x - startDragX;
    let newX;
    if (deltaX === 0) {
      newX =
        position.x !== wikiWidth - HANDLE_WIDTH ? wikiWidth - HANDLE_WIDTH : 0;
    } else {
      const lastDeltaX = Math.abs(lastX - data.x);
      newX =
        lastDeltaX < 5 ? data.x : data.x > lastX ? wikiWidth - HANDLE_WIDTH : 0;
    }
    setPosition({ x: newX, y: 0 });
    setDrawerWidth(wikiWidth - newX);
    setIsDragging(false);
  };

  const wikiTitle =
    "Wiki" +
    (selectedNodesLength > 0
      ? " - " +
        (selectedNodesLength === 1
          ? wikiSelectedNodes[0].data.title
          : `${selectedNodesLength} cartes selectionnées`)
      : "");

  const wikiDescription =
    selectedNodesLength > 0
      ? selectedNodesLength === 1
        ? wikiSelectedNodes[0].data.description
        : ""
      : "Sélectionnez une ou plusieurs note pour voir leur informations plus en détails ici";

  return (
    <div
      ref={wikiContainerRef}
      className="absolute right-0 z-10 w-4/5 h-full pointer-events-none"
    >
      <Draggable
        axis="x"
        bounds={{ left: 0, right: wikiWidth - HANDLE_WIDTH }}
        position={position}
        onStop={handleDragStop}
        onDrag={(_, data) => {
          setTimeout(() => setLastX(data.x), 25);
          setDrawerWidth(wikiWidth - data.x);
        }}
        onStart={(_, data) => {
          setStartDragX(data.x);
          setIsDragging(true);
        }}
        handle=".handle"
      >
        <div className="flex bg-muted pointer-events-auto h-full shadow-2xl">
          <div
            className={cn(
              "handle h-full p-1 bg-[#50648e] border-x border-[#17171f] text-slate-300 hover:text-slate-100 transition-colors duration-200 shadow-inner cursor-pointer",
              isDragging && "cursor-grabbing"
            )}
            style={{ width: HANDLE_WIDTH }}
          >
            <div className="relative h-full group flex flex-col items-center justify-center bg-[#5d73a1a3] border-[#17171f] rounded-lg shadow-inner">
              <p
                className={cn(
                  "absolute bottom-16 -rotate-90 whitespace-nowrap font-semibold text-xl text-slate-400 group-hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-500",
                  isDragging && "!opacity-0"
                )}
              >
                Drag or click
              </p>
              <div className="py-8 rounded bg-[#17171f35] group-hover:bg-[#17171f3e] transition-colors duration-200 shadow-inner">
                <Icon name={"GripVertical"} size={38} />
              </div>
            </div>
          </div>
          <div className="overflow-y-scroll">
            <div
              className="flex flex-wrap p-4 pr-20 gap-4"
              style={{ width: drawerWidth }}
            >
              <h1 className="w-full text-3xl font-bold">{wikiTitle}</h1>
              {wikiSelectedNodes &&
                selectedNodesLength > 1 &&
                wikiSelectedNodes.map((node) => (
                  <WikiCard
                    title={String(node.data.title ?? "")}
                    description={String(node.data.description ?? "")}
                    handleClick={() => setWikiSelectedNodesId([node.id])}
                  />
                ))}

              <AutoFitTextArea
                value={String(wikiDescription ?? "")}
                className="text-sm"
                onChange={(newValue) => {
                  const selectedNode = wikiSelectedNodes[0];
                  updateNode(selectedNode.id, {
                    data: {
                      ...selectedNode.data,
                      description: newValue,
                    },
                  });
                }}
              />
              <WikiCard
                title="title"
                description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam reiciendis aliquam numquam enim. Sequi consequatur, itaque voluptatem sed corrupti optio. Sed commodi quidem similique, adipisci atque et possimus exercitationem quisquam magnam explicabo reiciendis iure. Exercitationem necessitatibus nam ratione, quis voluptatum, similique sapiente impedit facere ipsam, hic cumque ullam eos officiis at ipsa! Nisi facere officiis cumque commodi quasi omnis enim aliquam molestias earum assumenda, amet sint voluptatem quam asperiores quae odit. Quisquam libero consequuntur fugiat expedita obcaecati officiis aliquid ea quibusdam, amet rem, numquam neque enim unde nisi a animi natus voluptas aperiam quae! Et quaerat iste ad quisquam nesciunt?"
              />
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default WikiDrawer;
