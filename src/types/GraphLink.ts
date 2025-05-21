import type { GraphNode } from "./GraphNode";
//import type { GraphSocket } from "./GraphSocket";
//import type { Link } from 'reactflow';

export type GraphLink = {
  socket: string;
  node: GraphNode;
  type: any;
};