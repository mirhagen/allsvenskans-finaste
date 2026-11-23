import Image from 'next/image';
import { Crown, Trophy, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { clubs, bids } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

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

async function getClubRankings(): Promise<ClubRanking[]> {
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
    .orderBy(clubs.crownPrice);

  const allBids = await db
    .select({
      clubId: bids.clubId,
      price: bids.price,
    })
    .from(bids)
    .where(eq(bids.status, 'crowned'));

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
}

// Helper to extract primary colors for borders
function getClubColors(colors: string) {
  const [c1] = colors.split('/');
  const colorMap: Record<string, string> = {
    'Gult': '#FFD700',
    'Svart': '#1f2937',
    'Blå': '#1E40AF',
    'Vit': '#e5e7eb',
    'Rött': '#DC2626',
    'Grönt': '#16A34A',
  };
  return colorMap[c1?.trim()] || '#4b5563';
}

export default async function Leaderboard() {
  const rankings = await getClubRankings();
  const totalRaised = rankings.reduce((sum, c) => sum + Number(c.totalRaised || 0), 0);

  return (
    <main className="min-h-screen bg-grid-subtle">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center justify-between py-4 px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <Crown className="w-6 h-6 text-yellow-400 group-hover:rotate-12 transition-transform" />
            <span className="text-white font-bold text-lg tracking-tight">
              Allsvenskans <span className="text-yellow-400">Finaste</span>
            </span>
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Tillbaka
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="relative px-6 pt-10 pb-8 text-center">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-2xl scale-150" />
              <div className="relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full glow-gold">
                <Crown className="w-8 h-8 text-black" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
            <span className="text-gold-gradient">LEADERBOARD</span>
          </h1>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/5">
              <div className="text-xl font-black text-white">{rankings.filter(c => c.crownHolder).length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Trona tagna</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/5">
              <div className="text-xl font-black text-yellow-400">{rankings.reduce((s, c) => s + c.bidCount, 0)}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Totala bud</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/5">
              <div className="text-xl font-black text-yellow-400">{totalRaised.toLocaleString('sv-SE')}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Totalt kr</div>
            </div>
          </div>
        </div>
      </section>

      {/* Rankings */}
      <section className="relative px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          {rankings.map((club, index) => {
            const isTop3 = index < 3;
            const borderColor = getClubColors(club.colors);
            return (
              <div
                key={club.id}
                className={`flex items-center gap-4 p-4 mb-2.5 rounded-xl border transition-all ${
                  index === 0
                    ? 'bg-gradient-to-r from-yellow-900/20 to-yellow-800/5 border-yellow-500/30'
                    : index === 1
                    ? 'bg-white/[0.03] border-gray-400/20'
                    : index === 2
                    ? 'bg-gradient-to-r from-orange-900/15 to-orange-800/5 border-orange-700/20'
                    : 'glass-card'
                }`}
              >
                {/* Position */}
                <div className="flex-shrink-0 w-8 text-center">
                  {index === 0 ? (
                    <Crown className="w-6 h-6 text-yellow-400 mx-auto" />
                  ) : index === 1 ? (
                    <span className="text-gray-300 font-black text-lg">2</span>
                  ) : index === 2 ? (
                    <span className="text-orange-400 font-black text-lg">3</span>
                  ) : (
                    <span className="text-gray-600 font-bold text-sm">#{index + 1}</span>
                  )}
                </div>

                {/* Club logo */}
                <div className="flex-shrink-0">
                  {club.logo ? (
                    <img src={club.logo} alt={club.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10" />
                  )}
                </div>

                {/* Club info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white truncate">{club.name}</h3>
                    {isTop3 && (
                      <div className="h-1 w-5 rounded-full" style={{ backgroundColor: borderColor, opacity: 0.6 }} />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>{club.city}</span>
                    <Calendar className="w-3 h-3 ml-2 shrink-0" />
                    <span>{club.founded}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <div className="text-yellow-400 font-bold text-lg tabular-nums">
                    {Number(club.crownPrice).toLocaleString('sv-SE')} kr
                  </div>
                  <div className="text-xs text-gray-500">{club.bidCount} bud</div>
                </div>

                {/* Crown holder */}
                <div className="text-right flex-shrink-0 hidden lg:block ml-4">
                  <div className="text-xs text-gray-500">Regent</div>
                  <div className={`font-semibold text-sm ${club.crownHolder ? 'text-yellow-400' : 'text-gray-500'}`}>
                    {club.crownHolder || '—'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <p className="text-gray-600 text-sm">En krona i taget. En klubb på toppen.</p>
        <p className="text-gray-700 text-xs mt-1">Totalt samlat: <span className="text-yellow-500/60">{totalRaised.toLocaleString('sv-SE')} kr</span></p>
      </footer>
    </main>
  );
}
