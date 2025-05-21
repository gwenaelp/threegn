import React, { type ReactNode, useRef, type CSSProperties, useEffect } from "react";
import * as st from "../styles.js";

type NodeBaseInputFieldProps = {
  type?: string;
  value: any;
  label: string;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  onChange: any;
  onPointerDown: () => void;
  onPointerLeave: () => void;
  children?: ReactNode;
}

export const NodeBaseInputField = React.memo(function _NodeBaseInputField(props: NodeBaseInputFieldProps) {
  const { type, value, label, style, inputStyle, onChange, onPointerDown, onPointerLeave, children } = props;
  const [_value, setValue] = React.useState(value);
  const [labelVisible, setLabelVisible] = React.useState(true);
  const ref = useRef<HTMLInputElement>(null);

  function handleChange(e: any) {
    const v = e.target.value.trim();

    // INT type field
    if (type === "INT") {
      const value = parseInt(v, 10);
      if (Number.isInteger(value)) {
        setValue(value.toString());
      }
    } else {
      // disallow non-numeric chars, excluding dot
      if (/^-?[0-9]*\.?[0-9]*$/.test(v)) {
        setValue(v);
      }
    }
  }

  useEffect(() => {
    setValue(value);
  }, [value]);

  // handles number visual representation
  // and precision
  useEffect(() => {
    if (_value === "") {
      onChange(0);
    } else if (labelVisible) {
      // INT type field
      if (type === "INT") {
        onChange(parseInt(_value, 10));
      } else {
        const n = parseFloat(_value);
        const v = n.toString();
        const [a, b] = v.split(".");
        if (b === undefined) {
          onChange(n);
        } else if (b.length > 0) {
          onChange(parseFloat(`${a}.${b.substring(0, 3)}`));
        }
      }
    }
  }, [labelVisible]);

  React.useEffect(() => {
    if (!labelVisible) {
      ref.current?.select();
    }
  }, [labelVisible]);

  return (
    <div
      style={{
        margin: "2px 0",
        padding: "0 12px",
        position: "relative",
        display: "flex",
        ...style,
      }}
    >
      {children}
      <input
        style={{
          background: st.INPUT_BG,
          border: "none",
          borderRadius: st.INPUT_BORDER_RADIUS,
          padding: "3px 8px",
          color: "#fff",
          textShadow: st.TEXT_SHADOW,
          fontSize: "12px",
          textAlign: labelVisible ? "right" : "left",
          flex: 1,
          width: "100%",
          ...inputStyle,
        }}
        ref={ref}
        onChange={handleChange}
        onFocus={() => setLabelVisible(false)}
        onBlur={() => setLabelVisible(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            ref.current?.blur();
          }
        }}
        onPointerDown={onPointerDown}
        onPointerLeave={onPointerLeave}
        value={_value}
      />
      {labelVisible ? (
        <div
          style={{
            position: "absolute",
            color: "#fff",
            fontSize: "12px",
            zIndex: 1,
            top: 3,
            left: 24,
            textShadow: st.TEXT_SHADOW,
          }}
          onClick={() => {
            ref.current?.focus();
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
});
