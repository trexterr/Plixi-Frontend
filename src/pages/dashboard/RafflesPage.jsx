import { useState } from 'react';
import SectionHeader from '../../components/SectionHeader';
import SettingCard from '../../components/SettingCard';
import ToggleSwitch from '../../components/ToggleSwitch';
import SliderInput from '../../components/SliderInput';
import ConfirmModal from '../../components/ConfirmModal';
import { useDashboardData } from '../../context/DashboardDataContext';
import { useToast } from '../../components/ToastProvider';

export default function RafflesPage() {
  const { activeRecord, updateSection, resetSection, saveSection } = useDashboardData();
  const { showToast } = useToast();
  const raffles = activeRecord.settings.raffles;
  const lastSaved = activeRecord.lastSaved.raffles;
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSave = () => {
    saveSection('raffles');
    showToast('Raffles saved');
  };

  const handleReset = () => {
    resetSection('raffles');
    setConfirmOpen(false);
    showToast('Raffles reset', 'info');
  };

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Raffles"
        title="Host high-energy giveaways"
        subtitle="Cap tickets, require verification, and keep winners honest."
        meta={<span className="status-pill">{raffles.rafflesEnabled ? 'Raffles live' : 'Disabled'}</span>}
      />

      <div className="card-grid">
        <SettingCard title="Raffle availability" description="Enable or disable /raffle commands.">
          <ToggleSwitch
            label="Allow raffles"
            checked={raffles.rafflesEnabled}
            onChange={(value) => updateSection('raffles', { rafflesEnabled: value })}
          />
        </SettingCard>

        <SettingCard title="Ticket limits" description="Prevent whales from monopolizing prizes.">
          <SliderInput
            label="Max tickets"
            min={10}
            max={300}
            step={5}
            value={raffles.maxTickets}
            onChange={(value) => updateSection('raffles', { maxTickets: value })}
          />
        </SettingCard>

        <SettingCard title="Trust & safety" description="Require extra checks before entering.">
          <ToggleSwitch
            label="Require verification"
            checked={raffles.requireVerification}
            onChange={(value) => updateSection('raffles', { requireVerification: value })}
          />
          <ToggleSwitch
            label="Notify winners in DMs"
            checked={raffles.notifyWinners}
            onChange={(value) => updateSection('raffles', { notifyWinners: value })}
          />
          <ToggleSwitch
            label="Auto-claim rewards"
            checked={raffles.autoClaim}
            onChange={(value) => updateSection('raffles', { autoClaim: value })}
          />
        </SettingCard>
      </div>

      <div className="preview-card">
        <div>
          <span>Raffle preview</span>
          <p>
            {raffles.maxTickets} tickets · {raffles.requireVerification ? 'verification required' : 'open entry'} ·{' '}
            {raffles.autoClaim ? 'auto claim enabled' : 'manual claim'}
          </p>
        </div>
        <div className="preview-chart">
          <div style={{ width: `${(raffles.maxTickets / 300) * 100}%` }} />
        </div>
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
          title="Reset raffles?"
          description="Revert verification, ticket limits, and DM behavior."
          confirmLabel="Reset"
          onConfirm={handleReset}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}
