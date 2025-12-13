import { useState } from 'react';
import SectionHeader from '../../components/SectionHeader';
import SettingCard from '../../components/SettingCard';
import ToggleSwitch from '../../components/ToggleSwitch';
import SliderInput from '../../components/SliderInput';
import ConfirmModal from '../../components/ConfirmModal';
import { useDashboardData } from '../../context/DashboardDataContext';
import { useSelectedGuild } from '../../context/SelectedGuildContext';
import { useToast } from '../../components/ToastProvider';

export default function JobsPage() {
  const { activeRecord, updateSection, resetSection, saveSection } = useDashboardData();
  const { selectedGuild, isPremium } = useSelectedGuild();
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const jobs = activeRecord.settings.jobs;
  const lastSaved = activeRecord.lastSaved.jobs;

  const handleSave = () => {
    saveSection('jobs');
    showToast('Job board saved');
  };

  const handleReset = () => {
    resetSection('jobs');
    setConfirmOpen(false);
    showToast('Job board reset', 'info');
  };

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Jobs"
        title="Design streak-worthy jobs"
        subtitle={`Automate daily contracts for ${selectedGuild?.name ?? 'the guild'} so members always have something to grind.`}
        meta={<span className="status-pill">{jobs.jobsEnabled ? 'Jobs enabled' : 'Jobs disabled'}</span>}
      />

      <div className="card-grid">
        <SettingCard title="Jobs availability" description="Pause or resume the /jobs experience entirely.">
          <ToggleSwitch
            label="Enable jobs"
            checked={jobs.jobsEnabled}
            onChange={(value) => updateSection('jobs', { jobsEnabled: value })}
          />
        </SettingCard>

        <SettingCard title="Difficulty preset" description="Choose how strict the job minigame feels.">
          <select
            value={jobs.jobDifficulty}
            onChange={(event) => updateSection('jobs', { jobDifficulty: event.target.value })}
          >
            <option value="standard">Standard</option>
            <option value="hardcore">Hardcore</option>
            <option value="cozy">Cozy</option>
          </select>
        </SettingCard>

        <SettingCard title="Shift tuning" description="How long jobs last and how much they pay.">
          <SliderInput
            label="Shift length"
            suffix=" hr"
            min={1}
            max={8}
            value={jobs.shiftLength}
            onChange={(value) => updateSection('jobs', { shiftLength: value })}
          />
          <SliderInput
            label="Payout multiplier"
            min={0.5}
            max={3}
            step={0.1}
            value={jobs.payoutMultiplier}
            onChange={(value) => updateSection('jobs', { payoutMultiplier: Number(value) })}
          />
          <SliderInput
            label="Reroll cost"
            suffix=" Credits"
            min={0}
            max={500}
            step={10}
            value={jobs.rerollCost}
            onChange={(value) => updateSection('jobs', { rerollCost: value })}
          />
        </SettingCard>

        <SettingCard
          title="Auto assignments"
          description="Automatically fill empty shifts with best-fit members."
          badge="Premium"
          locked={!isPremium}
        >
          <ToggleSwitch
            label="Enable auto assignments"
            checked={jobs.autoAssign}
            onChange={(value) => updateSection('jobs', { autoAssign: value })}
            disabled={!isPremium}
          />
        </SettingCard>
      </div>

      <div className="preview-card">
        <div>
          <span>Job preview</span>
          <p>
            {jobs.shiftLength}h shifts · {jobs.payoutMultiplier}x multiplier · {jobs.rerollCost} Credits to reroll
          </p>
        </div>
        <div className="preview-chat">
          <div className="bubble user">
            <strong>/jobs accept</strong>
            <p>Taking the Fleet Dispatcher contract.</p>
          </div>
          <div className="bubble bot">
            <p>
              Finish in {jobs.shiftLength}h to earn ×{jobs.payoutMultiplier} rewards. {jobs.autoAssign ? 'Auto-assign mode locks slots early.' : 'Manual assignment is enabled.'}
            </p>
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
          title="Reset job settings?"
          description="Restore defaults for shifts, payouts, and reroll costs."
          confirmLabel="Reset"
          onConfirm={handleReset}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}
