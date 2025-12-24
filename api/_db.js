import pg from 'pg';

const { Pool } = pg;

const globalForPool = globalThis;

const pool =
  globalForPool.__plixiDbPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  });

if (!globalForPool.__plixiDbPool) {
  globalForPool.__plixiDbPool = pool;
}

export async function query(text, params) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

export async function upsertServerSubscription({
  guildId,
  planKey,
  billingCycle,
  stripeCustomerId,
  stripeSubscriptionId,
  stripePriceId,
  status,
  currentPeriodStart,
  currentPeriodEnd,
}) {
  return query(
    `
      insert into server_subscriptions (
        guild_id, plan, billing_cycle, stripe_customer_id, stripe_subscription_id, stripe_price_id, status,
        current_period_start, current_period_end, cancelled_at
      ) values ($1, $2, $3, $4, $5, $6, $7, to_timestamp($8), to_timestamp($9), null)
      on conflict (guild_id) do update
      set plan = excluded.plan,
          billing_cycle = excluded.billing_cycle,
          stripe_customer_id = excluded.stripe_customer_id,
          stripe_subscription_id = excluded.stripe_subscription_id,
          stripe_price_id = excluded.stripe_price_id,
          status = excluded.status,
          current_period_start = excluded.current_period_start,
          current_period_end = excluded.current_period_end,
          cancelled_at = null
      returning *;
    `,
    [
      guildId,
      planKey,
      billingCycle,
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId,
      status,
      currentPeriodStart ?? null,
      currentPeriodEnd ?? null,
    ],
  );
}

export async function cancelServerSubscription({ guildId, cancelledAt, status }) {
  return query(
    `
      update server_subscriptions
      set status = $2,
          cancelled_at = to_timestamp($3)
      where guild_id = $1
      returning *;
    `,
    [guildId, status ?? 'canceled', cancelledAt ?? Date.now() / 1000],
  );
}
