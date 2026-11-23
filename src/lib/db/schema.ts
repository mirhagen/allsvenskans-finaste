import { sql } from 'drizzle-orm';
import { pgTable, text, integer, numeric, uuid } from 'drizzle-orm/pg-core';

export const clubs = pgTable('clubs', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  city: text('city').notNull(),
  founded: integer('founded'),
  colors: text('colors').notNull(),
  stadium: text('stadium'),
  logo: text('logo').notNull().default(''),
  crownPrice: numeric('crown_price').notNull().default('10'),
  crownHolder: text('crown_holder'),
  crownPriceHistory: text('crown_price_history'), // JSON array of {price, holder, date}
  createdAt: text('created_at').notNull().default(sql`now()`),
});

export const bids = pgTable('bids', {
  id: uuid('id').primaryKey().defaultRandom(),
  clubId: text('club_id').notNull().references(() => clubs.id),
  holderName: text('holder_name').notNull(),
  price: numeric('price').notNull(),
  message: text('message'),
  // Stripe Checkout Session som betalade budet – unik så att omskickade webhooks inte dubbelbokar
  stripeSessionId: text('stripe_session_id').unique(),
  // 'crowned' = budet tog kronan, 'refunded' = någon hann före, pengarna återbetalade
  status: text('status').notNull().default('crowned'),
  createdAt: text('created_at').notNull().default(sql`now()`),
});
