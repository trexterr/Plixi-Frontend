import Stripe from 'stripe';
import { query } from '../_db.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { userId, guildId } = req.body || {};
  if (!userId && !guildId) {
    res.status(400).json({ error: 'Missing userId or guildId' });
    return;
  }

  try {
    let customerId = null;
    if (guildId) {
      const { rows } = await query(
        'select stripe_customer_id from server_subscriptions where guild_id = $1 limit 1',
        [guildId],
      );
      customerId = rows[0]?.stripe_customer_id ?? null;
    }
    // Extend with user-level lookup if you have a user subscriptions table.

    if (!customerId) {
      res.status(404).json({ error: 'No Stripe customer found' });
      return;
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || 'http://localhost:5173';
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl}/billing`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Failed to create billing portal session', error);
    res.status(500).json({ error: 'Failed to create billing portal session' });
  }
}
