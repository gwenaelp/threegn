import React from "react";
import * as rf from "reactflow";
import { Handle } from "./Handle.js";
import { Label } from "./Label.js";
import type { GraphSocket } from "../../types/GraphSocket.js";

type NodeLinkedFieldProps = {
  socket: GraphSocket;
  nodeId: string;
}

export const NodeLinkedField = React.memo(function _NodeLinkedField({
  socket,
  nodeId,
}: NodeLinkedFieldProps) {
  const { name } = socket;

  return (
    <div style={{ position: "relative", margin: "2px 0", padding: "0 12px" }}>
      <Handle
        type="target"
        socket={socket}
        position={rf.Position.Left}
        nodeId={nodeId}
      />
      <div style={{ position: "relative", display: "flex" }}>
        <Label>{name}</Label>
      </div>
    </div>
  );
});
