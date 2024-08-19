import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
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
} from "@xyflow/react";
import { v4 as uuidV4 } from "uuid";
import {
  loadNodesFromLocalStorage,
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
  addNewNode: (type: string, position: { x: number; y: number }) => void;
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
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
    loadNodesFromLocalStorage("reactFlowNodes")
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [linkMode, setLinkMode] = useState(true);
  const [sourceNode, setSourceNode] = useState<NodeProps | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    saveNodesToLocalStorage(nodes, "reactFlowNodes");
  }, [nodes]);

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

  const addNewNode = (type: string, position: { x: number; y: number }) => {
    const newNode: Node = {
      id: uuidV4(),
      type,
      position,
      data: { title: "" },
    };
    setNodes((nds) => [...nds, newNode]);
  };

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
        addNewNode,
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
