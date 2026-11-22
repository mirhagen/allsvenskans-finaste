import Image from 'next/image';
import { Crown, Trophy, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cache } from 'react';
import { db } from '@/lib/db';
import { clubs, bids } from '@/lib/db/schema';

interface ClubRanking {
  id: string;
  name: string;
  city: string;
  founded: number | null;
  colors: string;
  stadium: string | null;
  logo: string;
  crownPrice: string;
  crownHolder: string | null;
  bidCount: number;
  totalRaised: number;
}

const getClubRankings = cache(async () => {
  const clubData = await db
    .select({
      id: clubs.id,
      name: clubs.name,
      city: clubs.city,
      founded: clubs.founded,
      colors: clubs.colors,
      stadium: clubs.stadium,
      crownPrice: clubs.crownPrice,
      crownHolder: clubs.crownHolder,
      logo: clubs.logo,
    })
    .from(clubs)
    .orderBy((db) => db.crownPrice);

  const allBids = await db
    .select({
      clubId: bids.clubId,
      price: bids.price,
    })
    .from(bids);

  const statsMap = new Map<string, { count: number; total: number }>();
  for (const bid of allBids) {
    const existing = statsMap.get(bid.clubId) || { count: 0, total: 0 };
    existing.count += 1;
    existing.total += Number(bid.price);
    statsMap.set(bid.clubId, existing);
  }

  return clubData.reverse().map((c) => {
    const stats = statsMap.get(c.id) || { count: 0, total: 0 };
    return {
      id: c.id,
      name: c.name,
      city: c.city,
      founded: c.founded,
      colors: c.colors,
      stadium: c.stadium,
      crownPrice: c.crownPrice,
      crownHolder: c.crownHolder,
      logo: c.logo,
      bidCount: stats.count,
      totalRaised: stats.total,
    } as ClubRanking;
  });
});

export default async function Leaderboard() {
  const rankings = await getClubRankings();
  const totalRaised = rankings.reduce((sum, c) => sum + Number(c.totalRaised || 0), 0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <section className="relative overflow-hidden py-10 px-4 text-center">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 49px, gold 49px, gold 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, gold 49px, gold 50px)',
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Tillbaka till hem
          </Link>

          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <Image src="/crown-icon.svg" alt="Guld-krona" fill className="object-contain" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
              LEADERBOARD
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-2">
            Totalt lyft: <span className="text-yellow-400 font-bold">{totalRaised.toLocaleString('sv-SE')} kr</span>
          </p>
          <p className="text-sm text-gray-600">
            Ranking efter nuvarande kronpris (högst först)
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {rankings.map((club, index) => (
            <div
              key={club.id}
              className={`flex items-center gap-4 p-4 mb-2 rounded-xl border transition-all ${
                index === 0
                  ? 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/10 border-yellow-500/30'
                  : index === 1
                  ? 'bg-gradient-to-r from-gray-700/30 to-gray-800/10 border-gray-400/20'
                  : index === 2
                  ? 'bg-gradient-to-r from-orange-900/20 to-orange-800/5 border-orange-700/20'
                  : 'bg-gray-900/60 border-gray-800'
              }`}
            >
              <div className="flex-shrink-0 w-10 text-center">
                {index === 0 ? (
                  <Crown className="w-7 h-7 text-yellow-400 mx-auto" />
                ) : index === 1 ? (
                  <Trophy className="w-6 h-6 text-gray-300 mx-auto" />
                ) : index === 2 ? (
                  <Trophy className="w-5 h-5 text-orange-400 mx-auto" />
                ) : (
                  <span className="text-gray-600 font-bold text-lg">#{index + 1}</span>
                )}
              </div>

              <div className="flex-shrink-0 w-10 flex justify-center">
                {club.logo && (
                  <img src={club.logo} alt={club.name} className="w-8 h-8 rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white truncate">{club.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>{club.city}</span>
                  <Calendar className="w-3 h-3 ml-2" />
                  <span>Grundad {club.founded}</span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-yellow-400 font-bold text-xl">
                  {Number(club.crownPrice).toLocaleString('sv-SE')} kr
                </div>
                <div className="text-xs text-gray-500">{club.bidCount} bud</div>
              </div>

              <div className="text-right flex-shrink-0 hidden md:block">
                <div className="text-gray-400 text-sm">Troninnehavare</div>
                <div className="text-white font-semibold">
                  {club.crownHolder || '—'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-800 py-8 px-4 text-center text-gray-600 text-sm">
        <p>En krona i taget. En klubb på toppen.</p>
        <p className="mt-1">Totalt samlat: <span className="text-yellow-400">{totalRaised.toLocaleString('sv-SE')} kr</span></p>
      </footer>
    </main>
  );
}
