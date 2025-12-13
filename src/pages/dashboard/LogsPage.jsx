import { useState } from 'react';
import SectionHeader from '../../components/SectionHeader';
import SettingCard from '../../components/SettingCard';
import ToggleSwitch from '../../components/ToggleSwitch';
import SliderInput from '../../components/SliderInput';
import ConfirmModal from '../../components/ConfirmModal';
import { useDashboardData } from '../../context/DashboardDataContext';
import { useToast } from '../../components/ToastProvider';

export default function LogsPage() {
  const { activeRecord, updateSection, resetSection, saveSection } = useDashboardData();
  const { showToast } = useToast();
  const logs = activeRecord.settings.logs;
  const lastSaved = activeRecord.lastSaved.logs;
  const [newChannel, setNewChannel] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSave = () => {
    saveSection('logs');
    showToast('Log preferences saved');
  };

  const handleReset = () => {
    resetSection('logs');
    setConfirmOpen(false);
    showToast('Logs reset', 'info');
  };

  const handleAddChannel = () => {
    if (!newChannel.trim()) return;
    const channel = newChannel.trim().startsWith('#') ? newChannel.trim() : `#${newChannel.trim()}`;
    updateSection('logs', { streamingChannels: Array.from(new Set([...logs.streamingChannels, channel])) });
    setNewChannel('');
  };

  const handleRemoveChannel = (channel) => {
    updateSection('logs', { streamingChannels: logs.streamingChannels.filter((item) => item !== channel) });
  };

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Logs"
        title="Observability"
        subtitle="Stream audits to Discord channels and control how long data sticks around."
        meta={<span className="status-pill">Retention {logs.logRetentionDays} days</span>}
      />

      <div className="card-grid">
        <SettingCard title="Retention" description="How long Plixi stores actionable logs.">
          <SliderInput
            label="Days"
            min={1}
            max={90}
            value={logs.logRetentionDays}
            onChange={(value) => updateSection('logs', { logRetentionDays: value })}
          />
        </SettingCard>

        <SettingCard title="Streaming channels" description="Send live events to Discord channels you monitor.">
          <div className="chip-row">
            {logs.streamingChannels.map((channel) => (
              <span key={channel} className="chip">
                {channel}
                <button type="button" onClick={() => handleRemoveChannel(channel)} aria-label={`Remove ${channel}`}>
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="inline-form">
            <input
              value={newChannel}
              placeholder="#channel-name"
              onChange={(event) => setNewChannel(event.target.value)}
            />
            <button type="button" className="primary-btn" onClick={handleAddChannel}>
              Add channel
            </button>
          </div>
        </SettingCard>

        <SettingCard title="Alerts" description="Get proactive notifications when something breaks.">
          <ToggleSwitch
            label="Alert on failures"
            checked={logs.alertOnFailures}
            onChange={(value) => updateSection('logs', { alertOnFailures: value })}
          />
          <ToggleSwitch
            label="Mask sensitive values"
            checked={logs.maskSensitive}
            onChange={(value) => updateSection('logs', { maskSensitive: value })}
          />
        </SettingCard>
      </div>

      <div className="preview-card">
        <div>
          <span>Log preview</span>
          <p>
            Retention {logs.logRetentionDays} days · Streaming to {logs.streamingChannels.join(', ') || 'no channels'} ·{' '}
            {logs.alertOnFailures ? 'Alerts enabled' : 'Alerts disabled'}
          </p>
        </div>
        <div className="preview-log">
          <div className="line">
            <span>[12:24]</span> Economy payout processed {logs.maskSensitive ? '***' : '180 Credits'}
          </div>
          <div className="line">
            <span>[12:26]</span> Raffle created · {logs.alertOnFailures ? 'failure alerts ON' : 'alerts OFF'}
          </div>
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
          title="Reset logs?"
          description="Clear custom retention, channels, and alert flags."
          confirmLabel="Reset"
          onConfirm={handleReset}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}
