import { useState } from 'react';
import SectionHeader from '../../components/SectionHeader';
import SettingCard from '../../components/SettingCard';
import ToggleSwitch from '../../components/ToggleSwitch';
import SliderInput from '../../components/SliderInput';
import ConfirmModal from '../../components/ConfirmModal';
import { useDashboardData } from '../../context/DashboardDataContext';
import { useSelectedGuild } from '../../context/SelectedGuildContext';
import { useToast } from '../../components/ToastProvider';

export default function MysteryBoxesPage() {
  const { activeRecord, updateSection, resetSection, saveSection } = useDashboardData();
  const { isPremium } = useSelectedGuild();
  const { showToast } = useToast();
  const boxes = activeRecord.settings.mysteryBoxes;
  const lastSaved = activeRecord.lastSaved.mysteryBoxes;
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSave = () => {
    saveSection('mysteryBoxes');
    showToast('Mystery boxes saved');
  };

  const handleReset = () => {
    resetSection('mysteryBoxes');
    setConfirmOpen(false);
    showToast('Mystery boxes reset', 'info');
  };

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Mystery boxes"
        title="Script the unboxing hype"
        subtitle="Blend drop rates, animations, and guarantees to keep members engaged."
        meta={<span className="status-pill">{boxes.boxesEnabled ? 'Mystery boxes live' : 'Disabled'}</span>}
      />

      <div className="card-grid">
        <SettingCard title="Box availability" description="Running events or taking a break? Toggle here.">
          <ToggleSwitch
            label="Enable /box"
            checked={boxes.boxesEnabled}
            onChange={(value) => updateSection('mysteryBoxes', { boxesEnabled: value })}
          />
        </SettingCard>

        <SettingCard title="Legendary drop rate" description="Fine tune the rarity percentage.">
          <SliderInput
            label="Legendary chance"
            suffix="%"
            min={0}
            max={10}
            step={0.1}
            value={boxes.legendaryRate}
            onChange={(value) => updateSection('mysteryBoxes', { legendaryRate: Number(value) })}
          />
        </SettingCard>

        <SettingCard title="Animation style" description="Choose how the reveal animation behaves.">
          <select
            value={boxes.animationStyle}
            onChange={(event) => updateSection('mysteryBoxes', { animationStyle: event.target.value })}
          >
            <option value="nebula">Nebula</option>
            <option value="prismatic">Prismatic</option>
            <option value="retro">Retro arcade</option>
          </select>
        </SettingCard>

        <SettingCard
          title="Guaranteed drops"
          description="Give whales a pity timer that guarantees a legendary after X pulls."
          badge="Premium"
          locked={!isPremium}
        >
          <ToggleSwitch
            label="Enable guaranteed drops"
            checked={boxes.guaranteedDrops}
            onChange={(value) => updateSection('mysteryBoxes', { guaranteedDrops: value })}
            disabled={!isPremium}
          />
        </SettingCard>
      </div>

      <div className="preview-card">
        <div>
          <span>Reveal preview</span>
          <p>
            {boxes.animationStyle} animation · {boxes.legendaryRate}% legendary chance ·{' '}
            {boxes.guaranteedDrops ? 'Guarantee enabled' : 'No guarantee'}
          </p>
        </div>
        <div className="preview-animation">
          <div className={`box ${boxes.animationStyle}`}>
            <span role="img" aria-label="box">
              🎁
            </span>
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
          title="Reset mystery boxes?"
          description="All drop rates and animations will revert to Plixi defaults."
          confirmLabel="Reset"
          onConfirm={handleReset}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}
