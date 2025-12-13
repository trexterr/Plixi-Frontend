import { useState } from 'react';
import SectionHeader from '../../components/SectionHeader';
import SettingCard from '../../components/SettingCard';
import ToggleSwitch from '../../components/ToggleSwitch';
import ConfirmModal from '../../components/ConfirmModal';
import { useDashboardData } from '../../context/DashboardDataContext';
import { useToast } from '../../components/ToastProvider';

export default function SettingsPage() {
  const { activeRecord, updateSection, resetSection, saveSection } = useDashboardData();
  const { showToast } = useToast();
  const settings = activeRecord.settings.settings;
  const lastSaved = activeRecord.lastSaved.settings;
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSave = () => {
    saveSection('settings');
    showToast('Server settings saved');
  };

  const handleReset = () => {
    resetSection('settings');
    setConfirmOpen(false);
    showToast('Server settings reset', 'info');
  };

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Server settings"
        title="Global administration"
        subtitle="Control maintenance windows, beta features, and timezone alignment."
        meta={<span className="status-pill">{settings.maintenanceMode ? 'Maintenance' : 'Online'}</span>}
      />

      <div className="card-grid">
        <SettingCard title="Maintenance" description="Temporarily pause Plixi commands.">
          <ToggleSwitch
            label="Enable maintenance mode"
            checked={settings.maintenanceMode}
            onChange={(value) => updateSection('settings', { maintenanceMode: value })}
          />
        </SettingCard>

        <SettingCard title="Timezone" description="Display schedules and cooldowns in this timezone.">
          <select
            value={settings.timezone}
            onChange={(event) => updateSection('settings', { timezone: event.target.value })}
          >
            <option value="UTC">UTC</option>
            <option value="EST">EST</option>
            <option value="PST">PST</option>
            <option value="CET">CET</option>
          </select>
        </SettingCard>

        <SettingCard title="Beta program" description="Enable experimental features for trusted staff.">
          <ToggleSwitch
            label="Allow beta access"
            checked={settings.allowBeta}
            onChange={(value) => updateSection('settings', { allowBeta: value })}
          />
        </SettingCard>
      </div>

      <div className="page-actions">
        <div>
          <span>Last saved</span>
          <strong>{lastSaved ? new Date(lastSaved).toLocaleString() : 'Not yet saved'}</strong>
        </div>
        <div>
          <button type="button" className="ghost-btn" onClick={() => setConfirmOpen(true)}>
            Reset
          </button>
          <button type="button" className="primary-btn" onClick={handleSave}>
            Save changes
          </button>
        </div>
      </div>

      {confirmOpen && (
        <ConfirmModal
          title="Reset server settings?"
          description="Maintenance, timezone, and beta access will revert to defaults."
          confirmLabel="Reset"
          onConfirm={handleReset}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}
