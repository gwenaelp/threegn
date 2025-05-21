import { memo, useCallback, type CSSProperties } from "react";
import * as rf from "reactflow";
import { useNodeSocketChange } from "../hooks.js";
import { Handle } from "./Handle.js";
import * as st from "../styles.js";
import type { GraphSocket } from "../../types/GraphSocket.js";

type NodeCheckboxFieldProps = {
  style: CSSProperties;
  inputStyle: CSSProperties;
  socket: GraphSocket;
  nodeId: string;
};

export const NodeCheckboxField = memo(function _NodeCheckboxField(props: NodeCheckboxFieldProps) {
  const { style, inputStyle, socket, nodeId } = props;

  const { value, name } = socket;
  const id = `${name}/${Math.random()}`;

  const handleChange = useNodeSocketChange({
    nodeId,
    socketId: socket.identifier,
    onChange: useCallback((e) => e.target.checked),
  });

  return (
    <div
      style={{
        margin: "4px 0",
        padding: "0 12px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        ...style,
      }}
    >
      <Handle
        type="target"
        socket={socket}
        nodeId={nodeId}
        position={rf.Position.Left}
      />
      <input
        style={{
          appearance: value ? null : "none",
          background: st.INPUT_BG,
          border: "none",
          borderRadius: st.CHECKBOX_BORDER_RADIUS,
          width: 14,
          height: 14,
          margin: "0 4px 0 0",
          ...inputStyle,
        }}
        id={id}
        type="checkbox"
        onChange={handleChange}
        checked={value}
      />
      <label
        style={{
          color: "#fff",
          fontSize: "12px",
          textShadow: st.TEXT_SHADOW,
        }}
        htmlFor={id}
      >
        {name}
      </label>
    </div>
  );
});
