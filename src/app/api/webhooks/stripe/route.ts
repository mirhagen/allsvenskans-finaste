import { db } from '@/lib/db';
import { bids, clubs } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Ingen apiVersion: SDK:n använder den version den är byggd för.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil' as Stripe.LatestApiVersion,
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

type Outcome = 'crowned' | 'refund' | 'duplicate';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Saknar stripe-signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    // Ogiltig signatur eller payload – 400 så att Stripe inte försöker igen i onödan.
    const message = err instanceof Error ? err.message : 'Ogiltig webhook';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (
    event.type === 'payment_intent.succeeded' ||
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded'
  ) {
    try {
      await fulfillPayment(event.data.object);
    } catch (err) {
      // 500 → Stripe skickar om händelsen; hanteringen är idempotent.
      console.error('Error processing webhook:', err);
      return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

/** Hantera både Payment Intent och Checkout Session */
async function fulfillPayment(obj: Stripe.PaymentIntent | Stripe.Checkout.Session): Promise<void> {
  let paymentStatus: string;
  let amountTotal: number;
  let metadata: Record<string, string> | undefined;
  let id: string;
  let paymentIntentId: string | undefined;

  if ('payment_status' in obj) {
    // Checkout Session
    paymentStatus = obj.payment_status;
    amountTotal = obj.amount_total ?? 0;
    metadata = obj.metadata ?? undefined;
    id = obj.id;
    paymentIntentId = typeof obj.payment_intent === 'string' ? obj.payment_intent : obj.payment_intent?.id;
  } else {
    // Payment Intent
    paymentStatus = obj.status === 'succeeded' ? 'paid' : 'unpaid';
    amountTotal = obj.amount_received;
    metadata = obj.metadata ?? undefined;
    id = obj.id;
    paymentIntentId = obj.id;
  }

  if (paymentStatus !== 'paid') return;

  const { clubId, holderName, message } = metadata ?? {};
  if (!clubId || !holderName || amountTotal == null || amountTotal === 0) {
    console.error(`${id} saknar metadata eller belopp`);
    return;
  }

  // Det som faktiskt betalades (öre → kronor), inte vad klienten påstod.
  const paidPrice = amountTotal / 100;

  const outcome = await db.transaction(async (tx): Promise<Outcome> => {
    const inserted = await tx
      .insert(bids)
      .values({
        clubId,
        holderName,
        message: message || null,
        price: String(paidPrice),
        stripeSessionId: id,
        status: 'crowned',
      })
      .onConflictDoNothing({ target: bids.stripeSessionId })
      .returning({ id: bids.id });

    if (inserted.length === 0) {
      // Redan hanterad. Om den återbetalades förut, se till att återbetalningen faktiskt gick igenom.
      const [existing] = await tx
        .select({ status: bids.status })
        .from(bids)
        .where(eq(bids.stripeSessionId, id));
      return existing?.status === 'refunded' ? 'refund' : 'duplicate';
    }

    // Ta bara kronan om priset fortfarande är det som betalades – annars hann någon annan före.
    const updated = await tx
      .update(clubs)
      .set({ crownPrice: String(paidPrice + 10), crownHolder: holderName })
      .where(and(eq(clubs.id, clubId), eq(clubs.crownPrice, String(paidPrice))))
      .returning({ id: clubs.id });

    if (updated.length === 0) {
      await tx.update(bids).set({ status: 'refunded' }).where(eq(bids.id, inserted[0].id));
      return 'refund';
    }
    return 'crowned';
  });

  if (outcome === 'refund') {
    await refund(paymentIntentId);
  } else if (outcome === 'crowned') {
    revalidatePath('/');
    revalidatePath('/leaderboard');
    revalidatePath('/bids');
  }
}

async function refund(paymentIntentId: string | undefined): Promise<void> {
  if (!paymentIntentId) return;

  try {
    await stripe.refunds.create(
      { payment_intent: paymentIntentId, reason: 'duplicate' },
      { idempotencyKey: `refund-${paymentIntentId}` },
    );
  } catch (err) {
    if (err instanceof Stripe.errors.StripeInvalidRequestError && err.code === 'charge_already_refunded') {
      return;
    }
    throw err;
  }
}
