import { db } from '@/lib/db';
import { bids, clubs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const { clubId, holderName, message } = await request.json();

  if (!clubId || !holderName) {
    return NextResponse.json({ error: 'Saknar obligatoriska fält' }, { status: 400 });
  }

  let newPrice: string = '10';

  await db.transaction(async (tx) => {
    const club = await tx.select().from(clubs).where(eq(clubs.id, clubId)).execute();
    if (!club[0]) throw new Error('Klubb hittades inte');

    newPrice = (Number(club[0].crownPrice) + 10).toString();

    await tx.update(clubs).set({ crownPrice: newPrice, crownHolder: holderName }).where(eq(clubs.id, club[0].id)).execute();

    await tx.insert(bids).values({
      clubId,
      holderName,
      price: newPrice,
      message,
    }).execute();
  });

  revalidatePath('/');
  revalidatePath('/leaderboard');

  return NextResponse.json({ crownPrice: newPrice, crownHolder: holderName });
}

export async function GET() {
  const clubData = await db.select({
    id: clubs.id,
    name: clubs.name,
    city: clubs.city,
    colors: clubs.colors,
    stadium: clubs.stadium,
    founded: clubs.founded,
    logo: clubs.logo,
    crownPrice: clubs.crownPrice,
    crownHolder: clubs.crownHolder,
  }).from(clubs).orderBy(clubs.crownPrice).execute();

  const bidHistory = await db
    .select({
      id: bids.id,
      clubId: bids.clubId,
      clubName: clubs.name,
      holderName: bids.holderName,
      price: bids.price,
      message: bids.message,
      createdAt: bids.createdAt,
    })
    .from(bids)
    .innerJoin(clubs, eq(clubs.id, bids.clubId))
    .orderBy(bids.createdAt)
    .execute();

  return NextResponse.json({ clubs: clubData, bids: bidHistory });
}
