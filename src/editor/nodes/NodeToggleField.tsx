import React, { type CSSProperties, type ReactNode } from "react";
import { useNodeChange } from "../hooks.js";
import * as st from "../styles.js";
import { toCamelCase } from "../text_utils.js";
import type { GraphNode } from "../../types/GraphNode.js";

type ToggleButtonProps = {
  style: CSSProperties;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}
export function ToggleButton(props: ToggleButtonProps) {
  const { style, active, onClick, children } = props;
  return (
    <button
      style={{
        background: active ? st.ACTIVE_BUTTON_BG : st.INPUT_BG,
        border: "none",
        borderRadius: st.INPUT_BORDER_RADIUS,
        padding: "3px 8px",
        color: "#fff",
        textShadow: st.TEXT_SHADOW,
        fontSize: "12px",
        flex: 1,
        width: "100%",
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
type NodeToggleFieldProps = {
  nodeId: string;
  field: string;
  value: any;
  options: any[];
  style?: CSSProperties;
}
export const NodeToggleField = React.memo(function _NodeToggleField(props: NodeToggleFieldProps) {
  const {
    nodeId,
    field,
    value,
    options,
    style,
  } = props;
  const handleChange = useNodeChange({
    nodeId,
    onChange: React.useCallback(
      (node: GraphNode, value: any) => {
        return { ...node, [field]: value };
      },
      [field]
    ),
  });

  return (
    <div
      style={{
        margin: "2px 0",
        padding: "0 12px",
        display: "flex",
        ...style,
      }}
    >
      {options.map((n, idx) => (
        <ToggleButton
          key={n}
          active={n === value}
          onClick={() => handleChange(n)}
          style={
            {
              0: {
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                margin: "0 1px 0 0",
              },
              [options.length - 1]: {
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              },
            }[idx]
          }
        >
          {toCamelCase(n)}
        </ToggleButton>
      ))}
    </div>
  );
});
