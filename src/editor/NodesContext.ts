import React, { createContext, useCallback, useContext } from "react";
import type { GraphNode } from '../types/GraphNode';

// Type for context value: a tuple with nodes array and setter
type NodesContextType = [GraphNode[], React.Dispatch<React.SetStateAction<GraphNode[]>>];

// Create context with `undefined` as default for safety
const NodesContext = createContext<NodesContextType | undefined>(undefined);
export const NodesContextProvider = NodesContext.Provider;

export function useNodes(): NodesContextType {
  const context = useContext(NodesContext);
  if (!context) throw new Error("useNodes must be used within a NodesContextProvider");
  return context;
}

export function useNodeByID(id: string): [GraphNode | undefined, (updater: (node: GraphNode) => GraphNode) => void] {
  const [nodes, setNodes] = useNodes();
  const node = nodes.find((n) => n.id === id);
  const setNode = useCallback(
    (f: (node: GraphNode) => GraphNode) => {
      setNodes((nodes) => nodes.map((n) => (n.id === id ? f(n) : n)));
    },
    [id, setNodes]
  );
  return [node, setNode];
}

export function useNodeByType(type: string): [GraphNode | undefined, (updater: (node: GraphNode) => GraphNode) => void] {
  const [nodes, setNodes] = useNodes();
  const node = nodes.find((n) => n.type === type);
  const setNode = useCallback(
    (f: (node: GraphNode) => GraphNode) => {
      setNodes((nodes) => nodes.map((n) => (n.type === type ? f(n) : n)));
    },
    [type, setNodes]
  );
  return [node, setNode];
}
