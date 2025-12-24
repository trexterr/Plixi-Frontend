const formatCurrency = (amount) => amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function PricingCard({ plan, billing, emphasized }) {
  const rate = billing === 'yearly' ? plan.yearly : plan.monthly;
  const afterRate = billing === 'yearly' ? plan.yearlyAfter : plan.monthlyAfter;
  const detailLine =
    billing === 'yearly'
      ? `$${formatCurrency(rate * 12)} first year · $${formatCurrency(afterRate * 12)} after`
      : `$${rate} first month · $${afterRate} after`;
  const planKey = `${plan.id}_${billing}`;

  return (
    <article className={`pricing-card ${emphasized ? 'is-featured' : ''}`}>
      {plan.badge && <span className="pricing-badge">{plan.badge}</span>}
      <header>
        <h3>{plan.name}</h3>
        <div className="price">
          <span className="amount">${rate}</span>
          <span className="period">/mo</span>
        </div>
        <small className="pricing-subline">{detailLine}</small>
      </header>
      <ul>
        {plan.features.map((feature) => (
          <li key={feature.label} className={feature.included ? '' : 'muted'}>
            <span aria-hidden="true">{feature.included ? '✔' : '✖'}</span>
            {feature.label}
          </li>
        ))}
      </ul>
      <form action="/api/stripe/create-checkout-session" method="POST">
        <input type="hidden" name="planKey" value={planKey} />
        <button className="primary-btn" type="submit">
          Get the {plan.name} plan
        </button>
      </form>
    </article>
  );
}
