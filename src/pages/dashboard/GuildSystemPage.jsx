import SectionHeader from '../../components/SectionHeader';
import ModuleCard from '../../components/ModuleCard';
import useGuildSettings from '../../hooks/useGuildSettings';

export default function GuildSystemPage() {
  const { guild, updateGuild, saveGuild, selectedGuild, lastSaved } = useGuildSettings();

  const updatePermissions = (field, value) => {
    updateGuild((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [field]: value
          .split('\n')
          .map((entry) => entry.trim())
          .filter(Boolean),
      },
    }));
  };

  return (
    <div className="page-stack guild-dashboard">
      <SectionHeader
        eyebrow="Guild Dashboard"
        title="Server Settings"
        subtitle={`Localization, timezone, and regional defaults for ${selectedGuild?.name ?? 'your guild'}.`}
        meta={<span className="status-pill">System</span>}
      />

      <div className="card-grid">
        <ModuleCard icon="🌐" title="Localization" description="Pick language preferences and default timezone." status="Active">
          <label className="text-control">
            <span>Language</span>
            <select
              value={guild.system.language}
              onChange={(event) =>
                updateGuild((prev) => ({
                  ...prev,
                  system: { ...prev.system, language: event.target.value },
                }))
              }
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="Portuguese">Portuguese</option>
            </select>
          </label>
          <label className="text-control">
            <span>Timezone</span>
            <input
              value={guild.system.timezone}
              onChange={(event) =>
                updateGuild((prev) => ({
                  ...prev,
                  system: { ...prev.system, timezone: event.target.value },
                }))
              }
            />
          </label>
        </ModuleCard>

        <ModuleCard icon="🛡️" title="Permissions & Roles" description="Control who can run commands or manage systems." status="Active">
          <label className="text-control">
            <span>Admin roles</span>
            <textarea
              rows={3}
              value={guild.permissions.adminRoles.join('\n')}
              onChange={(event) => updatePermissions('adminRoles', event.target.value)}
            />
          </label>
          <label className="text-control">
            <span>Restricted roles</span>
            <textarea
              rows={3}
              value={guild.permissions.blockedRoles.join('\n')}
              onChange={(event) => updatePermissions('blockedRoles', event.target.value)}
            />
          </label>
          <label className="text-control">
            <span>Command restrictions</span>
            <textarea
              rows={3}
              placeholder="/pay, /gift..."
              value={guild.permissions.commandRestrictions.join('\n')}
              onChange={(event) => updatePermissions('commandRestrictions', event.target.value)}
            />
          </label>
        </ModuleCard>
      </div>

      <div className="page-actions">
        <div>
          <span>Last saved</span>
          <strong>{lastSaved ? new Date(lastSaved).toLocaleString() : 'Not yet saved'}</strong>
        </div>
        <button type="button" className="primary-btn" onClick={() => saveGuild('Server settings saved')}>
          Save changes
        </button>
      </div>
    </div>
  );
}
