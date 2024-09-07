import { useState, useRef, useEffect } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import WikiCard from "../ui/wikiCard";
import Icon from "../ui/icon";
import { useWhiteBoardContext } from "@/hooks/useWhiteBoardContext";
import { useReactFlow } from "@xyflow/react";
import AutoFitTextArea from "../ui/autoFitTextArea";
import CharacterCard from "./characterCard";
import { cn, getCardTitleName } from "@/lib/utils";
import { WIKI_HANDLE_WIDTH } from "@/config/constants";

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
  const selectedNode = wikiSelectedNodes[0];

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

  return (
    <div
      ref={wikiContainerRef}
      className="absolute right-0 z-10 w-4/5 h-full pointer-events-none"
    >
      <Draggable
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
        <div className="flex bg-muted pointer-events-auto h-full shadow-2xl">
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
                  "absolute bottom-16 -rotate-90 whitespace-nowrap font-semibold text-xl text-slate-400 group-hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-500",
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
              <div className="grid grid-cols-1 gap-4 py-4">
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
                {wikiSelectedNodes && !!selectedNodesLength && (
                  <>
                    {selectedNodesLength > 1 ? (
                      wikiSelectedNodes.map((node) => (
                        <WikiCard
                          title={String(node.data.title ?? "")}
                          description={String(node.data.description ?? "")}
                          handleClick={() => setWikiSelectedNodesId([node.id])}
                        />
                      ))
                    ) : (
                      <>
                        {!["event"].includes(selectedNode.type ?? "") && (
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
                        {getCardComponent(selectedNode.type ?? "")}
                        <WikiCard
                          title={"test de carte"}
                          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae mollitia nihil modi nam beatae veniam, cumque enim amet veritatis optio aspernatur sequi delectus earum vero velit cum magni fugiat. Ratione quis nisi aperiam unde."
                        ></WikiCard>
                        <WikiCard
                          title={"test de carte"}
                          description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem cumque maxime aliquam nihil placeat delectus quas hic ad repellat earum saepe doloribus doloremque veritatis, praesentium ratione deserunt sequi est minus. Aliquid illo quidem harum quis nam quia laboriosam neque, et, facere accusantium molestiae consequuntur eligendi fugiat voluptatibus quibusdam? Corporis asperiores ratione error qui sunt porro aliquam sit, consequuntur ducimus dicta ullam, incidunt pariatur alias ea."
                        ></WikiCard>
                        <WikiCard
                          title={"test de carte"}
                          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore placeat aliquid eum, assumenda tenetur debitis rem aut cumque, sit alias vitae modi soluta qui dolores sint illo quos, maxime sequi voluptatibus iste! Dicta, illum deleniti voluptas maiores sit natus illo at rerum odio corrupti aspernatur velit nihil blanditiis quidem omnis numquam qui repudiandae! Doloribus beatae eligendi quidem tempora nam iusto adipisci eos, quis dolorem corrupti ratione inventore perspiciatis eaque illo dolor quo nesciunt accusantium! Architecto eaque vel eveniet animi natus magnam sed ex ipsum laborum itaque porro veniam cum commodi error minus atque quasi dicta nobis culpa, beatae necessitatibus corrupti suscipit. Quibusdam, molestias dolore nemo nostrum molestiae ratione! Itaque ipsam molestiae ab earum ex animi laboriosam esse, sit, asperiores pariatur laborum perspiciatis atque repellendus, magni eveniet eligendi! Laboriosam nihil placeat odio culpa dolorem perspiciatis in quaerat maxime expedita quis, possimus excepturi nesciunt eos minus a fugiat nisi natus reprehenderit commodi quibusdam! Facere quis animi provident autem architecto dignissimos, sit, consequatur iure suscipit iste minima laborum, voluptatem quos fugiat error ducimus eos quo neque. Veritatis aut nam iusto beatae, blanditiis nulla eius. Eius adipisci fugit tempore, nesciunt labore nemo eum repellendus autem fugiat animi! Laborum iste dolorum minima architecto! Nisi exercitationem explicabo amet, sapiente eveniet id voluptate pariatur ratione provident nam, quas cupiditate quibusdam aliquid neque velit corrupti, fuga obcaecati quisquam aut error tempora similique nemo consectetur cum? Suscipit aliquam itaque nostrum ipsa non magnam perferendis rem aut sequi harum eius quae, minima mollitia. Fugit, dolore."
                        ></WikiCard>
                        <WikiCard
                          title={"test de carte"}
                          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Non explicabo debitis nemo, rerum corrupti fuga. Velit amet ullam sapiente nemo, assumenda ex laborum voluptatibus modi quibusdam. Voluptatibus excepturi officiis impedit doloribus deleniti maiores ipsa repudiandae, expedita numquam ipsam, sequi dolorem libero. Quos cum vitae minus ipsam? Fugiat corrupti labore eligendi amet ad nostrum blanditiis repudiandae debitis minima aut excepturi aliquam, enim quisquam rem obcaecati cumque nam suscipit id reiciendis! Quae, atque!"
                        ></WikiCard>
                        <WikiCard
                          title={"test de carte"}
                          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Non explicabo debitis nemo, rerum corrupti fuga. Velit amet ullam sapiente nemo, assumenda ex laborum voluptatibus modi quibusdam. Voluptatibus excepturi officiis impedit doloribus deleniti maiores ipsa repudiandae, expedita numquam ipsam, sequi dolorem libero. Quos cum vitae minus ipsam? Fugiat corrupti labore eligendi amet ad nostrum blanditiis repudiandae debitis minima aut excepturi aliquam, enim quisquam rem obcaecati cumque nam suscipit id reiciendis! Quae, atque!"
                        ></WikiCard>
                        <WikiCard
                          title={"test de carte"}
                          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae mollitia nihil modi nam beatae veniam, cumque enim amet veritatis optio aspernatur sequi delectus earum vero velit cum magni fugiat. Ratione quis nisi aperiam unde."
                        ></WikiCard>
                        <WikiCard
                          title={"test de carte"}
                          description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem cumque maxime aliquam nihil placeat delectus quas hic ad repellat earum saepe doloribus doloremque veritatis, praesentium ratione deserunt sequi est minus. Aliquid illo quidem harum quis nam quia laboriosam neque, et, facere accusantium molestiae consequuntur eligendi fugiat voluptatibus quibusdam? Corporis asperiores ratione error qui sunt porro aliquam sit, consequuntur ducimus dicta ullam, incidunt pariatur alias ea."
                        ></WikiCard>
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
