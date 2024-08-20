import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Node,
  Edge,
  Connection,
  addEdge,
  reconnectEdge,
  useEdgesState,
  useNodesState,
  OnEdgesChange,
  OnNodesChange,
  NodeProps,
  NodeChange,
  EdgeChange,
} from "@xyflow/react";
import { v4 as uuidV4 } from "uuid";
import {
  deleteEdgesFromLocalStorage,
  deleteNodesFromLocalStorage,
  loadEdgesFromLocalStorage,
  loadNodesFromLocalStorage,
  saveEdgesToLocalStorage,
  saveNodesToLocalStorage,
} from "@/lib/utils";

interface WhiteBoardContextProps {
  nodes: Node[];
  edges: Edge[];
  linkMode: boolean;
  sourceNode: NodeProps | null;
  mousePosition: { x: number; y: number };
  setLinkMode: React.Dispatch<React.SetStateAction<boolean>>;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  setMousePosition: (position: { x: number; y: number }) => void;
  onCardClick: (node: NodeProps) => void;
  onConnect: (params: Connection) => void;
  onReconnect: (oldEdge: Edge, newConnection: Connection) => void;
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  setSourceNode: React.Dispatch<React.SetStateAction<NodeProps | null>>;
}

const WhiteBoardContext = createContext<WhiteBoardContextProps | undefined>(
  undefined
);

export const WhiteBoardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [nodes, setNodes, onNodesStateChange] = useNodesState<Node>(
    loadNodesFromLocalStorage("reactFlowNodes")
  );
  const [edges, setEdges, onEdgesStateChange] = useEdgesState<Edge>(
    loadEdgesFromLocalStorage("reactFlowEdges")
  );
  const [linkMode, setLinkMode] = useState(true);
  const [sourceNode, setSourceNode] = useState<NodeProps | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const onCardClick = useCallback(
    (node: NodeProps) => {
      if (linkMode) {
        if (sourceNode) {
          const newEdge: Edge = {
            id: uuidV4(),
            source: sourceNode.id,
            target: node.id,
            type: "floating",
            sourceHandle: "source",
            targetHandle: "target",
          };
          setEdges((eds) => addEdge(newEdge, eds));
          saveEdgesToLocalStorage([newEdge], "reactFlowEdges");
          setSourceNode(null);
        } else {
          setSourceNode(node);
        }
      }
    },
    [linkMode, setEdges, sourceNode]
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

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) =>
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els)),
    [setEdges]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      console.log("nodes changed", changes);
      onNodesStateChange(changes);
      if (changes[0].type !== "remove") {
        saveNodesToLocalStorage(nodes, "reactFlowNodes");
      } else {
        setSourceNode(null);
        const nodeIds = changes.map(
          (change) => (change as unknown as { id: string }).id
        );
        const nodesToDelete = nodes.filter((node) => nodeIds.includes(node.id));
        deleteNodesFromLocalStorage(nodesToDelete, "reactFlowNodes");
      }
    },
    [onNodesStateChange, nodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      onEdgesStateChange(changes);
      if (changes[0].type !== "remove") {
        saveEdgesToLocalStorage(edges, "reactFlowEdges");
      } else {
        const edgeIds = changes.map(
          (change) => (change as unknown as { id: string }).id
        );
        const edgesToDelete = edges.filter((edge) => edgeIds.includes(edge.id));
        deleteEdgesFromLocalStorage(edgesToDelete, "reactFlowEdges");
      }
    },
    [onEdgesStateChange, edges]
  );

  return (
    <WhiteBoardContext.Provider
      value={{
        nodes,
        edges,
        linkMode,
        sourceNode,
        mousePosition,
        setLinkMode,
        setNodes,
        setEdges,
        setMousePosition,
        onCardClick,
        onConnect,
        onReconnect,
        onNodesChange,
        onEdgesChange,
        setSourceNode,
      }}
    >
      {children}
    </WhiteBoardContext.Provider>
  );
};

export const useWhiteBoardContext = () => {
  const context = useContext(WhiteBoardContext);
  if (!context) {
    throw new Error(
      "useWhiteBoardContext must be used within a WhiteBoardProvider"
    );
  }
  return context;
};
