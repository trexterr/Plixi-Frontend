import { useState } from 'react';
import SectionHeader from '../../components/SectionHeader';
import SettingCard from '../../components/SettingCard';
import ToggleSwitch from '../../components/ToggleSwitch';
import ConfirmModal from '../../components/ConfirmModal';
import { useDashboardData } from '../../context/DashboardDataContext';
import { useToast } from '../../components/ToastProvider';

export default function LeaderboardsPage() {
  const { activeRecord, updateSection, resetSection, saveSection } = useDashboardData();
  const { showToast } = useToast();
  const leaderboards = activeRecord.settings.leaderboards;
  const lastSaved = activeRecord.lastSaved.leaderboards;
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSave = () => {
    saveSection('leaderboards');
    showToast('Leaderboards saved');
  };

  const handleReset = () => {
    resetSection('leaderboards');
    setConfirmOpen(false);
    showToast('Leaderboards reset', 'info');
  };

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Leaderboards"
        title="Celebrate the grind"
        subtitle="Seasonal ladders reward your top performers with titles, embeds, and vanity perks."
        meta={<span className="status-pill">{leaderboards.leaderboardsEnabled ? 'Live' : 'Disabled'}</span>}
      />

      <div className="card-grid">
        <SettingCard title="Availability" description="Turn the leaderboard module on or off.">
          <ToggleSwitch
            label="Enable leaderboards"
            checked={leaderboards.leaderboardsEnabled}
            onChange={(value) => updateSection('leaderboards', { leaderboardsEnabled: value })}
          />
        </SettingCard>

        <SettingCard title="Rotation" description="How often rankings reset and rewards are distributed.">
          <select
            value={leaderboards.rotation}
            onChange={(event) => updateSection('leaderboards', { rotation: event.target.value })}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="seasonal">Seasonal</option>
          </select>
        </SettingCard>

        <SettingCard title="Rewards" description="Choose the role or label assigned to winners.">
          <label className="text-control">
            <span>Reward role</span>
            <input
              value={leaderboards.rewardRole}
              onChange={(event) => updateSection('leaderboards', { rewardRole: event.target.value })}
            />
          </label>
          <ToggleSwitch
            label="Celebrate with embeds"
            checked={leaderboards.celebrateWithEmbeds}
            onChange={(value) => updateSection('leaderboards', { celebrateWithEmbeds: value })}
          />
        </SettingCard>
      </div>

      <div className="preview-card">
        <span>Preview</span>
        <p>
          {leaderboards.rotation} resets with reward role "{leaderboards.rewardRole}".{' '}
          {leaderboards.celebrateWithEmbeds ? 'Celebration embeds will post automatically.' : 'Announcements are muted.'}
        </p>
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
          title="Reset leaderboards?"
          description="Defaults restored for rotation, rewards, and celebration embeds."
          confirmLabel="Reset"
          onConfirm={handleReset}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}
