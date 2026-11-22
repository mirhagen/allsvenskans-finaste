import { db } from '@/lib/db';
import { bids, clubs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-15.hawkeye' as Stripe.LatestApiVersion,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (err instanceof Error && err.name === 'StripeValidationError') {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Webhook Error' }, { status: 500 });
  }

  // Hantera händelsen
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata as {
      clubId: string;
      holderName: string;
      message: string;
      crownPrice: string;
    };

    try {
      // Hämta klubb och uppdatera pris
      const club = await db.select().from(clubs).where(eq(clubs.id, metadata.clubId)).execute();
      if (club[0]) {
        const newPrice = (Number(metadata.crownPrice) + 10).toString();

        await db.transaction(async (tx) => {
          // Uppdatera kronpriset
          await tx
            .update(clubs)
            .set({ crownPrice: newPrice, crownHolder: metadata.holderName })
            .where(eq(clubs.id, metadata.clubId))
            .execute();

          // Sparar budet med det nya priset
          await tx
            .insert(bids)
            .values({
              clubId: metadata.clubId,
              holderName: metadata.holderName,
              price: newPrice,
              message: metadata.message,
            })
            .execute();
        });
      }
    } catch (err) {
      console.error('Error processing webhook:', err);
      return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
