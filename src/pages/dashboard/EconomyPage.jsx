import { useState } from 'react';
import SectionHeader from '../../components/SectionHeader';
import SettingCard from '../../components/SettingCard';
import ToggleSwitch from '../../components/ToggleSwitch';
import SliderInput from '../../components/SliderInput';
import Tooltip from '../../components/Tooltip';
import ConfirmModal from '../../components/ConfirmModal';
import { useDashboardData } from '../../context/DashboardDataContext';
import { useSelectedGuild } from '../../context/SelectedGuildContext';
import { useToast } from '../../components/ToastProvider';

export default function EconomyPage() {
  const { activeRecord, updateSection, resetSection, saveSection } = useDashboardData();
  const { selectedGuild, isPremium } = useSelectedGuild();
  const { showToast } = useToast();
  const [showResetModal, setShowResetModal] = useState(false);
  const economy = activeRecord.settings.economy;
  const lastSaved = activeRecord.lastSaved.economy;

  const handleSave = () => {
    saveSection('economy');
    showToast('Economy settings saved');
  };

  const handleConfirmReset = () => {
    resetSection('economy');
    setShowResetModal(false);
    showToast('Economy settings restored', 'info');
  };

  const previewSummary = `If enabled, /work grants ${economy.workReward} ${economy.currencyName} every ${economy.dailyCooldown}h with a ${economy.taxRate}% tax.`;

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Economy"
        title={`Reward loop for ${selectedGuild?.name ?? 'your server'}`}
        subtitle="Dial in payouts, cooldowns, and taxes. Every control updates the preview so you know exactly what members will experience."
        meta={
          <span className="status-pill">
            {economy.economyEnabled ? 'Economy enabled' : 'Economy paused'}
          </span>
        }
      />

      <div className="card-grid">
        <SettingCard title="Economy status" description="Control whether members can earn currency with commands like /work and /daily.">
          <ToggleSwitch
            label="Enable currency earnings"
            description="Disabling hides Plixi economy commands."
            checked={economy.economyEnabled}
            onChange={(value) => updateSection('economy', { economyEnabled: value })}
          />
        </SettingCard>

        <SettingCard title="Starting balance" description="Give new members a boost when they join.">
          <SliderInput
            label="Balance"
            prefix="+"
            suffix={` ${economy.currencyName}`}
            min={0}
            max={1000}
            step={10}
            value={economy.startingBalance}
            onChange={(value) => updateSection('economy', { startingBalance: value })}
          />
        </SettingCard>

        <SettingCard title="Daily cadence" description="Manage how often members can cash in.">
          <SliderInput
            label="Cooldown"
            suffix=" h"
            min={1}
            max={24}
            value={economy.dailyCooldown}
            onChange={(value) => updateSection('economy', { dailyCooldown: value })}
          />
          <SliderInput
            label="/work reward"
            suffix={` ${economy.currencyName}`}
            min={50}
            max={400}
            step={5}
            value={economy.workReward}
            onChange={(value) => updateSection('economy', { workReward: value })}
          />
        </SettingCard>

        <SettingCard title="Tax & currency" description="Balance your economy with light taxation.">
          <SliderInput
            label="Tax rate"
            suffix="%"
            min={0}
            max={30}
            value={economy.taxRate}
            onChange={(value) => updateSection('economy', { taxRate: value })}
          />
          <label className="text-control">
            <span>
              Currency name
              <Tooltip label="Rename the economy currency shown across all embeds.">
                <button type="button" aria-label="Help">
                  ⓘ
                </button>
              </Tooltip>
            </span>
            <input
              value={economy.currencyName}
              onChange={(event) => updateSection('economy', { currencyName: event.target.value })}
            />
          </label>
        </SettingCard>

        <SettingCard
          title="AI balancer"
          description="Generate payout presets tuned to your server size."
          badge="Premium"
          locked={!isPremium}
        >
          <select
            value={economy.previewMode}
            onChange={(event) => updateSection('economy', { previewMode: event.target.value })}
            disabled={!isPremium}
          >
            <option value="balanced">Balanced</option>
            <option value="aggressive">Aggressive XP</option>
            <option value="chill">Chill economy</option>
          </select>
        </SettingCard>
      </div>

      <div className="preview-card">
        <div>
          <span>Live preview</span>
          <p>{previewSummary}</p>
        </div>
        <div className="preview-chat">
          <div className="bubble bot">
            <strong>@Plixi</strong>
            <p>+{economy.workReward} {economy.currencyName} earned</p>
            <small>{economy.taxRate}% tax remitted to treasury</small>
          </div>
          {!economy.economyEnabled && <div className="bubble warning">Economy commands are currently disabled.</div>}
        </div>
      </div>

      <div className="page-actions">
        <div>
          <span>Last saved</span>
          <strong>{lastSaved ? new Date(lastSaved).toLocaleString() : 'Not yet saved'}</strong>
        </div>
        <div>
          <button type="button" className="ghost-btn" onClick={() => setShowResetModal(true)}>
            Reset
          </button>
          <button type="button" className="primary-btn" onClick={handleSave}>
            Save changes
          </button>
        </div>
      </div>

      {showResetModal && (
        <ConfirmModal
          title="Reset economy?"
          description="This will revert every slider back to the Plixi defaults for this server."
          confirmLabel="Reset"
          onConfirm={handleConfirmReset}
          onCancel={() => setShowResetModal(false)}
        />
      )}
    </div>
  );
}
