import { type CSSProperties, type ReactNode } from "react";
import * as st from "../styles.js";

type LabelProps = {
  style?: CSSProperties;
  children: ReactNode;
}
export function Label({ style, children }: LabelProps) {
  return (
    <div
      style={{
        padding: "2px 0",
        color: "#fff",
        fontSize: "12px",
        flex: 1,
        textShadow: st.TEXT_SHADOW,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
