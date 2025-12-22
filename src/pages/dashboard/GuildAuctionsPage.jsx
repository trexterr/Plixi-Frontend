import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../components/SectionHeader';
import ToggleSwitch from '../../components/ToggleSwitch';
import ModuleCard from '../../components/ModuleCard';
import SliderInput from '../../components/SliderInput';
import NumberInput from '../../components/NumberInput';
import useGuildSettings from '../../hooks/useGuildSettings';
import { useSelectedGuild } from '../../context/SelectedGuildContext';
import { supabase } from '../../lib/supabase';

const DEFAULT_AUCTION_APPEARANCE = { title: 'Auction House', color: '#f97316' };

const computeEndsAt = (value, unit) => {
  const now = new Date();
  const safeValue = Number.isFinite(value) ? value : 0;
  const multiplier = unit === 'minutes' ? 60 : unit === 'hours' ? 60 * 60 : 60 * 60 * 24;
  return new Date(now.getTime() + safeValue * multiplier * 1000).toISOString();
};

const formatTimeRemaining = (endsAt) => {
  if (!endsAt) return 'No timer';
  const end = new Date(endsAt).getTime();
  const diff = Math.max(0, end - Date.now());
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes <= 0) return 'Ended';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours < 24) return `${hours}h ${remainingMinutes}m`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days}d ${remainingHours}h`;
};

export default function GuildAuctionsPage() {
  const { guild, updateGuild, saveGuild, selectedGuild, lastSaved } = useGuildSettings();
  const { user } = useSelectedGuild();
  const [sellerDiscordId, setSellerDiscordId] = useState(null);
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [loadingAuctions, setLoadingAuctions] = useState(false);
  const [newAuction, setNewAuction] = useState({
    itemId: '',
    itemQuantity: 1,
    startPrice: 0,
    buyoutPrice: '',
    minRaise: 0,
    durationValue: 1,
    durationUnit: 'days',
  });
  const auctions = guild.marketplaceSuite.auctions;
  const appearance = auctions.appearance ?? DEFAULT_AUCTION_APPEARANCE;
  const isCustomized =
    appearance.title !== DEFAULT_AUCTION_APPEARANCE.title || appearance.color !== DEFAULT_AUCTION_APPEARANCE.color;

  const updateAuctions = (patch) => {
    updateGuild((prev) => ({
      ...prev,
      marketplaceSuite: { ...prev.marketplaceSuite, auctions: { ...prev.marketplaceSuite.auctions, ...patch } },
    }));
  };

  const updateAppearance = (patch) => {
    updateAuctions({ appearance: { ...(auctions.appearance ?? {}), ...patch } });
  };

  useEffect(() => {
    let isMounted = true;
    const fetchSellerId = async () => {
      if (!user?.id) return;
      const metadataId =
        user?.metadata?.provider_id ||
        user?.metadata?.user_id ||
        user?.metadata?.sub ||
        user?.metadata?.preferred_username ||
        null;
      if (metadataId) {
        setSellerDiscordId(String(metadataId));
      }
      const { data, error } = await supabase
        .from('users_web')
        .select('discord_id_text:discord_id::text')
        .eq('id', user.id)
        .maybeSingle();
      if (!isMounted) return;
      if (error) {
        console.error('Failed to resolve seller discord id', error);
        return;
      }
      if (data?.discord_id_text) {
        setSellerDiscordId(data.discord_id_text);
      }
    };
    fetchSellerId();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  useEffect(() => {
    let isMounted = true;
    const loadAuctions = async () => {
      if (!selectedGuild?.id) {
        setActiveAuctions([]);
        return;
      }
      setLoadingAuctions(true);
      const { data, error } = await supabase
        .from('active_auctions')
        .select(
          'auction_id_text:auction_id::text, item_id_text:item_id::text, seller_id_text:seller_id::text, item_quantity, start_price, buyout_price, min_raise, highest_bid, ends_at, status',
        )
        .eq('guild_id', selectedGuild.id)
        .eq('status', 'active')
        .order('ends_at', { ascending: true });
      if (!isMounted) return;
      if (error) {
        console.error('Failed to load auctions', error);
        setActiveAuctions([]);
        setLoadingAuctions(false);
        return;
      }
      const mapped = Array.isArray(data)
        ? data.map((row) => ({
            id: row.auction_id_text ?? row.auction_id ?? `auction-${row.item_id_text ?? Date.now()}`,
            itemId: row.item_id_text ?? 'Unknown item',
            sellerId: row.seller_id_text ?? 'Unknown seller',
            quantity: row.item_quantity ?? 1,
            startPrice: row.start_price ?? 0,
            buyoutPrice: row.buyout_price ?? null,
            minRaise: row.min_raise ?? 0,
            highestBid: row.highest_bid ?? null,
            endsAt: row.ends_at ?? null,
            closesIn: row.ends_at ? formatTimeRemaining(row.ends_at) : 'No timer',
          }))
        : [];
      setActiveAuctions(mapped);
      setLoadingAuctions(false);
    };
    loadAuctions();
    return () => {
      isMounted = false;
    };
  }, [selectedGuild?.id]);

  const handleCreateAuction = async () => {
    if (!selectedGuild?.id || !sellerDiscordId) return;
    if (!newAuction.itemId || !Number.isFinite(newAuction.itemQuantity) || newAuction.itemQuantity < 1) return;
    const endsAt = computeEndsAt(newAuction.durationValue, newAuction.durationUnit);
    const insertPayload = {
      guild_id: selectedGuild.id,
      seller_id: sellerDiscordId,
      item_id: newAuction.itemId,
      item_quantity: newAuction.itemQuantity,
      start_price: newAuction.startPrice ?? 0,
      buyout_price: newAuction.buyoutPrice === '' ? null : newAuction.buyoutPrice,
      min_raise: newAuction.minRaise ?? 0,
      ends_at: endsAt,
      status: 'active',
    };
    const { data, error } = await supabase
      .from('active_auctions')
      .insert(insertPayload)
      .select(
        'auction_id_text:auction_id::text, item_id_text:item_id::text, seller_id_text:seller_id::text, item_quantity, start_price, buyout_price, min_raise, highest_bid, ends_at, status',
      )
      .maybeSingle();
    if (error) {
      console.error('Failed to create auction', error);
      return;
    }
    const inserted = data
      ? {
          id: data.auction_id_text ?? data.auction_id ?? `auction-${Date.now()}`,
          itemId: data.item_id_text ?? insertPayload.item_id,
          sellerId: data.seller_id_text ?? insertPayload.seller_id,
          quantity: data.item_quantity ?? insertPayload.item_quantity,
          startPrice: data.start_price ?? insertPayload.start_price,
          buyoutPrice: data.buyout_price ?? insertPayload.buyout_price,
          minRaise: data.min_raise ?? insertPayload.min_raise,
          highestBid: data.highest_bid ?? null,
          endsAt: data.ends_at ?? insertPayload.ends_at,
          closesIn: data.ends_at ? formatTimeRemaining(data.ends_at) : 'No timer',
        }
      : null;
    if (inserted) {
      setActiveAuctions((prev) => [inserted, ...prev]);
    }
    setNewAuction((prev) => ({
      ...prev,
      itemId: '',
      itemQuantity: 1,
      startPrice: 0,
      buyoutPrice: '',
      minRaise: 0,
    }));
  };

  const activeList = useMemo(() => (auctions.enabled ? activeAuctions : []), [auctions.enabled, activeAuctions]);

  return (
    <div className="page-stack guild-dashboard">
      <SectionHeader
        eyebrow="Guild Dashboard"
        title="Auctions"
        subtitle={`Run high-stakes bidding for ${selectedGuild?.name ?? 'your guild'}.`}
        meta={<span className="status-pill">Auctions</span>}
      />

      <div className="card-grid">
        <ModuleCard icon="🏦" title="Settings" description="Enable bidding, fees, and transparent history." status={auctions.enabled ? 'Active' : 'Disabled'}>
          <ToggleSwitch label="Enable auctions" checked={auctions.enabled} onChange={(value) => updateAuctions({ enabled: value })} />
          <ToggleSwitch
            label="Allow buyouts"
            description="Let sellers set instant purchase prices."
            checked={auctions.buyoutsEnabled ?? false}
            onChange={(value) => updateAuctions({ buyoutsEnabled: value })}
          />
          <SliderInput
            label="Results per page"
            min={3}
            max={8}
            value={auctions.resultsPerPage ?? 4}
            onChange={(value) => updateAuctions({ resultsPerPage: value })}
          />
          <ToggleSwitch
            label="Auction fees"
            description="Take a platform fee when auctions resolve."
            checked={auctions.feeEnabled}
            onChange={(value) => updateAuctions({ feeEnabled: value })}
          />
          {auctions.feeEnabled && (
            <label className="text-control">
              <span>Fee percent</span>
              <NumberInput min={0} max={25} suffix="%" value={auctions.feePercent ?? 6} onChange={(value) => updateAuctions({ feePercent: value })} />
            </label>
          )}
          <p className="helper-text">Auctions live separately from the standard marketplace feed with custom settings.</p>
        </ModuleCard>

        <ModuleCard icon="🎨" title="Appearance" description="Update the auction house name and highlight color." status={isCustomized ? 'Customized' : 'Default'}>
          <label className="text-control">
            <span>Display title</span>
            <input value={appearance.title} onChange={(event) => updateAppearance({ title: event.target.value })} placeholder="Auction House" />
          </label>
          <label className="text-control">
            <span>Color</span>
            <input type="text" value={appearance.color} placeholder="#f97316" onChange={(event) => updateAppearance({ color: event.target.value })} />
          </label>
          <button type="button" className="ghost-btn" onClick={() => updateAppearance(DEFAULT_AUCTION_APPEARANCE)} disabled={!isCustomized}>
            Reset To Default
          </button>
        </ModuleCard>

        <ModuleCard
          icon="📣"
          title="Active Auctions"
          description="Live auctions your members can bid on."
          status={auctions.enabled ? `${activeList.length} live` : 'Disabled'}
        >
          {!auctions.enabled ? (
            <p className="helper-text">Auctions are disabled. Enable them to view live events.</p>
          ) : loadingAuctions ? (
            <p className="helper-text">Loading auctions…</p>
          ) : activeList.length ? (
            <ul className="raffle-summary">
              {activeList.map((auction) => (
                <li key={auction.id}>
                  <div className="raffle-summary__header">
                    <div className="raffle-summary__title">
                      <strong>{auction.itemId}</strong>
                      <p>
                        Qty {auction.quantity} · Start {auction.startPrice}
                        {auction.highestBid ? ` · Top bid ${auction.highestBid}` : ''}
                      </p>
                    </div>
                    <span className="raffle-summary__timer">{auction.closesIn ?? 'No timer'}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="helper-text">No active auctions right now. Create one to get started.</p>
          )}
        </ModuleCard>

        <ModuleCard
          icon="🛠️"
          title="Create Auction"
          description="List an item with starting price and optional buyout."
          status={auctions.enabled ? 'Ready' : 'Disabled'}
        >
          <label className="text-control">
            <span>Item ID</span>
            <input
              value={newAuction.itemId}
              onChange={(event) => setNewAuction((prev) => ({ ...prev, itemId: event.target.value }))}
              placeholder="1234567890"
              disabled={!auctions.enabled}
            />
          </label>
          <label className="text-control">
            <span>Quantity</span>
            <NumberInput
              min={1}
              value={newAuction.itemQuantity}
              onChange={(value) => setNewAuction((prev) => ({ ...prev, itemQuantity: value }))}
              disabled={!auctions.enabled}
            />
          </label>
          <label className="text-control">
            <span>Start price</span>
            <NumberInput
              min={0}
              value={newAuction.startPrice}
              onChange={(value) => setNewAuction((prev) => ({ ...prev, startPrice: value }))}
              disabled={!auctions.enabled}
            />
          </label>
          <label className="text-control">
            <span>Buyout price (optional)</span>
            <NumberInput
              min={0}
              value={newAuction.buyoutPrice === '' ? 0 : newAuction.buyoutPrice}
              onChange={(value) => setNewAuction((prev) => ({ ...prev, buyoutPrice: value }))}
              disabled={!auctions.enabled}
            />
          </label>
          <label className="text-control">
            <span>Minimum raise</span>
            <NumberInput
              min={0}
              value={newAuction.minRaise}
              onChange={(value) => setNewAuction((prev) => ({ ...prev, minRaise: value }))}
              disabled={!auctions.enabled}
            />
          </label>
          <label className="text-control">
            <span>Duration</span>
            <div className="duration-input">
              <NumberInput
                min={1}
                step={1}
                value={newAuction.durationValue}
                onChange={(value) => setNewAuction((prev) => ({ ...prev, durationValue: value }))}
                disabled={!auctions.enabled}
              />
              <select
                value={newAuction.durationUnit}
                onChange={(event) => setNewAuction((prev) => ({ ...prev, durationUnit: event.target.value }))}
                disabled={!auctions.enabled}
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </label>
          <div className="module-card__actions">
            <button type="button" className="primary-btn" onClick={handleCreateAuction} disabled={!auctions.enabled || !sellerDiscordId}>
              Create auction
            </button>
          </div>
          {!sellerDiscordId && auctions.enabled && (
            <p className="helper-text">Your Discord ID is loading; try again in a moment.</p>
          )}
        </ModuleCard>
      </div>

      <div className="page-actions">
        <div>
          <span>Last saved</span>
          <strong>{lastSaved ? new Date(lastSaved).toLocaleString() : 'Not yet saved'}</strong>
        </div>
        <button type="button" className="primary-btn" onClick={() => saveGuild('Auction settings saved')}>
          Save changes
        </button>
      </div>
    </div>
  );
}
