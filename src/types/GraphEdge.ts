import type { Edge } from "reactflow";

//type SocketId = string;

export type GraphEdge = Edge & {
  source: any;
  target: any;
  sourceHandle?: string;
  targetHandle?: string;
  data: any;
};