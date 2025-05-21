import React, { useCallback, useEffect } from "react";
import * as rf from "reactflow";
import { useNodeByID, useNodes } from "./NodesContext.js";
import { createEdge, edgeToId } from "./node_utils.js";
import { log } from "./log.js";
import type { GraphNode } from "../types/GraphNode.js";
import type { GraphSocket } from "../types/GraphSocket.js";
import type { GraphLink } from "../types/GraphLink.js";

export function useEventListener(
  target: HTMLElement | Document,
  name: string,
  handler: () => void,
  useCapture = false,
  deps: any[] = []
) {
  React.useEffect(() => {
    target.addEventListener(name, handler, useCapture);
    return () => target.removeEventListener(name, handler, useCapture);
  }, [target, name, handler, useCapture, ...deps]);
}

// updates node's field from node's UI
// select fields, check boxes, etc
type UseNodeChangeArgs = {
  nodeId: string;
  onChange: (node: GraphNode, ...args: any[]) => void;
}
export function useNodeChange(args: UseNodeChangeArgs) {
  const { nodeId, onChange } = args;
  const [_, setNode] = useNodeByID(nodeId);
  return useCallback(
    (...args) => setNode((node) => onChange(node, ...args)),
    [setNode, onChange]
  );
}

// updates node's socket from node's UI
// inputs fields etc
type UseNodeSocketChangeArgs = {
  onChange: (idx: number, v: any) => void;
  nodeId: string;
  socketId: string;
  isConstant?: boolean;
};
export function useNodeSocketChange(args: UseNodeSocketChangeArgs) {
  const { onChange, nodeId, socketId, isConstant } = args;
  const [_, setNode] = useNodeByID(nodeId);
  return useCallback(
    (idx: number, v: any) => {
      const value = onChange(idx, v);
      setNode((node: GraphNode) => {
        const field = isConstant ? "outputs" : "inputs";
        const values = node[field].map((n) =>
          n.identifier === socketId ? { ...n, value } : n
        );
        return { ...node, [field]: values };
      });
    },
    [onChange, isConstant, setNode]
  );
}

function findNodeByID({ nodes, id }: { nodes: GraphNode[], id: string }) {
  return nodes.find((n) => n.id === id);
}

type FindSocketByIDArgs = {
  node: GraphNode;
  id: string;
  socketType: keyof GraphNode;
};
function findSocketByID(args: FindSocketByIDArgs) {
  const { node, socketType, id } = args;
  return node[socketType].find((n) => n.identifier === id);
}

type CreateLinkInNodeArgs = {
  linkType: keyof GraphNode;
  node: GraphNode;
  nodeSocket: GraphSocket;
  linkedNodeSocket: GraphSocket;
  linkedNodeName: string;
};

function createLinkInNode(args: CreateLinkInNodeArgs) {
  const { linkType, node, nodeSocket, linkedNodeSocket, linkedNodeName } = args;
  const values = node[linkType].map((n: GraphNode) => {
    if (n.identifier === nodeSocket) {
      const link = {
        node: linkedNodeName,
        socket: linkedNodeSocket,
      };
      return { ...n, links: [...n.links, link] };
    }
    return n;
  });
  return { ...node, [linkType]: values };
}

function removeLinkInNode(args: { linkType: any; node: GraphNode; nodeSocket: any; targetSocket?: any; sourceNode?: GraphNode; }) {
  const {
    linkType,
    node,
    nodeSocket,
    targetSocket,
    sourceNode,
  } = args;

  if (linkType === "inputs") {
    // handling multi input sockets
    const inputs = node.inputs.map((n) => {
      if (n.identifier === targetSocket) {
        return {
          ...n,
          links: n.links.filter((l: GraphLink) => l.node.name !== sourceNode?.name),
        };
      }
      return n;
    });
    return { ...node, inputs };
  } else {
    const outputs = node[linkType].map((n: GraphNode) => {
      return { ...n, links: n.links.filter((l) => l.socket !== nodeSocket) };
    });
    return { ...node, outputs };
  }
}

// update links in Geo Nodes data
export function applyEdgeChangeToNodes(setNodes: (nodes: GraphNode[]) => void, ops: any[]) {
  log("applyEdgeChangeToNodes");
  setNodes((nodes: GraphNode[]) => {
    return ops.reduce((nodes, { params, op }) => {
      const sourceNode = findNodeByID({ id: params.source, nodes });
      const targetNode = findNodeByID({ id: params.target, nodes });

      if (!targetNode?.name) throw 'targetNode.name undefined';
      if (!sourceNode?.name) throw 'sourceNode.name undefined';
      return nodes.map((node: GraphNode) => {
        if (node.id === params.source) {
          if (op === "create") {
            return createLinkInNode({
              linkType: "outputs",
              node,
              nodeSocket: params.sourceHandle,
              linkedNodeSocket: params.targetHandle,
              linkedNodeName: targetNode.name,
            });
          } else if (op === "remove") {
            return removeLinkInNode({
              linkType: "outputs",
              node,
              nodeSocket: params.targetHandle,
            });
          }
        }
        if (node.id === params.target) {
          if (op === "create") {
            return createLinkInNode({
              linkType: "inputs",
              node,
              nodeSocket: params.targetHandle,
              linkedNodeSocket: params.sourceHandle,
              linkedNodeName: sourceNode.name,
            });
          } else if (op === "remove") {
            return removeLinkInNode({
              linkType: "inputs",
              node,
              nodeSocket: params.sourceHandle,
              targetSocket: params.targetHandle,
              sourceNode,
            });
          }
        }
        return node;
      });
    }, nodes);
  });
}

// handle new links between rf nodes
// and propagate change to geo nodes
export function useSocketConnect() {
  const { setEdges, getEdges } = rf.useReactFlow();
  const [nodes, setNodes] = useNodes();

  return useCallback(
    (params: { source: any; target: any; sourceHandle: any; targetHandle: any; data?: any; }) => {
      // create edge in ReactFlow state
      const sourceNode = findNodeByID({ id: params.source, nodes });
      const targetNode = findNodeByID({ id: params.target, nodes });

      if (!sourceNode) throw 'source node not found';
      if (!targetNode) throw 'target node not found';

      const source = findSocketByID({
        id: params.sourceHandle,
        socketType: "outputs",
        node: sourceNode,
      });
      const target = findSocketByID({
        id: params.targetHandle,
        socketType: "inputs",
        node: targetNode,
      });

      const edge = createEdge({
        ...params,
        data: {
          sourceSocket: { type: source.type, shape: source.display_shape },
          targetSocket: {
            type: target.type,
            shape: target.display_shape,
          },
        },
      });

      const edgeToRemove = getEdges().find(
        (e) =>
          e.target === params.target && e.targetHandle === params.targetHandle
      );

      if (target.is_multi_input || !edgeToRemove) {
        // add an edge for multi input sockets
        setEdges((edges) => rf.addEdge(edge, edges));
        applyEdgeChangeToNodes(setNodes, [{ params, op: "create" }]);
      } else {
        // replace an edge for single input sockets
        // but only if it's not the same edge
        if (edgeToId(params) !== edgeToRemove.id) {
          const removeParams = {
            source: edgeToRemove.source,
            sourceHandle: edgeToRemove.sourceHandle,
            target: params.target,
            targetHandle: params.targetHandle,
          };
          setEdges((edges) =>
            rf.addEdge(edge, edges).filter((e) => e.id !== edgeToRemove.id)
          );
          applyEdgeChangeToNodes(setNodes, [
            { params, op: "create" },
            { params: removeParams, op: "remove" },
          ]);
        }
      }
    },
    [nodes, setEdges, getEdges, setNodes]
  );
}

// sync rf nodes state to geo nodes
type UseSyncNodesStateArgs = {
  setNodes: any;
  nodes: any;
};
export function useSyncNodesState(args: UseSyncNodesStateArgs) {
  const { setNodes, nodes } = args;
  useEffect(() => {
    if (nodes.length > 0) {
      log("useSyncNodesState");
      const ids = new Set(nodes.map((n) => n.id));
      setNodes((nodes: GraphNode[]) => nodes.filter((n: GraphNode) => ids.has(n.id)));
    }
  }, [
    nodes
      .map((n: GraphNode) => n.id)
      .sort()
      .join(),
  ]);
}

export function useApplyNodes() {
  const [_, setNodes] = useNodes();
  const rfv = rf.useReactFlow();
  return function ({ geoNodes, rfState: [nodes, edges] }: { geoNodes: any, rfState: any[][]}) {
    log("useApplyNodes");
    // FIXME: ugly
    rfv.setNodes([]);
    rfv.setEdges([]);
    setTimeout(() => {
      setNodes(geoNodes);
      rfv.setNodes(nodes);
      rfv.setEdges(edges);
      setTimeout(() => rfv.fitView({ duration: 100 }), 100);
    }, 100);
  };
}
