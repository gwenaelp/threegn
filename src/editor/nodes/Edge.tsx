import * as rf from "reactflow";
import * as st from "../styles.js";
import type { CSSProperties } from "react";
import type { GraphSocket } from "../../types/GraphSocket.js";

type EdgeProps = {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: rf.Position;
  targetPosition: rf.Position;
  style: CSSProperties;
  data: { sourceSocket: GraphSocket; targetSocket: GraphSocket; };
  markerEnd: string;
  selected: boolean;
};

export function Edge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, data, markerEnd, selected } = props;

  const [edgePath] = rf.getBezierPath({
    sourceX: sourceX - 8,
    sourceY: sourceY + (data.sourceSocket.shape.startsWith("DIAMOND") ? 2 : 0),
    sourcePosition,
    targetX: targetX + 8,
    targetY: targetY + (data.targetSocket.shape.startsWith("DIAMOND") ? 2 : 0),
    targetPosition,
  });

  const { zoom } = rf.useViewport();

  // const eid = `edge-${id}`;

  // TODO: Figure out how to use gradient
  // $(
  //   "defs",
  //   {},
  //   $(
  //     "linearGradient",
  //     {
  //       id: eid,
  //       x1: "0%",
  //       y1: "0%",
  //       x2: "100%",
  //       y2: "0%",
  //     },
  //     $("stop", {
  //       offset: "0%",
  //       stopColor: st.SOCKET_COLORS[data.sourceSocket.type],
  //     }),
  //     $("stop", {
  //       offset: "100%",
  //       stopColor: st.SOCKET_COLORS[data.targetSocket.type],
  //     })
  //   )
  // )

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        strokeWidth: 3 / zoom,
        stroke: selected ? "#fff" : st.SOCKET_COLORS[data.sourceSocket.type],
      }}
    ></path>
  );
}
