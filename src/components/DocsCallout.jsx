const VARIANT_META = {
  info: {
    icon: 'ℹ️',
    label: 'Info',
  },
  warning: {
    icon: '⚠️',
    label: 'Warning',
  },
  tip: {
    icon: '💡',
    label: 'Tip',
  },
};

export default function DocsCallout({ variant = 'info', title, body }) {
  const meta = VARIANT_META[variant] || VARIANT_META.info;

  return (
    <div className={`docs-callout docs-callout--${variant}`} role="note">
      <div className="docs-callout__icon" aria-hidden="true">
        {meta.icon}
      </div>
      <div>
        <p className="docs-callout__title">{title || meta.label}</p>
        <p>{body}</p>
      </div>
    </div>
  );
}
