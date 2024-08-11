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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useRef } from "react";
import StickyNote from "./cards/stickyNote";
import FloatingEdge from "./flow/floatingEdge";
import FloatingConnectionLine from "./flow/floatingConnectionLine";
import NotesIconsMenu from "./notesIconsMenu";
import { v4 as uuidV4 } from "uuid";

const nodeTypes = { stickyNote: StickyNote };
const edgeTypes = {
  floating: FloatingEdge,
};

const initialNodes = [
  {
    id: "1",
    type: "stickyNote",
    data: { label: "Note 1" },
    position: { x: 0, y: 0 },
  },
  {
    id: "2",
    type: "stickyNote",
    data: { label: "Note 2" },
    position: { x: 100, y: 100 },
  },
  {
    id: "3",
    type: "stickyNote",
    data: { label: "Note 1" },
    position: { x: 200, y: 200 },
  },
  {
    id: "4",
    type: "stickyNote",
    data: { label: "Note 2" },
    position: { x: 300, y: 300 },
  },
];

function WhiteBoard() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

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
    [screenToFlowPosition]
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
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full h-full relative">
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
