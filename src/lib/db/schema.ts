import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, numeric } from 'drizzle-orm/sqlite-core';

export const clubs = sqliteTable('clubs', {
  id: text('id').primaryKey().default(sql`lower(hex(randomblob(16)))`),
  name: text('name').notNull().unique(),
  city: text('city').notNull(),
  founded: integer('founded'),
  colors: text('colors').notNull(),
  stadium: text('stadium'),
  crownPrice: numeric('crown_price').notNull().default('10'),
  crownHolder: text('crown_holder'),
  crownPriceHistory: text('crown_price_history'), // JSON array of {price, holder, date}
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
});

export const bids = sqliteTable('bids', {
  id: text('id').primaryKey().default(sql`lower(hex(randomblob(16)))`),
  clubId: text('club_id').notNull().references(() => clubs.id),
  holderName: text('holder_name').notNull(),
  price: numeric('price').notNull(),
  message: text('message'),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
});
