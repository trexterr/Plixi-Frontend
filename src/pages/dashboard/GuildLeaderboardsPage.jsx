import SectionHeader from '../../components/SectionHeader';
import ToggleSwitch from '../../components/ToggleSwitch';
import ModuleCard from '../../components/ModuleCard';
import useGuildSettings from '../../hooks/useGuildSettings';

const CADENCES = ['daily', 'weekly', 'monthly', 'yearly', 'seasonal'];

export default function GuildLeaderboardsPage() {
  const { guild, updateGuild, saveGuild, selectedGuild, lastSaved } = useGuildSettings();

  const toggleCadence = (cadence) => {
    updateGuild((prev) => {
      const exists = prev.leaderboards.cadences.includes(cadence);
      return {
        ...prev,
        leaderboards: {
          ...prev.leaderboards,
          cadences: exists
            ? prev.leaderboards.cadences.filter((entry) => entry !== cadence)
            : [...prev.leaderboards.cadences, cadence],
        },
      };
    });
  };

  return (
    <div className="page-stack guild-dashboard">
      <SectionHeader
        eyebrow="Guild Dashboard"
        title="Leaderboards"
        subtitle={`Expose cadences and rankings for ${selectedGuild?.name ?? 'your guild'}.`}
        meta={<span className="status-pill">Leaderboards</span>}
      />

      <div className="card-grid">
        <ModuleCard
          icon="🏆"
          title="Leaderboards"
          description="Currency, items, and cadence toggles."
          status={guild.leaderboards.enabled ? 'Active' : 'Disabled'}
        >
          <ToggleSwitch
            label="Enable leaderboards"
            checked={guild.leaderboards.enabled}
            onChange={(value) =>
              updateGuild((prev) => ({ ...prev, leaderboards: { ...prev.leaderboards, enabled: value } }))
            }
          />
          <ToggleSwitch
            label="Currency leaderboard"
            checked={guild.leaderboards.currency}
            onChange={(value) =>
              updateGuild((prev) => ({ ...prev, leaderboards: { ...prev.leaderboards, currency: value } }))
            }
          />
          <ToggleSwitch
            label="Item leaderboard"
            checked={guild.leaderboards.items}
            onChange={(value) =>
              updateGuild((prev) => ({ ...prev, leaderboards: { ...prev.leaderboards, items: value } }))
            }
          />
          <div className="cadence-grid">
            {CADENCES.map((cadence) => (
              <label key={cadence} className="checkbox">
                <input
                  type="checkbox"
                  checked={guild.leaderboards.cadences.includes(cadence)}
                  onChange={() => toggleCadence(cadence)}
                />
                <span>{cadence}</span>
              </label>
            ))}
          </div>
        </ModuleCard>

      </div>

      <div className="page-actions">
        <div>
          <span>Last saved</span>
          <strong>{lastSaved ? new Date(lastSaved).toLocaleString() : 'Not yet saved'}</strong>
        </div>
        <button type="button" className="primary-btn" onClick={() => saveGuild('Leaderboard settings saved')}>
          Save changes
        </button>
      </div>
    </div>
  );
}
