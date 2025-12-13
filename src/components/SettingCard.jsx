export default function SettingCard({
  title,
  description,
  badge,
  children,
  actions,
  locked = false,
  lockLabel = 'Premium',
  subtle = false,
}) {
  return (
    <section className={`setting-card ${subtle ? 'is-subtle' : ''} ${locked ? 'is-locked' : ''}`}>
      <div className="setting-card__info">
        <div className="setting-card__heading">
          <div>
            <h3>{title}</h3>
            {description && <p>{description}</p>}
          </div>
          {badge && <span className="pill">{badge}</span>}
        </div>
        <div className="setting-card__body">{children}</div>
      </div>
      {actions && <div className="setting-card__actions">{actions}</div>}
      {locked && (
        <div className="setting-card__lock">
          <span>{lockLabel}</span>
          <p>Upgrade this server to Plixi Premium to unlock the control.</p>
        </div>
      )}
    </section>
  );
}
