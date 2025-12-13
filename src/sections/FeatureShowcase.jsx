import { FEATURE_PACKS } from '../data';

export default function FeatureShowcase() {
  return (
    <section className="panel feature-panel" id="levels">
      <header>
        <p className="eyebrow">All-in-one bot suite</p>
        <h2>Leveling, vibes, and monetization in one playful stack.</h2>
        <p>
          Mee6 brings XP, moderation, events, and shops together so every member journey feels curated.
          Mix and match modules with live previews inside your Discord server.
        </p>
      </header>
      <div className="feature-grid">
        {FEATURE_PACKS.map((feature) => (
          <article key={feature.title}>
            <span className="feature-pill" style={{ color: feature.accent }}>
              {feature.pill}
            </span>
            <div className="feature-icon" style={{ color: feature.accent }}>
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
