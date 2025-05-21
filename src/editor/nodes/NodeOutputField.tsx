import React from "react";
import * as rf from "reactflow";
import { Handle } from "./Handle.js";
import { Label } from "./Label.js";
import type { GraphSocket } from "../../types/GraphSocket.js";

type NodeOutputFieldProps = {
  socket: GraphSocket;
  nodeId: string;
};

export const NodeOutputField = React.memo(function _NodeOutputField({
  socket,
  nodeId,
}: NodeOutputFieldProps) {
  const { name } = socket;
  return (
    <div style={{ position: "relative", margin: "2px 0", padding: "0 12px" }}>
      <div style={{ position: "relative", display: "flex" }}>
        <Label style={{ textAlign: "right" }}>{name}</Label>
      </div>
      <Handle
        type="source"
        socket={socket}
        position={rf.Position.Right}
        nodeId={nodeId}
      />
    </div>
  );
});
