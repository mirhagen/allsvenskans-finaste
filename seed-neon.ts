import { Pool } from '@neondatabase/serverless';
import { db } from '@/lib/db';
import { clubs } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

const clubsData = [
  { name: 'AIK', city: 'Stockholm', founded: 1891, colors: 'Gult/Svart', stadium: 'Strawberry Arena', logo: '/logos/aik.png' },
  { name: 'BK Häcken', city: 'Göteborg', founded: 1969, colors: 'Rött/Vit', stadium: 'Gamla Ullevi', logo: '/logos/bk-hacken.svg' },
  { name: 'Degerfors IF', city: 'Degerfors', founded: 1907, colors: 'Blå/Vit', stadium: 'Stora Valla', logo: '/logos/degerfors-if.svg' },
  { name: 'Djurgårdens IF', city: 'Stockholm', founded: 1891, colors: 'Vit/Svart', stadium: 'Tele2 Arena', logo: '/logos/djurgardens-if.svg' },
  { name: 'GAIS', city: 'Göteborg', founded: 1894, colors: 'Gult/Svart', stadium: 'Gamla Ullevi', logo: '/logos/gais.png' },
  { name: 'Halmstads BK', city: 'Halmstad', founded: 1914, colors: 'Vit/Svart', stadium: 'Örjans Vall', logo: '/logos/halmstads-bk.svg' },
  { name: 'Hammarby IF', city: 'Stockholm', founded: 1897, colors: 'Blå/Gul', stadium: 'Tele2 Arena', logo: '/logos/hammarby-if.svg' },
  { name: 'IF Brommapojkarna', city: 'Stockholm', founded: 1943, colors: 'Blå/Vit', stadium: 'Grimsta IP', logo: '/logos/if-brommapojkarna.svg' },
  { name: 'IF Elfsborg', city: 'Borås', founded: 1904, colors: 'Vit/Svart', stadium: 'Borås Arena', logo: '/logos/if-elfsborg.svg' },
  { name: 'IFK Göteborg', city: 'Göteborg', founded: 1904, colors: 'Blå/Vit', stadium: 'Gamla Ullevi', logo: '/logos/ifk-goteborg.svg' },
  { name: 'IK Sirius', city: 'Uppsala', founded: 1907, colors: 'Blå/Gul', stadium: 'Studenternas', logo: '/logos/ik-sirius.svg' },
  { name: 'Kalmar FF', city: 'Kalmar', founded: 1910, colors: 'Rött/Svart', stadium: 'Guldfågeln Arena', logo: '/logos/kalmar-ff.png' },
  { name: 'Malmö FF', city: 'Malmö', founded: 1910, colors: 'Blå/Vit', stadium: 'Eleda Stadion', logo: '/logos/malmo-ff.svg' },
  { name: 'Mjällby AIF', city: 'Mjällby', founded: 1939, colors: 'Vit/Svart', stadium: 'Strandvallen', logo: '/logos/mjallby-aif.svg' },
  { name: 'Västerås SK', city: 'Västerås', founded: 1924, colors: 'Blå/Vit', stadium: 'Arosvallen', logo: '/logos/vasteras-sk.png' },
  { name: 'Örgryte IS', city: 'Göteborg', founded: 1887, colors: 'Vit/Svart', stadium: 'Gamla Ullevi', logo: '/logos/orgryte-is.png' },
];

async function seed() {
  for (const club of clubsData) {
    await db.insert(clubs).values({ ...club, crownPrice: '10', createdAt: sql`now()` }).onConflictDoNothing();
  }
  const count = await db.select({ count: sql<number>`count(*)` }).from(clubs);
  console.log(`✅ Seedade ${count[0].count} klubbar`);
}
seed().catch(console.error);
