import { memo, useCallback } from "react";
import * as rf from "reactflow";
import { Handle } from "./Handle.js";
import { NodeBaseInputField } from "./NodeBaseInputField.js";
import { Label } from "./Label.js";
import { useNodeSocketChange } from "../hooks.js";
import type { GraphSocket } from "../../types/GraphSocket.js";

const m0 = { marginBottom: 0 };
const mb1 = { marginBottom: 1 };
const bb0 = { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 };
const bt0 = { borderTopLeftRadius: 0, borderTopRightRadius: 0 };
type NodeVectorInputProps = {
  socket: GraphSocket;
  nodeId: string;
  isConstant?: boolean
  onFocus: () => void;
  onBlur: () => void;
};
export const NodeVectorInput = memo(function _NodeVectorInput(props: NodeVectorInputProps) {
  const { socket, nodeId, isConstant, onFocus, onBlur } = props;

  const { value, name } = socket;
  const [x, y, z] = value;

  const handleChange = useNodeSocketChange({
    isConstant: isConstant || false,
    nodeId,
    socketId: socket.identifier,
    onChange: useCallback(
      (idx: number, v: any) => {
        const ret = [x, y, z];
        ret[idx] = v;
        return ret;
      },
      [x, y, z]
    ),
  });

  const handleChangeX = useCallback(
    (e: any) => handleChange(0, e),
    [handleChange]
  );
  const handleChangeY = useCallback(
    (e: any) => handleChange(1, e),
    [handleChange]
  );
  const handleChangeZ = useCallback(
    (e: any) => handleChange(2, e),
    [handleChange]
  );

  return (
    <>
      <div style={{ margin: "2px 0", padding: "0 12px" }}>
        <Label>{`${name}:`}</Label>
      </div>
      <div style={{ position: "relative" }}>
        {!isConstant ? (
          <Handle
            type="target"
            socket={socket}
            position={rf.Position.Left}
            nodeId={nodeId}
          />
        ) : null}
        <NodeBaseInputField
          value={x}
          label={"X"}
          style={m0}
          inputStyle={bb0}
          onChange={handleChangeX}
          onPointerDown={onFocus}
          onPointerLeave={onBlur}
        />
        <NodeBaseInputField
          value={y}
          label={"Y"}
          style={mb1}
          inputStyle={{ borderRadius: 0 }}
          onChange={handleChangeY}
          onPointerDown={onFocus}
          onPointerLeave={onBlur}
        />
        <NodeBaseInputField
          value={z}
          label={"Z"}
          style={m0}
          inputStyle={bt0}
          onChange={handleChangeZ}
          onPointerDown={onFocus}
          onPointerLeave={onBlur}
        />
      </div>
    </>
  );
});
