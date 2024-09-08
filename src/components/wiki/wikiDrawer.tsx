import { useState, useRef, useEffect } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import WikiCard from "../ui/wikiCard";
import Icon from "../ui/icon";
import { useWhiteBoardContext } from "@/hooks/useWhiteBoardContext";
import { useReactFlow } from "@xyflow/react";
import AutoFitTextArea from "../ui/autoFitTextArea";
import CharacterCard from "./characterCard";
import { cn, getCardTitleName } from "@/lib/utils";
import { Button } from "../ui/button";
import { WIKI_HANDLE_WIDTH } from "@/config/constants";

const WikiDrawer = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startDragX, setStartDragX] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [wikiWidth, setWikiWidth] = useState(0);
  const [drawerWidth, setDrawerWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const wikiContainerRef = useRef<HTMLDivElement>(null);
  const { wikiSelectedNodes, setWikiSelectedNodesId, edges, nodes } =
    useWhiteBoardContext();
  const selectedNodesLength = wikiSelectedNodes.length;
  const { updateNode } = useReactFlow();
  const selectedNode = wikiSelectedNodes[0];
  const handleRef = useRef(null);

  useEffect(() => {
    setPosition({ x: wikiWidth - WIKI_HANDLE_WIDTH, y: 0 });
  }, [wikiWidth]);

  useEffect(() => {
    if (wikiContainerRef.current) {
      setWikiWidth(wikiContainerRef.current.offsetWidth);
    }
  }, [
    wikiContainerRef,
    wikiContainerRef.current?.parentElement?.offsetWidth,
    wikiWidth,
  ]);

  const handleDragStop = (_: DraggableEvent, data: DraggableData) => {
    const deltaX = data.x - startDragX;
    let newX;
    if (deltaX === 0) {
      newX =
        position.x !== wikiWidth - WIKI_HANDLE_WIDTH
          ? wikiWidth - WIKI_HANDLE_WIDTH
          : 0;
    } else {
      const lastDeltaX = Math.abs(lastX - data.x);
      newX =
        lastDeltaX < 5
          ? data.x
          : data.x > lastX
          ? wikiWidth - WIKI_HANDLE_WIDTH
          : 0;
    }
    setPosition({ x: newX, y: 0 });
    setDrawerWidth(wikiWidth - newX - WIKI_HANDLE_WIDTH);
    setIsDragging(false);
  };

  const getCardComponent = (nodeType: string) => {
    switch (nodeType) {
      case "character":
        return <CharacterCard />;
    }
  };

  const linkedNodes =
    selectedNode && selectedNodesLength === 1
      ? edges
          .filter(
            (edge) =>
              edge.source === selectedNode.id || edge.target === selectedNode.id
          )
          .map(
            (link) =>
              nodes.filter(
                (node) =>
                  (node.id === link.target || node.id === link.source) &&
                  node.id !== selectedNode.id
              )[0]
          )
          .filter((item) => !!item)
      : null;

  return (
    <div
      ref={wikiContainerRef}
      className="absolute right-0 z-10 w-4/5 h-full pointer-events-none"
    >
      <Draggable
        nodeRef={handleRef}
        axis="x"
        bounds={{ left: 0, right: wikiWidth - WIKI_HANDLE_WIDTH }}
        position={position}
        onStop={handleDragStop}
        onDrag={(_, data) => {
          setTimeout(() => setLastX(data.x), 25);
          setDrawerWidth(wikiWidth - data.x - WIKI_HANDLE_WIDTH);
        }}
        onStart={(_, data) => {
          setStartDragX(data.x);
          setIsDragging(true);
        }}
        handle=".handle"
      >
        <div
          ref={handleRef}
          className="flex bg-muted pointer-events-auto h-full shadow-2xl"
        >
          <div
            className={cn(
              "handle h-full p-1 bg-[#50648e] border-x border-[#17171f] text-slate-300 hover:text-slate-100 transition-colors duration-200 shadow-inner cursor-pointer",
              isDragging && "cursor-grabbing"
            )}
            style={{ width: WIKI_HANDLE_WIDTH }}
          >
            <div className="relative h-full group flex flex-col items-center justify-center bg-[#5d73a1a3] border-[#17171f] rounded-lg shadow-inner">
              <p
                className={cn(
                  "absolute bottom-4 -rotate-90 origin-left self-start left-1/2 whitespace-nowrap font-semibold text-xl text-slate-400 group-hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-500",
                  isDragging && "!opacity-0"
                )}
              >
                Clickez ou déplacez
              </p>
              <div className="py-8 rounded bg-[#17171f35] group-hover:bg-[#17171f3e] transition-colors duration-200 shadow-inner">
                <Icon name={"GripVertical"} size={38} />
              </div>
            </div>
          </div>
          <div
            className="overflow-hidden min-w-60"
            style={{ width: drawerWidth }}
          >
            <div
              className="h-full overflow-y-scroll"
              style={{
                paddingInline: 1 + Math.pow(drawerWidth, 1.37) / 1000 + "%",
              }}
            >
              <div className="grid grid-cols-1 gap-2 py-4">
                <header className="mb-4 flex flex-col gap-2">
                  {selectedNodesLength > 1 ? (
                    <h1 className="w-full text-3xl font-bold col-span-full">
                      {`${selectedNodesLength} cartes selectionnées`}
                    </h1>
                  ) : selectedNodesLength === 1 ? (
                    <AutoFitTextArea
                      value={String(selectedNode.data.title ?? "")}
                      className={cn(
                        "text-3xl font-bold border-b",
                        !selectedNode.data.title && "border-b"
                      )}
                      containerClassName="col-span-full"
                      placeholder={getCardTitleName(selectedNode.type ?? "")}
                      onChange={(newValue) => {
                        updateNode(selectedNode.id, {
                          data: {
                            ...selectedNode.data,
                            title: newValue,
                          },
                        });
                      }}
                    />
                  ) : (
                    <h1 className="w-full text-3xl font-bold">
                      {
                        "Sélectionnez une ou plusieurs note pour voir leur informations plus en détails ici"
                      }
                    </h1>
                  )}
                  {wikiSelectedNodes &&
                    selectedNodesLength === 1 &&
                    !["event"].includes(selectedNode.type ?? "") && (
                      <AutoFitTextArea
                        value={String(selectedNode.data.description ?? "")}
                        containerClassName="col-span-1"
                        className={cn(
                          "text-sm py-2",
                          !selectedNode.data.description && "border-b"
                        )}
                        placeholder="description"
                        onChange={(newValue) => {
                          updateNode(selectedNode.id, {
                            data: {
                              ...selectedNode.data,
                              description: newValue,
                            },
                          });
                        }}
                      />
                    )}
                </header>
                {wikiSelectedNodes && !!selectedNodesLength && (
                  <>
                    {selectedNodesLength > 1 ? (
                      wikiSelectedNodes.map((node) => (
                        <WikiCard
                          key={node.id}
                          title={String(node.data.title ?? "")}
                          description={String(node.data.description ?? "")}
                          handleClick={() => setWikiSelectedNodesId([node.id])}
                        />
                      ))
                    ) : (
                      <>
                        {getCardComponent(selectedNode.type ?? "")}
                        {linkedNodes && !!linkedNodes.length && (
                          <WikiCard title={"Liens"}>
                            <ul className="flex flex-col gap-1">
                              {linkedNodes.map((link) => (
                                <li key={link.id}>
                                  <Button
                                    variant={"link"}
                                    className="p-0 h-fit"
                                    onClick={() =>
                                      setWikiSelectedNodesId([link.id])
                                    }
                                  >
                                    {String(link.data.title ?? "")}
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          </WikiCard>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default WikiDrawer;
