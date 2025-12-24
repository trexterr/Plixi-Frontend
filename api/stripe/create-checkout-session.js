import Stripe from 'stripe';
import { STRIPE_PRICES, MONTHLY_DISCOUNT_COUPON_ENV } from '../_stripePrices.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { planKey, guildId, userId, returnTo } = req.body || {};

  if (!planKey || !userId) {
    res.status(400).json({ error: 'Missing planKey or userId' });
    return;
  }

  const priceId = STRIPE_PRICES[planKey];
  if (!priceId) {
    res.status(400).json({ error: 'Invalid planKey' });
    return;
  }

  const rawSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL ||
    'http://localhost:5173';

  // Vercel's VERCEL_URL is just the host, but Stripe needs a fully-qualified URL
  const siteUrl = rawSiteUrl.startsWith('http')
    ? rawSiteUrl
    : `https://${rawSiteUrl}`;
  const successUrl = `${siteUrl}/pricing?status=success${returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ''}`;
  const cancelUrl = `${siteUrl}/pricing?status=cancelled`;

  const discounts = [];
  const monthlyCoupon = process.env[MONTHLY_DISCOUNT_COUPON_ENV];
  if (monthlyCoupon && planKey.endsWith('_monthly')) {
    discounts.push({ coupon: monthlyCoupon });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        guildId: guildId || '',
        planKey,
      },
      discounts: discounts.length ? discounts : undefined,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Failed to create checkout session', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
