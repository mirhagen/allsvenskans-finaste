import { db } from '@/lib/db';
import { bids, clubs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil' as Stripe.LatestApiVersion,
});

export async function POST(request: Request) {
  const { clubId, holderName, message } = await request.json();

  if (!clubId || !holderName) {
    return NextResponse.json({ error: 'Saknar obligatoriska fält' }, { status: 400 });
  }

  // Hämta klubb och aktuellt pris
  const club = await db.select().from(clubs).where(eq(clubs.id, clubId)).execute();
  if (!club[0]) {
    return NextResponse.json({ error: 'Klubb hittades inte' }, { status: 404 });
  }

  const crownPrice = Number(club[0].crownPrice);

  // Skapa Payment Intent — ingen automatic_tax → ingen moms
  const paymentIntent = await (stripe.paymentIntents.create as any)({
    amount: crownPrice * 100, // Stripe använder ören
    currency: 'sek',
    payment_method_types: ['card'],
    metadata: {
      clubId,
      holderName,
      message: message || '',
      crownPrice: crownPrice.toString(),
    },
    description: `Krön ${club[0].name} — ${crownPrice} kr`,
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    amount: crownPrice,
  });
}
