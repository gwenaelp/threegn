import { memo, useCallback } from "react";
import { useNodeChange } from "../hooks.js";
import * as st from "../styles.js";
import { toCamelCase } from "../text_utils.js";

type NodeSelectFieldProps = {
  nodeId: string;
  field: any;
  value: any;
  options: any;
};
export const NodeSelectField = memo(function _NodeSelectField(props: NodeSelectFieldProps) {
  const { nodeId, field, value, options } = props;
  const handleChange = useNodeChange({
    nodeId,
    onChange: useCallback(
      (node, value) => {
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
        position: "relative",
        display: "flex",
      }}
    >
      <select
        style={{
          background: "#282828",
          border: "1px solid #3d3d3d",
          borderRadius: st.INPUT_BORDER_RADIUS,
          padding: "3px 8px",
          color: "#fff",
          textShadow: st.TEXT_SHADOW,
          fontSize: "12px",
          flex: 1,
          width: "100%",
        }}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      >
        {options.map((opt: string) => (
          <option value={opt} key={opt}>
            {toCamelCase(opt)}
          </option>
        ))}
      </select>
    </div>
  );
});
