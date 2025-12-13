import { useState } from 'react';
import SectionHeader from '../../components/SectionHeader';
import SettingCard from '../../components/SettingCard';
import ToggleSwitch from '../../components/ToggleSwitch';
import SliderInput from '../../components/SliderInput';
import ConfirmModal from '../../components/ConfirmModal';
import { useDashboardData } from '../../context/DashboardDataContext';
import { useSelectedGuild } from '../../context/SelectedGuildContext';
import { useToast } from '../../components/ToastProvider';

export default function MarketplacePage() {
  const { activeRecord, updateSection, resetSection, saveSection } = useDashboardData();
  const { selectedGuild, isPremium } = useSelectedGuild();
  const { showToast } = useToast();
  const marketplace = activeRecord.settings.marketplace;
  const lastSaved = activeRecord.lastSaved.marketplace;
  const [resetOpen, setResetOpen] = useState(false);

  const handleSave = () => {
    saveSection('marketplace');
    showToast('Marketplace preferences saved');
  };

  const handleReset = () => {
    resetSection('marketplace');
    setResetOpen(false);
    showToast('Marketplace reset', 'info');
  };

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Marketplace"
        title="Shape the trading floor"
        subtitle={`Decide how ${selectedGuild?.name ?? 'the guild'} lists, sells, and features items.`}
        meta={<span className="status-pill">{marketplace.marketplaceEnabled ? 'Marketplace live' : 'Disabled'}</span>}
      />

      <div className="card-grid">
        <SettingCard title="Marketplace status" description="Hide or reveal the /marketplace command suite.">
          <ToggleSwitch
            label="Enable storefront"
            checked={marketplace.marketplaceEnabled}
            onChange={(value) => updateSection('marketplace', { marketplaceEnabled: value })}
          />
        </SettingCard>

        <SettingCard title="User listings" description="Let members post their own ads.">
          <ToggleSwitch
            label="Allow community listings"
            checked={marketplace.allowUserListings}
            onChange={(value) => updateSection('marketplace', { allowUserListings: value })}
          />
          <SliderInput
            label="Listing fee"
            suffix="%"
            min={0}
            max={20}
            value={marketplace.listingFee}
            onChange={(value) => updateSection('marketplace', { listingFee: value })}
          />
        </SettingCard>

        <SettingCard title="Featured slots" description="Promote top-selling items on marketplace load.">
          <SliderInput
            label="Slots"
            min={0}
            max={6}
            value={marketplace.featuredSlots}
            onChange={(value) => updateSection('marketplace', { featuredSlots: value })}
          />
          <label className="text-control">
            <span>Currency label</span>
            <input
              value={marketplace.currencyName}
              onChange={(event) => updateSection('marketplace', { currencyName: event.target.value })}
            />
          </label>
        </SettingCard>

        <SettingCard
          title="Premium analytics"
          description="Unlock buyer funnels, abandoned cart alerts, and more."
          badge="Premium"
          locked={!isPremium}
        >
          <ToggleSwitch
            label="Enable analytics"
            checked={marketplace.premiumAnalytics}
            onChange={(value) => updateSection('marketplace', { premiumAnalytics: value })}
            disabled={!isPremium}
          />
        </SettingCard>
      </div>

      <div className="preview-card">
        <div>
          <span>Marketplace preview</span>
          <p>
            {marketplace.featuredSlots} featured slots, {marketplace.listingFee}% fee,{' '}
            {marketplace.allowUserListings ? 'community listings open' : 'staff-only listings'}
          </p>
        </div>
        <div className="preview-board">
          {[1, 2, 3].map((slot) => (
            <div key={slot} className="preview-product">
              <strong>Spot #{slot}</strong>
              <p>{slot <= marketplace.featuredSlots ? 'Filled automatically' : 'Available'}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="page-actions">
        <div>
          <span>Last saved</span>
          <strong>{lastSaved ? new Date(lastSaved).toLocaleString() : 'Not yet saved'}</strong>
        </div>
        <div>
          <button type="button" className="ghost-btn" onClick={() => setResetOpen(true)}>
            Reset
          </button>
          <button type="button" className="primary-btn" onClick={handleSave}>
            Save changes
          </button>
        </div>
      </div>

      {resetOpen && (
        <ConfirmModal
          title="Reset marketplace?"
          description="Clear featured slots and fees back to defaults."
          confirmLabel="Reset"
          onConfirm={handleReset}
          onCancel={() => setResetOpen(false)}
        />
      )}
    </div>
  );
}
