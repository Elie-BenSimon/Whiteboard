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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback } from "react";
import StickyNote from "./cards/stickyNote";
import FloatingEdge from "./flow/floatingEdge";
import FloatingConnectionLine from "./flow/floatingConnectionLine";

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

  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={FloatingConnectionLine}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default WhiteBoard;
