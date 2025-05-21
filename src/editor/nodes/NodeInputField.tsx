import React, { useCallback, useEffect, useRef } from "react";
import * as rf from "reactflow";
import { Handle } from "./Handle";
import { useNodeSocketChange } from "../hooks";
import { NodeBaseInputField } from "./NodeBaseInputField";
import type { GraphSocket } from "../../types/GraphSocket";

type NodeInputFieldProps = {
  socket: GraphSocket;
  nodeId: string;
  isConstant: boolean;
  onFocus: () => void;
  onBlur: () => void;
};

export const NodeInputField = React.memo(function _NodeInputField(props: NodeInputFieldProps) {
  const { socket, nodeId, isConstant, onFocus, onBlur } = props;
  const { value, name } = socket;

  const handleChange = useNodeSocketChange({
    nodeId,
    isConstant,
    socketId: socket.identifier,
    onChange: useCallback((v) => v),
  });

  const [labelVisible, setLabelVisible] = React.useState(true);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!labelVisible) {
      ref.current?.select();
    }
  }, [labelVisible]);

  const handle = React.useMemo(
    () => (
      <Handle
        type="target"
        socket={socket}
        nodeId={nodeId}
        position={rf.Position.Left}
      />
    ),
    [socket, nodeId]
  );

  return (
    <NodeBaseInputField
      value={value}
      label={name}
      type={socket.type}
      onChange={handleChange}
      onPointerDown={onFocus}
      onPointerLeave={onBlur}
    >
      {isConstant ? null : handle}
    </NodeBaseInputField>
  );
});
