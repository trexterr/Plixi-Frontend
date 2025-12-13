export default function LoadingSkeleton({ width = '100%', height = 12 }) {
  return <span className="skeleton" style={{ width, height }} aria-hidden="true" />;
}
