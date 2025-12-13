export default function Tooltip({ label, children }) {
  return (
    <span className="tooltip" role="tooltip">
      {children}
      <span className="tooltip__bubble">{label}</span>
    </span>
  );
}
