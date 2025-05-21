import * as math from "./math";
import { Bezier } from "bezier-js";
import * as rf from "reactflow";
import React from "react";
import type { GraphEdge } from "../types/GraphEdge";
import type { GraphNode } from "../types/GraphNode";
import type { GraphSocket } from "../types/GraphSocket";

export function nodeIntersectsEdges(node: GraphNode, edges: GraphEdge[], nodeInternals: rf.NodeInternals) {
  const { width, height } = node;
  const { x, y } = node.position;

  const nodeLines = [
    { p1: { x, y }, p2: { x: x + width, y } },
    { p1: { x: x + width, y }, p2: { x: x + width, y: y + height } },
    { p1: { x, y: y + height }, p2: { x: x + width, y: y + height } },
    { p1: { x, y }, p2: { x, y: y + height } },
  ];

  const edgeCurves = edges.map((edge: GraphEdge) => {
    const { source, sourceHandle, target, targetHandle } = edge;
    const sourceNode = nodeInternals.get(source);
    const targetNode = nodeInternals.get(target);
    if(!rf.internalsSymbol) throw 'rf.internalsSymbol undefined';
    if(!sourceNode) throw 'source node not found';
    if(!targetNode) throw 'target node not found';

    const sourceSocket = sourceNode[rf.internalsSymbol]?.handleBounds?.source?.find((s: GraphSocket) => s.id === sourceHandle);
    const targetSocket = targetNode[rf.internalsSymbol]?.handleBounds?.target?.find((s: GraphSocket) => s.id === targetHandle);

    if(!sourceSocket) throw 'sourceSocket node not found';
    if(!targetSocket) throw 'targetSocket node not found';

    const bezierPoints = math.getBezierPoints({
      sourceX: sourceNode.position.x + sourceSocket.x,
      sourceY: sourceNode.position.y + sourceSocket.y,
      sourcePosition: sourceSocket.position,
      targetX: targetNode.position.x + targetSocket.x,
      targetY: targetNode.position.y + targetSocket.y,
      targetPosition: targetSocket.position,
    });

    return {
      edge,
      curve: new Bezier(bezierPoints),
    };
  });

  const intersectedCurves = edgeCurves.filter((c) =>
    nodeLines.some((l) => c.curve.intersects(l).length > 0)
  );

  return intersectedCurves.map((int) => int.edge);
}

export function useNodeIntersectsEdges() {
  const store = rf.useStoreApi();

  return React.useCallback(
    (node: GraphNode, edges: GraphEdge[]) => {
      const nodeInternals = store.getState().nodeInternals;
      return nodeIntersectsEdges(node, edges, nodeInternals);
    },
    [store]
  );
}
