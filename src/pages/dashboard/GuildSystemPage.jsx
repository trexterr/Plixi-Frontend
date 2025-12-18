import { useMemo, useState } from 'react';
import SectionHeader from '../../components/SectionHeader';
import ModuleCard from '../../components/ModuleCard';
import useGuildSettings from '../../hooks/useGuildSettings';

export default function GuildSystemPage() {
  const { guild, updateGuild, saveGuild, selectedGuild, lastSaved } = useGuildSettings();
  const [roleSelections, setRoleSelections] = useState({ adminRoles: '', blockedRoles: '' });
  const [commandDraft, setCommandDraft] = useState('');

  const availableRoles = useMemo(() => {
    const seeds = [
      ...guild.permissions.adminRoles,
      ...guild.permissions.blockedRoles,
      ...((guild.daily?.roleAmounts ?? []).map((entry) => entry.role) ?? []),
      '@Admin',
      '@Staff',
      '@Muted',
      '@Moderator',
      '@VIP',
      '@VIP+',
    ];
    return Array.from(new Set(seeds.filter(Boolean)));
  }, [guild.permissions, guild.daily]);

  const appendPermission = (field, value) => {
    if (!value) return;
    updateGuild((prev) => {
      if (prev.permissions[field].includes(value)) return prev;
      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [field]: [...prev.permissions[field], value],
        },
      };
    });
  };

  const handlePermissionRemove = (field, entry) => {
    updateGuild((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [field]: prev.permissions[field].filter((item) => item !== entry),
      },
    }));
  };

  const handlePermissionAdd = (field) => {
    const value = field === 'commandRestrictions' ? commandDraft.trim() : roleSelections[field];
    if (!value) return;
    appendPermission(field, value);
    if (field === 'commandRestrictions') {
      setCommandDraft('');
    } else {
      setRoleSelections((prev) => ({ ...prev, [field]: '' }));
    }
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
          <div className="permission-editor">
            <label className="text-control">
              <span>Admin roles</span>
              <div className="chip-editor">
                <div className="chip-input chip-input--compact">
                  <select
                    value={roleSelections.adminRoles}
                    onChange={(event) => setRoleSelections((prev) => ({ ...prev, adminRoles: event.target.value }))}
                  >
                    <option value="">Select a role</option>
                    {availableRoles
                      .filter((role) => !guild.permissions.adminRoles.includes(role))
                      .map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                  </select>
                  <button type="button" onClick={() => handlePermissionAdd('adminRoles')} disabled={!roleSelections.adminRoles}>
                    Add role
                  </button>
                </div>
                <div className="chip-group-box">
                  <div className="chip-list">
                    {guild.permissions.adminRoles.length ? (
                      guild.permissions.adminRoles.map((role) => (
                        <span key={role} className="chip">
                          {role}
                          <button type="button" onClick={() => handlePermissionRemove('adminRoles', role)}>
                            ✕
                          </button>
                        </span>
                      ))
                    ) : (
                      <p className="helper-text">No admin roles yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </label>
            <label className="text-control">
              <span>Restricted roles</span>
              <div className="chip-editor">
                <div className="chip-input chip-input--compact">
                  <select
                    value={roleSelections.blockedRoles}
                    onChange={(event) => setRoleSelections((prev) => ({ ...prev, blockedRoles: event.target.value }))}
                  >
                    <option value="">Select a role</option>
                    {availableRoles
                      .filter((role) => !guild.permissions.blockedRoles.includes(role))
                      .map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handlePermissionAdd('blockedRoles')}
                    disabled={!roleSelections.blockedRoles}
                  >
                    Add role
                  </button>
                </div>
                <div className="chip-group-box">
                  <div className="chip-list">
                    {guild.permissions.blockedRoles.length ? (
                      guild.permissions.blockedRoles.map((role) => (
                        <span key={role} className="chip">
                          {role}
                          <button type="button" onClick={() => handlePermissionRemove('blockedRoles', role)}>
                            ✕
                          </button>
                        </span>
                      ))
                    ) : (
                      <p className="helper-text">No restricted roles yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </label>
            <label className="text-control">
              <span>Command restrictions</span>
              <div className="chip-editor">
                {guild.permissions.commandRestrictions.length > 0 && (
                  <div className="chip-group-box">
                    <div className="chip-list">
                      {guild.permissions.commandRestrictions.map((entry) => (
                        <span key={entry} className="chip">
                          {entry}
                          <button type="button" onClick={() => handlePermissionRemove('commandRestrictions', entry)}>
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="chip-input">
                  <input placeholder="/pay" value={commandDraft} onChange={(event) => setCommandDraft(event.target.value)} />
                  <button type="button" onClick={() => handlePermissionAdd('commandRestrictions')} disabled={!commandDraft.trim()}>
                    Add command
                  </button>
                </div>
              </div>
            </label>
          </div>
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
