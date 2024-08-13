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
  OnNodeDrag,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  DragEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
  cn,
  deleteNodesFromLocalStorage,
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
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
    loadNodesFromLocalStorage("reactFlowNodes")
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition, getZoom, deleteElements } = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [draggedNodes, setDraggedNodes] = useState<Node[]>([]);
  const [listNodes, setListNodes] = useState<Node[]>(
    loadNodesFromLocalStorage("reactFlowNodesList")
  );
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const drawerWidth = 200;

  useEffect(() => {
    saveNodesToLocalStorage(nodes, "reactFlowNodes");
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

      const zoom = getZoom();

      const position = screenToFlowPosition({
        x: event.clientX - 86 * zoom,
        y: event.clientY - 20 * zoom,
      });
      const newNode = {
        id: uuidV4(),
        type,
        position,
        data: { title: `${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [getZoom, screenToFlowPosition, setNodes]
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

  const onNodeDragStop: OnNodeDrag = useCallback(
    (event) => {
      if (event.clientX < drawerWidth + 80) {
        deleteElements({ nodes: draggedNodes }).then(({ deletedNodes }) => {
          setDraggedNodes([]);
          deleteNodesFromLocalStorage(deletedNodes, "reactFlowNodes");
          setListNodes((prevNodes) => [...prevNodes, ...deletedNodes]);
          saveNodesToLocalStorage(nodes, "reactFlowNodesList");
        });
      }
    },
    [deleteElements, draggedNodes, nodes]
  );

  const onNodeDragStart: OnNodeDrag = useCallback(
    (_, node) => {
      setDraggedNodes([...nodes.filter((node) => node.selected), node]);
    },
    [nodes]
  );

  const typesList: Array<keyof typeof nodeTypes> = Object.keys(
    nodeTypes
  ) as Array<keyof typeof nodeTypes>;

  return (
    <div
      className="relative w-full h-full flex"
      onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
    >
      <div className="reactflow-wrapper h-full w-full" ref={reactFlowWrapper}>
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
          onNodeDragStop={onNodeDragStop}
          onNodeDragStart={onNodeDragStart}
          onNodeDrag={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
        >
          <div
            className={cn(
              "bg-card h-full overflow-y-scroll border-r -translate-x-full transition-transform p-2 px-3 flex flex-col gap-2",
              mousePosition.x < drawerWidth + 80 && "translate-x-0",
              !draggedNodes.length && "relative z-20"
            )}
            style={{ width: drawerWidth }}
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
                    <div key={node.id}>{String(node.data.title)}</div>
                  ))}
              </div>
            ))}
          </div>
          <Background variant={BackgroundVariant.Dots} />
          <Controls position="bottom-right" />
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
