import Stripe from 'stripe';
import getRawBody from 'raw-body';
import { STRIPE_PRICES } from '../_stripePrices.js';
import { upsertServerSubscription, cancelServerSubscription } from '../_db.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const planFromPrice = (priceId) => {
  const entry = Object.entries(STRIPE_PRICES).find(([, id]) => id === priceId);
  if (!entry) return { planKey: null, billingCycle: null };
  const [planKey] = entry;
  const billingCycle = planKey.endsWith('_yearly') ? 'yearly' : 'monthly';
  return { planKey, billingCycle };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const buf = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const metadata = session.metadata || {};
        const subscriptionId = session.subscription;
        const customerId = session.customer;
        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items?.data?.[0]?.price?.id;
        const { planKey, billingCycle } = planFromPrice(priceId);

        await upsertServerSubscription({
          guildId: metadata.guildId || null,
          planKey: planKey ?? metadata.planKey ?? null,
          billingCycle: billingCycle ?? null,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          stripePriceId: priceId ?? null,
          status: subscription.status,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
        });
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const priceId = subscription.items?.data?.[0]?.price?.id;
        const { planKey, billingCycle } = planFromPrice(priceId);
        const guildId = subscription.metadata?.guildId || null;

        await upsertServerSubscription({
          guildId,
          planKey: planKey ?? subscription.metadata?.planKey ?? null,
          billingCycle: billingCycle ?? null,
          stripeCustomerId: subscription.customer,
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId ?? null,
          status: subscription.status,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
        });
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const guildId = subscription.metadata?.guildId || null;
        await cancelServerSubscription({
          guildId,
          cancelledAt: subscription.canceled_at,
          status: subscription.status,
        });
        break;
      }
      default:
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler failed', error);
    res.status(500).json({ error: 'Webhook handling failed' });
  }
}
