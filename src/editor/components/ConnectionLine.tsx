import React from "react";
import * as rf from "reactflow";
import * as st from "../styles";
import { useNodeByID } from "../NodesContext";
import { useHandle } from "../HandleContext";
import type { Position } from "reactflow";

type ConnectionLineProps = {
  fromX: number;
  fromY: number;
  fromPosition: Position;
  toX: number;
  toY: number;
  toPosition: Position;
  connectionLineType: any;
  connectionLineStyle: any;
  fromHandle: any;
  fromNode: any;
}

export function ConnectionLine(props: ConnectionLineProps) {
  const { fromX, fromY, fromPosition, toX, toY, toPosition, connectionLineType, connectionLineStyle, fromHandle, fromNode } = props;

  const [node, _] = useNodeByID(fromNode.id);
  const { zoom } = rf.useViewport();
  const [handlePos] = useHandle();

  const lineColor = React.useMemo(() => {
    if (!node) throw 'node not found';
    const socket = node.outputs.find((out: { identifier: any; }) => out.identifier === fromHandle.id);
    return socket ? st.SOCKET_COLORS[socket.type] : undefined;
  }, [fromNode.id]);

  const [dAttr] = rf.getBezierPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: handlePos ? handlePos.x : toX,
    targetY: handlePos ? handlePos.y : toY,
    targetPosition: toPosition,
  });

  return (
    <g className="react-flow__connection">
      <path
        fill="none"
        stroke={lineColor}
        strokeWidth={3 / zoom}
        style={connectionLineStyle}
        d={dAttr}
      />
    </g>
  );
}
