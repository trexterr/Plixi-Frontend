import { HERO_STATS } from '../data';

export default function Hero() {
  return (
    <section className="panel hero-panel" id="hero">
      <div className="hero-copy">
        <p className="eyebrow">Mee6 for next-gen Discord worlds</p>
        <h1>Automate every moment your community loves.</h1>
        <p className="lede">
          Mee6 keeps chats welcoming, levels buzzing, and drops monetized in one playful co-pilot.
          Craft quests, events, and moderation flows right inside mee6.xyz—no scripts required.
        </p>
        <div className="hero-actions">
          <button className="btn primary">Summon Mee6</button>
          <button className="btn secondary">Tour the dashboard</button>
        </div>
      </div>
      <div className="hero-stats">
        {HERO_STATS.map((stat) => (
          <article key={stat.label}>
            <span>{stat.value}</span>
            <p>{stat.label}</p>
          </article>
        ))}
      </div>
      <div className="hero-glow hero-glow-one" aria-hidden="true" />
      <div className="hero-glow hero-glow-two" aria-hidden="true" />
    </section>
  );
}
