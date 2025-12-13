export default function SectionHeader({ eyebrow, title, subtitle, meta }) {
  return (
    <header className="section-header">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {meta && <div className="section-meta">{meta}</div>}
    </header>
  );
}
