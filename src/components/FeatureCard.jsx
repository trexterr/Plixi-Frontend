export default function FeatureCard({
  module,
  state,
  isPremiumGuild,
  onToggle,
  onModeChange,
  onConfigure,
}) {
  const enabled = state?.enabled ?? false;
  const mode = state?.mode ?? module.modes?.[0] ?? 'auto';
  const locked = module.premium && !isPremiumGuild;

  return (
    <article className={`feature-card ${enabled ? 'is-active' : ''} ${locked ? 'is-locked' : ''}`}>
      <div className="feature-card__icon" aria-hidden="true">
        {module.icon}
      </div>
      <div className="feature-card__content">
        <div className="feature-card__heading">
          <div>
            <h3>{module.title}</h3>
            <p>{module.description}</p>
          </div>
          <span className="pill">{module.pill}</span>
        </div>
        <div className="feature-card__status">
          <span className={`status-pill ${enabled ? 'success' : ''}`}>
            {enabled ? 'Active' : 'Disabled'}
          </span>
          {locked && <span className="premium-lock">👑 Premium required</span>}
        </div>
        <div className="feature-card__controls">
          <button type="button" className="ghost-btn" onClick={onToggle} disabled={locked}>
            {enabled ? 'Disable' : 'Enable'}
          </button>
          <button type="button" className="primary-btn" onClick={onConfigure} disabled={locked}>
            {enabled ? 'Configure' : 'Configure'}
          </button>
          <select
            value={mode}
            onChange={(event) => onModeChange(event.target.value)}
            disabled={!enabled || locked}
          >
            {(module.modes ?? ['auto']).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {enabled && (
          <div className="feature-card__preview">
            <p>
              Running in <strong>{mode}</strong> mode. Members will see updated flows immediately.
            </p>
          </div>
        )}
      </div>
      {locked && (
        <div className="feature-card__overlay">
          <p>Upgrade to Plixi Premium to unlock this module.</p>
        </div>
      )}
    </article>
  );
}
