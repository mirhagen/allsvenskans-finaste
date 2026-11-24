import { db } from '@/lib/db';
import { bids, clubs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
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

  // Skapa unik session ID för att koppla ihop med budet
  const sessionData = {
    clubId,
    holderName,
    message: message || '',
    crownPrice: crownPrice.toString(),
  };

  // Skapa Stripe Checkout-session
  const checkoutSession = await (stripe.checkout.sessions.create as any)({
    payment_method_types: ['card'],
    automatic_tax: { enabled: false },
    line_items: [
      {
        price_data: {
          currency: 'sek',
          product_data: {
            name: `Krön ${club[0].name}`,
            description: `Buk för ${crownPrice} kr — krönar ${club[0].name} på Allsvenskans Finaste`,
            tax_code: 'txcd_10000000', // standard product tax code (Stripe Managed Payments)
          },
          unit_amount: crownPrice * 100, // Stripe använder ören
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    metadata: sessionData,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/bid-success?session_id={CHECKOUT_SESSION_ID}&status=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}?status=cancelled`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
