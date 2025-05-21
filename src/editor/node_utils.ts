import * as rf from "reactflow";
import type { GraphNode } from "../types/GraphNode";
import type { GraphEdge } from "../types/GraphEdge";
import type { GraphLink } from "../types/GraphLink";

// adds a global id to a node
let id = 0;
export function addID(node: GraphNode) {
  return { ...node, id: (++id).toString() };
}

// created RF node from Geo node
export function createRFNode(node: GraphNode) {
  return {
    id: node.id,
    type: node.type,
    position: { x: node.location[0], y: -node.location[1] },
  };
}

// replace node names in input links with node refs
export function enrichNodes(nodes: GraphNode[]) {
  // by name index
  const nodesByName: Record<string, GraphNode> = nodes.reduce((ret: Record<string, GraphNode>, n) => {
    ret[n.name] = n;
    return ret;
  }, {});

  // ref graph
  nodes.forEach((node) => {
    node.inputs.forEach((n) => {
      n.links.forEach((l: { node: GraphNode; }) => {
        l.node = nodesByName[typeof l.node === "string" ? l.node : l.node.name];
      });
    });
  });
  return nodes;
}

// creates node name with index part derived from existing nodes and default node name
export function createNodeName(nodes: GraphNode[], nodeName: string) {
  const nidx = nodes
    .map((n: GraphNode) => n.name)
    .filter((n: string) => n.startsWith(nodeName))
    .map((n: string) => parseInt((n.match(/\.([0-9]+)$/) || [])[1], 10))
    .sort((a: number, b: number) => b - a)[0];

  if (nidx === undefined) {
    return nodeName;
  } else {
    const nidxs = (Number.isNaN(nidx) ? 1 : nidx).toString();
    const idx = ["0", "0", "0"]
      .map((ch, idx) => nidxs[idx] || ch)
      .reverse()
      .join("");
    return `${nodeName}.${idx}`;
  }
}

// clones geo node
export function cloneNode(nodes: GraphNode[], node: GraphNode) {
  const retNode = addID({ ...node }); // add id
  retNode.name = createNodeName(nodes, retNode.name); // add name
  // reset links
  retNode.inputs = retNode.inputs.map((n) => ({ ...n, links: [] }));
  retNode.outputs = retNode.outputs.map((n) => ({ ...n, links: [] }));
  // shift location
  const offset = 32;
  retNode.location = [
    retNode.location[0] + offset,
    retNode.location[1] - offset,
  ];
  return retNode;
}

// takes raw geo nodes and returns prepared geo and rf nodes
export function computeNodes(nodes: GraphNode[]) {
  const geoNodes = enrichNodes(nodes.map((node) => addID(node)));
  const rfState = createRFState(geoNodes);
  return { geoNodes, rfState };
}

// loads default project
export function loadDefaultNodes() {
  return Promise.resolve(computeNodes((window as any).default_project));
}

// generates project file and triggers in-browser download
export function saveAsFile({ nodes, rfNodes, fileName }: { nodes: GraphNode[], rfNodes: any, fileName: string }) {
  const nnodes = nodes.map((node) => {
    const { x, y } = rfNodes.find((n: GraphNode) => n.id === node.id).position;
    const inputs = node.inputs.map((n) => {
      const links = n.links.map((l: GraphLink) => ({
        ...l,
        node: typeof l.node === "object" ? l.node.name : l.node.name,
      }));
      return { ...n, links };
    });
    return { ...node, location: [x, -y], inputs };
  });
  const str = JSON.stringify(nnodes);
  const file = new File([str], `${fileName}.json`, {
    type: "application/json",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(file);
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function edgeToId(edge: GraphEdge) {
  return `e${edge.source}(${edge.sourceHandle})-${edge.target}(${edge.targetHandle})`;
}

export function createEdge(edge: Partial<GraphEdge>): GraphEdge {
  const { source, target, sourceHandle, targetHandle, data } = edge;
  const res = {
    id: '',
    source,
    target,
    sourceHandle,
    targetHandle,
    type: "custom",
    data,
  }
  res.id = edgeToId(res);
  return res;
}

export function createRFState(_nodes: GraphNode[]) {
  const nodes = _nodes.map((n) => createRFNode(n));

  const nodesByName: Record<string, GraphNode> = _nodes.reduce((ret: Record<string, GraphNode>, n) => {
    ret[n.name] = n;
    return ret;
  }, {});

  const edges = _nodes.flatMap((n) => {
    const id = n.id;
    const outputEdges = n.outputs
      .filter((n) => n.links.length !== 0)
      .flatMap((n) =>
        n.links.map((l: GraphLink) => {
          const nodeName = typeof l.node === 'string' ? l.node : l.node.name;
          const ln = nodesByName[nodeName];
          const socketIdentifier = typeof l.socket === 'string' ? l.socket : l.socket.identifier;
          const targetSocket = ln.inputs.find((input) => input.identifier === socketIdentifier);
          return createEdge({
            source: id,
            target: ln.id,
            sourceHandle: n.identifier,
            targetHandle: l.socket,
            data: {
              sourceSocket: { type: n.type, shape: n.display_shape },
              targetSocket: {
                type: targetSocket?.type,
                shape: targetSocket?.display_shape,
              },
            },
          });
        })
      );

    return outputEdges;
  });

  return [nodes, edges];
}

export function openFile() {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.addEventListener("change", (e: any) => {
      const file = e.target?.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
          if (typeof reader.result === 'string') {
            resolve(computeNodes(JSON.parse(reader.result)));
          } else {
            reject('reader result is not string');
          }
        },
        false
      );
      reader.readAsText(file);
    });
    input.click();
  });
}

export function getNodeData(node: GraphNode) {
  const handleBounds = node?.[rf.internalsSymbol]?.handleBounds || null;
  const isInvalid =
    !node ||
    !handleBounds ||
    !node.width ||
    !node.height ||
    typeof node.positionAbsolute?.x === "undefined" ||
    typeof node.positionAbsolute?.y === "undefined";
  return [
    {
      x: node?.positionAbsolute?.x || 0,
      y: node?.positionAbsolute?.y || 0,
      width: node?.width || 0,
      height: node?.height || 0,
    },
    handleBounds,
    !isInvalid,
  ];
}
