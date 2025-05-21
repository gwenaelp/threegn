import { HEADER_COLORS, TEXT_SHADOW } from '../styles'

type NodeHeaderProps = {
  type: keyof typeof HEADER_COLORS;
  label: string;
}
export function NodeHeader(props: NodeHeaderProps) {
  const { label, type } = props;
  return (
    <div
      style={{
        background: HEADER_COLORS[type],
        color: "#fff",
        padding: "4px 12px",
        fontSize: "12px",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        boxShadow: "inset 0 -1px rgba(0,0,0,0.4)",
        textShadow: TEXT_SHADOW,
      }}
    >
      {label}
    </div>
  );
}
