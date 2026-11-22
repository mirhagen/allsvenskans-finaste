import { db } from './src/lib/db';
import { clubs } from './src/lib/db/schema';
import { clubs as clubList } from './src/data/clubs';

// Seed clubs into the database
db.insert(clubs).values(
  clubList.map((c: { name: string; city: string; founded: number; colors: string; stadium: string }) => ({
    name: c.name,
    city: c.city,
    founded: c.founded,
    colors: c.colors,
    stadium: c.stadium,
    crownPrice: '10',
    crownPriceHistory: '[]',
  }))
);

console.log(`Seeded ${clubList.length} clubs.`);
