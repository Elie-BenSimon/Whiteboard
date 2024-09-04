import { useCallback, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
  NodeTypes,
  Node,
  OnNodeDrag,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import StickyNote from "./cards/stickyNote";
import FloatingEdge from "./flow/floatingEdge";
import FloatingConnectionLine from "./flow/floatingConnectionLine";
import CardsMenu from "./controls/cardsMenu";
import CharacterCard from "./cards/character";
import LocationCard from "./cards/location";
import ChoicesCard from "./cards/choices";
import EventCard from "./cards/event";
import MediaCard from "./cards/media";
import {
  useWhiteBoardContext,
  WhiteBoardProvider,
} from "../contexts/whiteboardContext";
import { cn, saveNodesToLocalStorage } from "@/lib/utils";
import TempConnectionLine from "./flow/tempConnection";
import { DRAWER_WIDTH, DRAWER_WIDTH_MARGIN } from "@/config/constants";
import EdgesMenu from "./controls/edgesMenu";
import DrawerItem from "./controls/drawerItem";

const nodeTypes = {
  stickyNote: StickyNote,
  character: CharacterCard,
  location: LocationCard,
  event: EventCard,
  choices: ChoicesCard,
  media: MediaCard,
};

type NodeType = keyof typeof nodeTypes;

const typeColors = {
  stickyNote: "rgb(254 249 195)",
  character: "rgb(219 234 254)",
  location: "rgb(220 252 231)",
  event: "rgb(254 226 226)",
  choices: "rgb(204 251 241)",
  media: "rgb(237 233 254)",
};

const edgeTypes = {
  floating: FloatingEdge,
};

function WhiteBoard() {
  const {
    nodes,
    edges,
    mousePosition,
    sourceNode,
    listNodes,
    isDraggingFromList,
    setListNodes,
    onConnect,
    onReconnect,
    onNodesChange,
    onEdgesChange,
    setMousePosition,
    setSourceNode,
  } = useWhiteBoardContext();
  const { deleteElements } = useReactFlow();
  const [draggedNodes, setDraggedNodes] = useState<Node[]>([]);

  const onNodeDragStart: OnNodeDrag = useCallback(
    (_, node) => {
      setSourceNode(null);
      setDraggedNodes([...nodes.filter((node) => node.selected), node]);
    },
    [nodes, setSourceNode]
  );

  const onNodeDragStop: OnNodeDrag = useCallback(
    (event) => {
      if (event.clientX < DRAWER_WIDTH + DRAWER_WIDTH_MARGIN) {
        const nodesToDelete = draggedNodes.filter(
          (node) =>
            typeof node.data.title === "string" && node.data.title.length > 0
        );
        deleteElements({ nodes: nodesToDelete }).then(({ deletedNodes }) => {
          setDraggedNodes([]);
          setListNodes((prevNodes) => [...prevNodes, ...deletedNodes]);
          saveNodesToLocalStorage(nodes, "reactFlowNodesList");
        });
      }
    },
    [deleteElements, draggedNodes, nodes, setListNodes]
  );

  const typesList: Array<NodeType> = Object.keys(nodeTypes) as Array<NodeType>;

  return (
    <div className="relative w-full h-full flex">
      <div className="reactflow-wrapper h-full w-full">
        <ReactFlow
          nodeTypes={nodeTypes as unknown as NodeTypes}
          edgeTypes={edgeTypes}
          connectionLineComponent={FloatingConnectionLine}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onReconnect={onReconnect}
          onNodeDragStop={onNodeDragStop}
          onNodeDragStart={onNodeDragStart}
          onNodeDrag={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
          onMouseMove={(e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
          }}
          onClick={() => {
            if (sourceNode) setSourceNode(null);
          }}
          zoomOnDoubleClick={false}
          minZoom={0.1}
          disableKeyboardA11y
        >
          <div
            className={cn(
              "bg-card h-full border-r -translate-x-full transition-transform p-2 px-3 flex flex-col gap-2",
              mousePosition.x < DRAWER_WIDTH + DRAWER_WIDTH_MARGIN &&
                "translate-x-0",
              !draggedNodes.length && "relative z-20",
              !isDraggingFromList && "overflow-y-scroll"
            )}
            style={{ width: DRAWER_WIDTH }}
          >
            {typesList.map((type) => (
              <div
                key={type}
                className="flex flex-col gap-0.5 pb-4 border-t border-white outline outline-1 outline-border rounded p-2 shadow"
                style={{ backgroundColor: typeColors[type] }}
              >
                <div className="text-lg font-semibold underline">{type}</div>
                {listNodes
                  .filter((node) => node.type === type)
                  .map((node) => (
                    <DrawerItem key={node.id} node={node} />
                  ))}
              </div>
            ))}
          </div>
          <Background variant={BackgroundVariant.Dots} />
          <Controls position="bottom-right" />
          {sourceNode && <TempConnectionLine />}
        </ReactFlow>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        <CardsMenu />
        <div className="absolute -left-2 -translate-x-full">
          <EdgesMenu />
        </div>
      </div>
    </div>
  );
}

const WhiteBoardAppWrapper = () => (
  <ReactFlowProvider>
    <WhiteBoardProvider>
      <WhiteBoard />
    </WhiteBoardProvider>
  </ReactFlowProvider>
);

export default WhiteBoardAppWrapper;
