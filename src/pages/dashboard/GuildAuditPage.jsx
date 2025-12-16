import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '../../components/SectionHeader';
import ToggleSwitch from '../../components/ToggleSwitch';
import ModuleCard from '../../components/ModuleCard';
import useGuildSettings from '../../hooks/useGuildSettings';

export default function GuildAuditPage() {
  const { guild, updateGuild, saveGuild, resetGuild, selectedGuild, lastSaved } = useGuildSettings();
  const [resetting, setResetting] = useState(false);
  const navigate = useNavigate();
  const auditChannels = guild.auditLogChannels ?? {};

  const handleReset = () => {
    if (resetting) return;
    setResetting(true);
    resetGuild('Guild dashboard reset to defaults', 'info');
    setTimeout(() => setResetting(false), 600);
  };

  return (
    <div className="page-stack guild-dashboard">
      <SectionHeader
        eyebrow="Guild Dashboard"
        title="Audit Logs"
        subtitle={`Choose what ${selectedGuild?.name ?? 'your guild'} records and where it streams.`}
        meta={<span className="status-pill">Audit</span>}
      />

      <section className="dashboard-subsection">
        <header className="dashboard-subsection__head">
          <p className="eyebrow">Audit</p>
          <h2>Monitoring streams</h2>
          <p>Decide which surfaces emit audit logs and the Discord channel they should land in.</p>
        </header>
        <div className="card-grid">
          <ModuleCard
            icon="🛰️"
            title="Audit log streams"
            description="Toggle which surfaces pipe into the log channel."
            status="Active"
          >
            <p className="helper-text">Channels sync live previews in the Logs dashboard.</p>
            <div className="audit-options">
              {Object.entries(guild.auditLogs).map(([key, value]) => (
                <div key={key} className="audit-option">
                  <ToggleSwitch
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    checked={value}
                    onChange={(next) =>
                      updateGuild((prev) => ({
                        ...prev,
                        auditLogs: { ...prev.auditLogs, [key]: next },
                      }))
                    }
                  />
                  <label className="text-control">
                    <span>Log channel</span>
                    <input
                      value={auditChannels[key] ?? ''}
                      placeholder="#logs"
                      onChange={(event) =>
                        updateGuild((prev) => ({
                          ...prev,
                          auditLogChannels: { ...(prev.auditLogChannels ?? {}), [key]: event.target.value },
                        }))
                      }
                    />
                  </label>
                </div>
              ))}
            </div>
            <button type="button" className="ghost-btn ghost-btn--small" onClick={() => navigate('/app/logs')}>
              Open logs dashboard
            </button>
          </ModuleCard>
        </div>
      </section>

      <section className="danger-zone-card">
        <div>
          <p className="eyebrow">Danger zone</p>
          <h3>Reset guild dashboard</h3>
          <p>Removes every custom payout, box, raffle, and permission override.</p>
        </div>
        <button type="button" className="danger-btn" onClick={handleReset} disabled={resetting}>
          {resetting ? 'Resetting…' : 'Reset everything'}
        </button>
      </section>

      <div className="page-actions">
        <div>
          <span>Last saved</span>
          <strong>{lastSaved ? new Date(lastSaved).toLocaleString() : 'Not yet saved'}</strong>
        </div>
        <button type="button" className="primary-btn" onClick={() => saveGuild('Audit settings saved')}>
          Save changes
        </button>
      </div>
    </div>
  );
}
