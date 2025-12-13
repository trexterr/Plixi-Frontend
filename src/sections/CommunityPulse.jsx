import { COMMUNITY_SIGNALS } from '../data';

export default function CommunityPulse() {
  return (
    <section className="panel community-panel" id="community">
      <header>
        <p className="eyebrow">Community pulse</p>
        <h2>Mee6 helps fandoms, DAOs, and study squads feel alive 24/7.</h2>
        <p>
          Instantly sync Discord channels with mee6.xyz dashboards so teams can react to spikes in
          activity, reward loyalty, and celebrate every milestone.
        </p>
      </header>
      <div className="community-grid">
        {COMMUNITY_SIGNALS.map((signal) => (
          <article key={signal.label}>
            <span>{signal.label}</span>
            <h3>{signal.value}</h3>
            <p>{signal.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
