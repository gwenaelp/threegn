import { enrichNodes } from "./editor/node_utils.js";
import type { GraphNode } from "./types/GraphNode.js";
import { nodeTypeToFn, _index } from "./nodes.ts";

function findNodesByType(type: string, node: GraphNode) {
  const ret = new Set();

  function _findNodesByType(node: GraphNode) {
    if (node.type === type) {
      ret.add(node);
    }
    node.inputs
      .flatMap((input) => input.links)
      .forEach((link) => _findNodesByType(link.node));
  }

  _findNodesByType(node);

  return [...ret];
}

export function _evaluateNode([node, sidx]: [GraphNode, any]) {
  if(!node.type) throw 'node type undefined';

  const nodeFn = nodeTypeToFn[node.type];

  if (nodeFn === undefined) {
    console.log(node);
    throw new Error(`no evaluator for node type ${node.type}`);
  } else {
    // console.log(node);
    return nodeFn(node, sidx);
  }
}

export function evaluateNode(node: any) {
  const indexNode = findNodesByType("INDEX", node)[0];
  if (indexNode) {
    indexNode._value = _index;
  }

  return _evaluateNode([node, 0]);
}

export function buildNodes(_nodes: any) {
  const nodes = enrichNodes(_nodes);
  // graph root (geo nodes output node)
  const out = nodes.find((n) => n.type === "GROUP_OUTPUT");
  let viewer = nodes.find((n) => n.type === "VIEWER");
  viewer = viewer ? evaluateNode(viewer).compute() : null;

  if (out) {
    // hydrate graph
    const gn = evaluateNode(out);

    // execute graph
    const geometry = gn.compute();

    return { geometry, viewer };
  }
  return { viewer };
}
