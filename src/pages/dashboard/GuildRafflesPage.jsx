import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SectionHeader from '../../components/SectionHeader';
import ToggleSwitch from '../../components/ToggleSwitch';
import ModuleCard from '../../components/ModuleCard';
import NumberInput from '../../components/NumberInput';
import useGuildSettings from '../../hooks/useGuildSettings';
import { supabase } from '../../lib/supabase';

const computeEndsAt = (value, unit) => {
  const now = new Date();
  const safeValue = Number.isFinite(value) ? value : 0;
  const multiplier = unit === 'minutes' ? 60 : unit === 'hours' ? 60 * 60 : 60 * 60 * 24;
  const ms = safeValue * multiplier * 1000;
  return new Date(now.getTime() + ms).toISOString();
};

const formatTimeRemaining = (endsAt) => {
  if (!endsAt) return 'No timer';
  const end = new Date(endsAt).getTime();
  const now = Date.now();
  const diff = Math.max(0, end - now);
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

export default function GuildRafflesPage() {
  const location = useLocation();
  const { guild, updateGuild, saveGuild, selectedGuild, lastSaved } = useGuildSettings();
  const [activeRaffles, setActiveRaffles] = useState([]);
  const [loadingRaffles, setLoadingRaffles] = useState(false);
  const [selectedRaffleId, setSelectedRaffleId] = useState(null);
  const [newRaffle, setNewRaffle] = useState(() => ({
    name: '',
    ticketPrice: guild.raffles.ticketPrice ?? 0,
    prizeName: '',
    prizeQuantity: guild.raffles.prizeQuantity ?? 1,
    durationValue: guild.raffles.durationDays ?? 1,
    durationUnit: 'days',
  }));
  const rafflesEnabled = guild.raffles.enabled !== false;
  const activeLimit = guild.raffles.activeLimit ?? Infinity;
  const remainingSlots = Math.max(activeLimit - activeRaffles.length, 0);
  const slotLabel =
    remainingSlots === Infinity
      ? '∞ slots open'
      : `${remainingSlots} ${remainingSlots === 1 ? 'slot' : 'slots'} open`;
  const durationInvalid =
    !Number.isFinite(newRaffle.durationValue) ||
    !Number.isInteger(newRaffle.durationValue) ||
    newRaffle.durationValue < 1;
  const selectedRaffle = activeRaffles.find((raffle) => raffle.id === selectedRaffleId) ?? null;
  const selectedRaffleTopBuyers = selectedRaffle
    ? Array.isArray(selectedRaffle.topBuyers)
      ? selectedRaffle.topBuyers
      : selectedRaffle.topBuyer
        ? [{ id: `${selectedRaffle.id}-top`, name: selectedRaffle.topBuyer, tickets: selectedRaffle.ticketsSold ?? 0 }]
        : []
    : [];
  const prizeQuantity = selectedRaffle?.prizeQuantity ?? guild.raffles.prizeQuantity ?? 1;
  const prevLocationKeyRef = useRef(location.key);
  const createRaffleDisabled = !rafflesEnabled || remainingSlots <= 0;
  const canCreateRaffle =
    rafflesEnabled && newRaffle.name.trim().length > 0 && newRaffle.prizeName.trim().length > 0;
  const selectedRaffle = useMemo(
    () => activeRaffles.find((raffle) => raffle.id === selectedRaffleId) ?? null,
    [activeRaffles, selectedRaffleId],
  );

  useEffect(() => {
    const prevKey = prevLocationKeyRef.current;
    if (prevKey !== location.key && selectedRaffleId) {
      setSelectedRaffleId(null);
    }
    prevLocationKeyRef.current = location.key;
  }, [location.key, selectedRaffleId]);

  useEffect(() => {
    setNewRaffle((prev) => ({
      ...prev,
      ticketPrice: guild.raffles.ticketPrice ?? prev.ticketPrice ?? 0,
      prizeQuantity: guild.raffles.prizeQuantity ?? prev.prizeQuantity ?? 1,
      durationValue: guild.raffles.durationDays ?? prev.durationValue ?? 1,
    }));
  }, [guild.raffles.ticketPrice, guild.raffles.prizeQuantity, guild.raffles.durationDays]);

  useEffect(() => {
    let isMounted = true;
    const loadRaffles = async () => {
      if (!selectedGuild?.id) {
        setActiveRaffles([]);
        return;
      }
      setLoadingRaffles(true);
      const { data, error } = await supabase
        .from('active_raffles')
        .select(
          'raffle_id_text:raffle_id::text, title, ticket_price, prize_quantity, is_item, prize_item_id, currency_amount, ends_at, status, created_at',
        )
        .eq('guild_id', selectedGuild.id)
        .eq('status', 'active')
        .order('ends_at', { ascending: true });
      if (!isMounted) return;
      if (error) {
        console.error('Failed to load raffles', error);
        setActiveRaffles([]);
        setLoadingRaffles(false);
        return;
      }
      const mapped = Array.isArray(data)
        ? data.map((row) => ({
            id: row.raffle_id_text ?? row.raffle_id ?? `raffle-${row.title ?? ''}`,
            name: row.title ?? 'Raffle',
            ticketsSold: 0,
            closesIn: row.ends_at ? formatTimeRemaining(row.ends_at) : 'No timer',
            creator: '@You',
            price: row.ticket_price ?? 0,
            prize: row.prize_name ?? (row.is_item ? 'Item reward' : 'Currency reward'),
            prizeQuantity: row.prize_quantity ?? 1,
            endsAt: row.ends_at ?? null,
          }))
        : [];
      setActiveRaffles(mapped);
      setLoadingRaffles(false);
    };
    loadRaffles();
    return () => {
      isMounted = false;
    };
  }, [selectedGuild?.id]);

  const handleCreateRaffle = async () => {
    if (!canCreateRaffle || durationInvalid || !selectedGuild?.id) return;
    const endsAt = computeEndsAt(newRaffle.durationValue, newRaffle.durationUnit);
    const insertPayload = {
      guild_id: selectedGuild.id,
      title: newRaffle.name.trim(),
      ticket_price: newRaffle.ticketPrice ?? 0,
      prize_quantity: newRaffle.prizeQuantity ?? 1,
      is_item: false,
      prize_item_id: null,
      currency_amount: null,
      ends_at: endsAt,
      status: 'active',
    };

    const { data, error } = await supabase
      .from('active_raffles')
      .insert(insertPayload)
      .select(
        'raffle_id_text:raffle_id::text, title, ticket_price, prize_quantity, is_item, prize_item_id, currency_amount, ends_at, status, created_at',
      )
      .maybeSingle();

    if (error) {
      console.error('Failed to create raffle', error);
      return;
    }

    const inserted = data
      ? {
          id: data.raffle_id_text ?? data.raffle_id ?? `raffle-${Date.now()}`,
          name: data.title ?? insertPayload.title,
          ticketsSold: 0,
          closesIn: data.ends_at ? formatTimeRemaining(data.ends_at) : 'No timer',
          creator: '@You',
          price: data.ticket_price ?? insertPayload.ticket_price,
          prize: newRaffle.prizeName?.trim() || (data.is_item ? 'Item reward' : 'Currency reward'),
          prizeQuantity: data.prize_quantity ?? insertPayload.prize_quantity,
          endsAt: data.ends_at ?? insertPayload.ends_at,
        }
      : null;

    if (inserted) {
      setActiveRaffles((prev) => [inserted, ...prev]);
    }

    setNewRaffle({
      name: '',
      ticketPrice: guild.raffles.ticketPrice ?? 0,
      prizeName: '',
      prizeQuantity: guild.raffles.prizeQuantity ?? 1,
      durationValue: guild.raffles.durationDays ?? 1,
      durationUnit: newRaffle.durationUnit,
    });
  };

  const activeRaffleList = rafflesEnabled ? activeRaffles : [];

  if (selectedRaffle) {
    return (
      <div className="page-stack guild-dashboard">
        <SectionHeader
          eyebrow="Guild Dashboard"
          title={`Raffle · ${selectedRaffle.name}`}
          subtitle="Deep dive into performance, buyers, and timing."
          meta={<span className="status-pill">Raffle details</span>}
        />

        <div className="raffle-detail">
          <div className="raffle-detail__header">
            <button type="button" className="ghost-btn ghost-btn--xs" onClick={() => setSelectedRaffleId(null)}>
              ← Back to raffles
            </button>
            <span className="status-pill">{selectedRaffle.ticketsSold ?? 0} tickets sold</span>
          </div>
          <div className="raffle-detail__layout">
            <div className="raffle-detail__buyers">
              <h4>Top buyers</h4>
              {selectedRaffleTopBuyers.length ? (
                <ul>
                  {selectedRaffleTopBuyers.slice(0, 10).map((buyer) => (
                    <li key={buyer.id ?? buyer.name}>
                      <strong>{buyer.name}</strong>
                      <span>{buyer.tickets} tickets</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="helper-text">No buyer data yet.</p>
              )}
            </div>
            <div className="raffle-detail__content">
              <div className="raffle-detail__row">
                <span>Prize</span>
                <strong>{`${selectedRaffle?.prize ?? guild.raffles.prizeName} × ${prizeQuantity}`}</strong>
              </div>
              <div className="raffle-detail__row">
                <span>Ticket price</span>
                <strong>{selectedRaffle.price ?? guild.raffles.ticketPrice}</strong>
              </div>
              <div className="raffle-detail__row">
                <span>Created by</span>
                <strong>{selectedRaffle.creator ?? 'Unknown'}</strong>
              </div>
              <div className="raffle-detail__row">
                <span>Tickets sold</span>
                <strong>{selectedRaffle.ticketsSold ?? 0}</strong>
              </div>
              <div className="raffle-detail__row">
                <span>Time left</span>
                <strong>{selectedRaffle.closesIn ?? 'No timer'}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack guild-dashboard">
      <SectionHeader
        eyebrow="Guild Dashboard"
        title="Raffles"
        subtitle={`Reward funnels, ticket caps, and prize pools for ${selectedGuild?.name ?? 'your guild'}.`}
        meta={<span className="status-pill">{rafflesEnabled ? 'Raffles live' : 'Disabled'}</span>}
      />

      <div className="card-grid">
        <ModuleCard
          icon="⚙️"
          title="Settings"
          description="Ticket pricing, prize pools, durations, and logging."
          status={rafflesEnabled ? 'Active' : 'Disabled'}
        >
          <ToggleSwitch
            label="Enable raffles"
            checked={guild.raffles.enabled}
            onChange={(value) => updateGuild((prev) => ({ ...prev, raffles: { ...prev.raffles, enabled: value } }))}
          />
        </ModuleCard>

        <ModuleCard
          icon="📣"
          title="Active Raffles"
          description="Live events members can join right now."
          status={
            rafflesEnabled
              ? `${activeRaffleList.length}/${activeLimit === Infinity ? '∞' : activeLimit} live`
              : 'Disabled'
          }
        >
          {!rafflesEnabled ? (
            <p className="helper-text">Raffles are disabled. Enable them to view live events.</p>
          ) : loadingRaffles ? (
            <p className="helper-text">Loading raffles…</p>
          ) : activeRaffleList.length ? (
            <ul className="raffle-summary">
              {activeRaffleList.map((raffle) => (
                <li key={raffle.id}>
                  <div className="raffle-summary__header">
                    <div className="raffle-summary__title">
                      <strong>{raffle.name}</strong>
                      <p>{raffle.ticketsSold ?? 0} tickets sold</p>
                    </div>
                    <span className="raffle-summary__timer">{raffle.closesIn ?? 'No timer'}</span>
                  </div>
                  <div className="raffle-summary__actions">
                    <button type="button" className="ghost-btn ghost-btn--xs" onClick={() => setSelectedRaffleId(raffle.id)}>
                      View stats
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="helper-text">No active raffles right now. Launch one to hype your community.</p>
          )}
        </ModuleCard>

        <ModuleCard
          icon="🎟️"
          title="Create Raffle"
          description="Spin up a new event with preset pricing."
          status={
            rafflesEnabled
              ? slotLabel
              : 'Disabled'
          }
        >
          <label className="text-control">
            <span>Raffle name</span>
            <input
              value={newRaffle.name}
              onChange={(event) => setNewRaffle((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Nebula Eclipse"
              disabled={createRaffleDisabled}
            />
          </label>
          <label className="text-control">
            <span>Ticket price</span>
            <NumberInput
              min={0}
              value={newRaffle.ticketPrice}
              onChange={(value) => setNewRaffle((prev) => ({ ...prev, ticketPrice: value }))}
              disabled={createRaffleDisabled}
            />
          </label>
          <label className="text-control">
            <span>Prize name</span>
            <input
              value={newRaffle.prizeName}
              onChange={(event) => setNewRaffle((prev) => ({ ...prev, prizeName: event.target.value }))}
              placeholder="Mythic Token"
              disabled={createRaffleDisabled}
            />
          </label>
          <label className="text-control">
            <span>Prize quantity</span>
            <NumberInput
              min={1}
              value={newRaffle.prizeQuantity}
              onChange={(value) => setNewRaffle((prev) => ({ ...prev, prizeQuantity: value }))}
              disabled={createRaffleDisabled}
            />
          </label>
          <label className={`text-control ${durationInvalid ? 'has-error' : ''}`}>
            <span>Duration</span>
            <div className="duration-input">
              <NumberInput
                min={1}
                step={1}
                value={newRaffle.durationValue}
                onChange={(value) => setNewRaffle((prev) => ({ ...prev, durationValue: value }))}
                disabled={createRaffleDisabled}
              />
              <select
                value={newRaffle.durationUnit}
                onChange={(event) => setNewRaffle((prev) => ({ ...prev, durationUnit: event.target.value }))}
                disabled={createRaffleDisabled}
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
            {durationInvalid && <p className="error-text">Duration must be a whole number.</p>}
          </label>
          <div className="module-card__actions">
            <button
              type="button"
              className="primary-btn"
              disabled={createRaffleDisabled || !canCreateRaffle || durationInvalid}
              onClick={handleCreateRaffle}
            >
              Create raffle
            </button>
          </div>
          {!rafflesEnabled && <p className="helper-text">Enable raffles to create a new event.</p>}
          {rafflesEnabled && remainingSlots <= 0 && (
            <p className="helper-text">You're at capacity. Remove a raffle to free a slot.</p>
          )}
        </ModuleCard>
      </div>

      <div className="page-actions">
        <div>
          <span>Last saved</span>
          <strong>{lastSaved ? new Date(lastSaved).toLocaleString() : 'Not yet saved'}</strong>
        </div>
        <button type="button" className="primary-btn" onClick={() => saveGuild('Raffles settings saved')}>
          Save changes
        </button>
      </div>
    </div>
  );
}
