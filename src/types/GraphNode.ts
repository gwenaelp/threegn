import type { GraphLink } from "./GraphLink";
import type { GraphSocket } from "./GraphSocket";
import type { Node } from 'reactflow';

export type GraphNode = Node & {
  position: { x: number; y: number; };
  width: number;
  height: number;
  id: string;
  name: string;
  label: string;
  default_label: string;
  links: GraphLink[];
  location: [x: number, y: number];
  type: string;
  inputs: GraphSocket[];
  outputs: GraphSocket[];
  operation?: string;
  _value: any;
}