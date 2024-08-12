import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  useEdgesState,
  useNodesState,
  addEdge,
  Connection,
  Edge,
  useReactFlow,
  ReactFlowProvider,
  Node,
  OnReconnect,
  reconnectEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DragEventHandler, useCallback, useEffect, useRef } from "react";
import StickyNote from "./cards/stickyNote";
import FloatingEdge from "./flow/floatingEdge";
import FloatingConnectionLine from "./flow/floatingConnectionLine";
import NotesIconsMenu from "./notesIconsMenu";
import { v4 as uuidV4 } from "uuid";
import CharacterCard from "./cards/character";
import LocationCard from "./cards/location";
import ChoicesCard from "./cards/choices";
import EventCard from "./cards/event";
import MediaCard from "./cards/media";
import {
  loadNodesFromLocalStorage,
  saveNodesToLocalStorage,
} from "@/lib/utils";

const nodeTypes = {
  stickyNote: StickyNote,
  character: CharacterCard,
  location: LocationCard,
  event: EventCard,
  choices: ChoicesCard,
  media: MediaCard,
};
const edgeTypes = {
  floating: FloatingEdge,
};

function WhiteBoard() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
    loadNodesFromLocalStorage()
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveNodesToLocalStorage(nodes);
  }, [nodes]);

  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  }, []);

  const onDrop: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer?.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX - 86,
        y: event.clientY - 20,
      });
      const newNode = {
        id: uuidV4(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds: Edge[]) =>
        addEdge(
          {
            ...params,
            type: "floating",
          },
          eds
        )
      ),
    [setEdges]
  );

  const onReconnect: OnReconnect<Edge> = useCallback(
    (oldEdge, newConnection) =>
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els)),
    [setEdges]
  );

  return (
    <div className="w-full h-full relative flex">
      <div className="w-48 h-full border-r bg-background">navigation</div>
      <div
        className="reactflow-wrapper h-full flex-grow"
        ref={reactFlowWrapper}
      >
        <ReactFlow
          nodeTypes={nodeTypes}
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
        >
          <Background variant={BackgroundVariant.Dots} />
          <Controls />
        </ReactFlow>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
        <NotesIconsMenu />
      </div>
    </div>
  );
}

const WhiteBoardAppWrapper = () => (
  <ReactFlowProvider>
    <WhiteBoard />
  </ReactFlowProvider>
);

export default WhiteBoardAppWrapper;
