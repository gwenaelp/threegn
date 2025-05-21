import ReactDOM from "react-dom/client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as rf from "reactflow";
import "reactflow/dist/style.css";
import { edgeTypes } from "./edge_types";
import { nodeComponentTypes } from "./node_types";
import { NodesContextProvider, useNodes } from "./NodesContext";
import { HandleContextProvider } from "./HandleContext";
import {
  useSocketConnect,
  applyEdgeChangeToNodes,
  useSyncNodesState,
  useEventListener,
  useApplyNodes,
} from "./hooks";
import { FilePicker } from "./components/FilePicker";
import { Button } from "./components/Button";
import { AddNodeMenu } from "./components/AddNodeMenu";
import {
  addID,
  createRFNode,
  loadDefaultNodes,
  saveAsFile,
  openFile,
  createNodeName,
  cloneNode,
} from "./node_utils";
import { ConnectionLine } from "./components/ConnectionLine";
import { useNodeIntersectsEdges } from "./edge_utils";
import { log } from "./log";
import { Help } from "./Help";
import { buildNodes, evaluateNode } from "../evaluator";
import type { GraphNode } from "../types/GraphNode";

function EditorUI({ onAddNode }: { onAddNode: (nodeType: string) => void }) {
  const [nodes, _] = useNodes();
  const rfv = rf.useReactFlow();
  const [displayAddMenu, setDisplayAddMenu] = React.useState(false);
  const closeMenu = React.useCallback(() => setDisplayAddMenu(false), []);
  const applyNodes = useApplyNodes();

  useEventListener(document, "keydown", (e: KeyboardEvent) => {
      if (e.key === "A" && e.shiftKey) {
        setDisplayAddMenu(true);
      }
    },
    false,
    [setDisplayAddMenu]
  );

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Button
          style={{
            padding: "1px 6px",
            fontSize: "19px",
          }}
          onClick={() => setDisplayAddMenu(!displayAddMenu)}
          active={displayAddMenu}
        >
          +
        </Button>
        <Button
          style={{
            padding: "5px 6px",
            margin: "0 8px",
            fontSize: "12px",
          }}
          onClick={() => {
            const shouldCreate = confirm("Make sure to save the project before creating a new one");
            if (shouldCreate) {
              loadDefaultNodes().then(applyNodes);
            }
          }}
        >
          New Document
        </Button>
        <Button
          style={{
            padding: "5px 6px",
            fontSize: "12px",
          }}
          onClick={() => {
            const fileName = prompt("Enter file name");
            if (fileName !== null) {
              saveAsFile({ nodes, rfNodes: rfv.getNodes(), fileName });
            }
          }}
        >
          Save
        </Button>
        <Button
          style={{
            padding: "5px 6px",
            fontSize: "12px",
            margin: "0 8px",
          }}
          onClick={() => { openFile().then(applyNodes); }}
        >
          Open
        </Button>
        <Button
          style={{
            padding: "5px 6px",
            fontSize: "12px",
            margin: "0 8px",
          }}
          onClick={() => {
            console.log('rfNodes', rfv.getNodes());
            let { geometry } = buildNodes(rfv.getNodes());
            console.log('geometry', geometry)
          }}
        >
          LOG GRAPH
        </Button>
      </div>
      {displayAddMenu ? (
        <AddNodeMenu onClose={closeMenu} onAddNode={onAddNode} />
      ) : null}
    </>
  );
}

const deleteKeyCode = ["Backspace", "x"];

function EditorCanvas({ defaultNodes }) {
  const [nodes, setNodes] = useNodes();
  const [rfNodes, _2, onNodesChange] = rf.useNodesState([]);
  const [edges, _3, onEdgesChange] = rf.useEdgesState([]);

  useSyncNodesState({ setNodes, nodes: rfNodes });

  if (_DEBUG_) {
    React.useEffect(() => {
      const rfNode = rfNodes.find((n) => n.selected);
      if (rfNode && nodes) {
        const node = nodes.find((n) => n.id === rfNode.id);
        if (node) {
          (window as any).inspectOutput = function () {
            return evaluateNode(node).compute();
          };
        }
      }
    }, [nodes, rfNodes]);
  }

  const handleEdgesChange = useCallback(
    (changes: rf.EdgeChange[]) => {
      const removeSet = new Set(
        changes.filter((c) => c.type === "remove").map((c) => c.id)
      );

      const ops = edges
        .filter((e) => removeSet.has(e.id))
        .map((params) => ({ params, op: "remove" }));

      applyEdgeChangeToNodes(setNodes, ops);

      onEdgesChange(changes);
    },
    [onEdgesChange, setNodes, edges]
  );

  const onConnect = useSocketConnect();

  const ref = useRef<HTMLElement>(null);
  const rfv = rf.useReactFlow();

  const onAddNode = React.useCallback(
    (nodeType: string) => {
      log("onAddNode");
      // create geo node from default set
      const node = addID({
        ...defaultNodes[nodeType],
      });

      // compute node's initial position on canvas
      if(!ref.current) throw 'ref undefined';

      const bbox = ref.current.getBoundingClientRect();
      const { x, y } = rfv.project({
        x: bbox.width / 2,
        y: bbox.height / 2,
      });
      node.location = [x, -y];

      // adding node name with incremental index
      node.name = createNodeName(nodes, node.name);

      // add geo node to nodes index
      setNodes((nodes) => nodes.concat([node]));

      // create and add RF node
      rfv.setNodes((nodes) => nodes.concat([createRFNode(node)]));
    },
    [defaultNodes, nodes]
  );

  useEventListener(document, "keydown", (e: KeyboardEvent) => {
      if (e.key === "D" && e.shiftKey) {
        const selectedNode = rfNodes.find((n) => n.selected);
        if (selectedNode) {
          log("duplicate node");
          const node = nodes.find((n) => n.id === selectedNode.id);

          if(!node) throw 'node not found';

          const clonedNode = cloneNode(nodes, node);
          setNodes((nodes) => nodes.concat([clonedNode]));
          rfv.setNodes((nodes) =>
            nodes
              .map((n) =>
                n.id === selectedNode.id ? { ...n, selected: false } : n
              )
              .concat([{ ...createRFNode(clonedNode), selected: true }])
          );
        }
      }
    },
    false,
    [rfNodes, nodes]
  );

  const nodeIntersectsEdges = useNodeIntersectsEdges();

  return (
    <>
      <rf.default
        ref={ref}
        nodes={rfNodes}
        edges={edges}
        nodeTypes={nodeComponentTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={ConnectionLine}
        onNodesChange={onNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={(_, node) => {
          // TODO: connect nodes
          nodeIntersectsEdges(node, edges);
        }}
        minZoom={0.3}
        maxZoom={1}
        deleteKeyCode={deleteKeyCode}
        proOptions={{ hideAttribution: true }}
        connectOnClick={false}
        selectionKeyCode={null}
        multiSelectionKeyCode={null}
        zoomActivationKeyCode={null}
        onlyRenderVisibleElements
        disableKeyboardA11y
      >
        {/* <rf.MiniMap /> */}
        <rf.Background color="#282828" size={2} />
      </rf.default>
      <EditorUI onAddNode={onAddNode} />
    </>
  );
}

function Editor({ defaultNodes }: { defaultNodes: GraphNode[] }) {
  const [nodes, _] = useNodes();
  const [error, setError] = React.useState(null);

  return (
    <>
      <EditorCanvas defaultNodes={defaultNodes} />
      {nodes ? null : <FilePicker onError={console.error} />}
    </>
  );
}

function EditorRoot({ onNodesChange, defaultNodes }: { onNodesChange: (nodes: GraphNode[]) => void, defaultNodes: GraphNode[] }) {
  const [nodes, setNodes] = useState<GraphNode[]>();
  const [handle, setHandle] = useState(null);

  // eval geo nodes on change
  useEffect(() => {
    if (nodes) {
      onNodesChange(nodes);
    }
    (window as any)._nodes = nodes;
  }, [onNodesChange, nodes]);

  return (
    <>
      <NodesContextProvider value={[nodes, setNodes]}>
        <rf.ReactFlowProvider>
          <HandleContextProvider value={[handle, setHandle]}>
            <Editor defaultNodes={defaultNodes} />
          </HandleContextProvider>
        </rf.ReactFlowProvider>
      </NodesContextProvider>
      <Help />
    </>
  );
}

export function render({ onNodesChange, defaultNodes }) {
  ReactDOM.createRoot(document.getElementById("editor")).render(
    <EditorRoot onNodesChange={onNodesChange} defaultNodes={defaultNodes} />
  );
}
