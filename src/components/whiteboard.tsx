import React, { useCallback, useState } from "react";
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
import NotesIconsMenu from "./notesIconsMenu";
import CharacterCard from "./cards/character";
import LocationCard from "./cards/location";
import ChoicesCard from "./cards/choices";
import EventCard from "./cards/event";
import MediaCard from "./cards/media";
import {
  useWhiteBoardContext,
  WhiteBoardProvider,
} from "../contexts/whiteboardContext";
import {
  cn,
  loadNodesFromLocalStorage,
  saveNodesToLocalStorage,
  deleteNodesFromLocalStorage,
} from "@/lib/utils";
import TempConnectionLine from "./flow/tempConnection";
import { Button } from "./ui/button";
import Icon from "./ui/icon";
import { DRAWER_WIDTH, DRAWER_WIDTH_MARGIN } from "@/config/constants";

const nodeTypes = {
  stickyNote: StickyNote,
  character: CharacterCard,
  location: LocationCard,
  event: EventCard,
  choices: ChoicesCard,
  media: MediaCard,
};

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
    linkMode,
    mousePosition,
    sourceNode,
    setLinkMode,
    onConnect,
    onReconnect,
    addNewNode,
    onNodesChange,
    onEdgesChange,
    setMousePosition,
    setSourceNode,
  } = useWhiteBoardContext();
  const { screenToFlowPosition, getZoom, deleteElements } = useReactFlow();
  const [draggedNodes, setDraggedNodes] = useState<Node[]>([]);
  const [listNodes, setListNodes] = useState<Node[]>(
    loadNodesFromLocalStorage("reactFlowNodesList")
  );

  const onDragOver: React.DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
    },
    []
  );

  const onDrop: React.DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer?.getData("application/reactflow");
      if (!type) return;
      const zoom = getZoom();
      const position = screenToFlowPosition({
        x: event.clientX - 86 * zoom,
        y: event.clientY - 20 * zoom,
      });
      addNewNode(type, position);
    },
    [getZoom, screenToFlowPosition, addNewNode]
  );

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
          deleteNodesFromLocalStorage(deletedNodes, "reactFlowNodes");
          setListNodes((prevNodes) => [...prevNodes, ...deletedNodes]);
          saveNodesToLocalStorage(nodes, "reactFlowNodesList");
        });
      }
    },
    [deleteElements, draggedNodes, nodes]
  );

  const typesList: Array<keyof typeof nodeTypes> = Object.keys(
    nodeTypes
  ) as Array<keyof typeof nodeTypes>;

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
          onDrop={onDrop}
          onDragOver={onDragOver}
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
              "bg-card h-full overflow-y-scroll border-r -translate-x-full transition-transform p-2 px-3 flex flex-col gap-2",
              mousePosition.x < DRAWER_WIDTH + DRAWER_WIDTH_MARGIN &&
                "translate-x-0",
              !draggedNodes.length && "relative z-20"
            )}
            style={{ width: DRAWER_WIDTH }}
          >
            {typesList.map((type) => (
              <div
                className="flex flex-col gap-0.5 pb-4 border-t border-white outline outline-1 outline-border rounded p-2 shadow"
                style={{ backgroundColor: typeColors[type] }}
              >
                <div className="text-lg font-semibold underline">{type}</div>
                {listNodes
                  .filter((node) => node.type === type)
                  .map((node) => (
                    <div className="truncate" key={node.id}>
                      {String(node.data.title)}
                    </div>
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
        <NotesIconsMenu />
        <div className="absolute -left-2 -translate-x-full">
          <Button
            className="rounded-full p-0 w-10"
            onClick={() => {
              setLinkMode((prev) => !prev);
              setSourceNode(null);
            }}
          >
            <Icon name={linkMode ? "Link2" : "Link2Off"} />
          </Button>
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
