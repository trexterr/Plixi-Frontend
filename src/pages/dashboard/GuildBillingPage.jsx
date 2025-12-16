import SectionHeader from '../../components/SectionHeader';
import useGuildSettings from '../../hooks/useGuildSettings';

export default function GuildBillingPage() {
  const { guild, saveGuild, selectedGuild, lastSaved } = useGuildSettings();

  return (
    <div className="page-stack guild-dashboard">
      <SectionHeader
        eyebrow="Guild Dashboard"
        title="Billing & Premium"
        subtitle={`Review plan details and perks for ${selectedGuild?.name ?? 'your guild'}.`}
        meta={<span className="status-pill">Billing</span>}
      />

      <section className="dashboard-subsection">
        <header className="dashboard-subsection__head">
          <p className="eyebrow">Billing</p>
          <h2>Plan & perks</h2>
          <p>Understand your current tier, locks, and benefits.</p>
        </header>
        <div className="billing-panel">
          <header>
            <span className="icon" aria-hidden="true">
              💎
            </span>
            <div>
              <h3>Premium & billing</h3>
              <p>Current tier, locks, and perks.</p>
            </div>
            <span className="status-pill">{guild.billing.plan}</span>
          </header>
          <div className="plan-pill">{guild.billing.plan}</div>
          <p className="helper-text">Upgrade for animations, hero slots, and concierge support.</p>
          <div className="split">
            <div>
              <strong>Feature locks</strong>
              <ul>
                {guild.billing.featureLocks.map((lock) => (
                  <li key={lock}>{lock}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Perks</strong>
              <ul>
                {guild.billing.perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="button-row">
            <button type="button" className="ghost-btn">
              Cancel plan
            </button>
            <button type="button" className="primary-btn">
              Upgrade plan
            </button>
          </div>
        </div>
      </section>

      <div className="page-actions">
        <div>
          <span>Last saved</span>
          <strong>{lastSaved ? new Date(lastSaved).toLocaleString() : 'Not yet saved'}</strong>
        </div>
        <button type="button" className="primary-btn" onClick={() => saveGuild('Billing settings saved')}>
          Save changes
        </button>
      </div>
    </div>
  );
}
