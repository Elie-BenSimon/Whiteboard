import React, { createContext, useState, useCallback, useMemo } from "react";
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
  NodeChange,
  EdgeChange,
} from "@xyflow/react";
import {
  deleteEdgesFromLocalStorage,
  deleteNodesFromLocalStorage,
  edgeColors,
  loadEdgesFromLocalStorage,
  loadNodesFromLocalStorage,
  saveEdgesToLocalStorage,
  saveNodesToLocalStorage,
} from "@/lib/utils";
import { EdgeParams } from "@/lib/flowUtils";

interface WhiteBoardContextProps {
  edgeParams: EdgeParams;
  edges: Edge[];
  isDraggingFromList: boolean;
  isWikiLocked: boolean;
  linkMode: boolean;
  listNodes: Node[];
  mousePosition: { x: number; y: number };
  nodes: Node[];
  wikiSelectedNodes: Node[];
  wikiSelectedNodesId: string[];
  onConnect: (params: Connection) => void;
  onEdgesChange: OnEdgesChange<Edge>;
  onNodesChange: OnNodesChange<Node>;
  onReconnect: (oldEdge: Edge, newConnection: Connection) => void;
  setEdgeParams: React.Dispatch<React.SetStateAction<EdgeParams>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  setIsDraggingFromList: React.Dispatch<React.SetStateAction<boolean>>;
  setIsWikiLocked: React.Dispatch<React.SetStateAction<boolean>>;
  setLinkMode: React.Dispatch<React.SetStateAction<boolean>>;
  setListNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setMousePosition: (position: { x: number; y: number }) => void;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setWikiSelectedNodesId: React.Dispatch<React.SetStateAction<string[]>>;
}

export const WhiteBoardContext = createContext<
  WhiteBoardContextProps | undefined
>(undefined);

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [edgeParams, setEdgeParams] = useState<EdgeParams>({
    animated: false,
    color: edgeColors.gray,
    shape: "bezier",
    width: 4,
  });

  const [listNodes, setListNodes] = useState<Node[]>(
    loadNodesFromLocalStorage("reactFlowNodesList")
  );
  const [isDraggingFromList, setIsDraggingFromList] = useState(false);

  const [wikiSelectedNodesId, setWikiSelectedNodesId] = useState<string[]>([]);
  const wikiSelectedNodes = useMemo(
    () => [
      ...nodes.filter((node) => wikiSelectedNodesId.includes(node.id)),
      ...listNodes.filter((node) => wikiSelectedNodesId.includes(node.id)),
    ],
    [listNodes, nodes, wikiSelectedNodesId]
  );
  const [isWikiLocked, setIsWikiLocked] = useState(false);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds: Edge[]) =>
        addEdge(
          {
            ...params,
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
      onNodesStateChange(changes);
      if (changes[0].type !== "remove") {
        saveNodesToLocalStorage(nodes, "reactFlowNodes");
      } else {
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
        edgeParams,
        edges,
        isDraggingFromList,
        isWikiLocked,
        linkMode,
        listNodes,
        mousePosition,
        nodes,
        wikiSelectedNodes,
        wikiSelectedNodesId,
        onConnect,
        onEdgesChange,
        onNodesChange,
        onReconnect,
        setEdgeParams,
        setEdges,
        setIsDraggingFromList,
        setIsWikiLocked,
        setLinkMode,
        setListNodes,
        setMousePosition,
        setNodes,
        setWikiSelectedNodesId,
      }}
    >
      {children}
    </WhiteBoardContext.Provider>
  );
};
