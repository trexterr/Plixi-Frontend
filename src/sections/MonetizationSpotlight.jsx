const monetizationTiers = [
  {
    title: 'Creator Pass',
    price: '$4 / mo',
    features: ['Unlock custom XP multipliers', 'Drop exclusive sound bites', 'Limited pin collection'],
  },
  {
    title: 'Guild Premium',
    price: '$12 / mo',
    features: ['Run multi-channel quests', 'Advanced analytics & alerts', 'Revenue splits for staff'],
  },
  {
    title: 'Studio Suite',
    price: 'Contact us',
    features: ['Priority webhooks & API', 'Dedicated success engineer', 'Co-branded launches'],
  },
];

export default function MonetizationSpotlight() {
  return (
    <section className="panel monetization-panel" id="monetization">
      <header>
        <p className="eyebrow">Monetization</p>
        <h2>Turn hype into perks directly on mee6.xyz.</h2>
        <p>
          Launch supporter tiers, sell digital drops, and automate Discord roles the moment someone
          checks out. Mee6 keeps payments secure and perks instant.
        </p>
      </header>
      <div className="monetization-grid">
        {monetizationTiers.map((tier) => (
          <article key={tier.title}>
            <div>
              <h3>{tier.title}</h3>
              <span>{tier.price}</span>
            </div>
            <ul>
              {tier.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <button className="btn secondary">Choose plan</button>
          </article>
        ))}
      </div>
    </section>
  );
}
