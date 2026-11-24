import Image from 'next/image';
import { Crown, Trophy, MapPin, Calendar } from 'lucide-react';
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

// Riktiga Allsvenskan-färger (brand-accurate, källor: colorcodeguide.com, RSSSF, idrottslaget.se, officiella profilguider)
const CLUB_COLORS: Record<string, string> = {
  'AIK': '#000000',
  'BK Häcken': '#FFDF00',
  'Degerfors IF': '#E30613',
  'Djurgårdens IF': '#002554',
  'GAIS': '#000000',
  'Halmstads BK': '#1E40AF',
  'Hammarby IF': '#217A4A',
  'IF Brommapojkarna': '#FF0000',
  'IF Elfsborg': '#FFDD00',
  'IFK Göteborg': '#234B9A',
  'IK Sirius': '#0033FF',
  'Kalmar FF': '#C8102E',
  'Malmö FF': '#008ECB',
  'Mjällby AIF': '#FFEE00',
  'Västerås SK': '#16a34a',
  'Örgryte IS': '#E30613',
};

// Helper to extract primary colors for borders
function getClubColors(colors: string) {
  const [c1] = colors.split('/');
  const colorMap: Record<string, string> = {
    'Mörkblå': '#002554',
    'Ljusblå': '#32baf2',
    'Gult': '#FFD700',
    'Svart': '#18181b',
    'Blå': '#1E40AF',
    'Vit': '#f8fafc',
    'Rött': '#DC2626',
    'Grönt': '#16a34a',
    'Gul': '#FFDD00',
  };
  return colorMap[c1?.trim()] || '#6b7280';
}

export default async function Leaderboard() {
  const rankings = await getClubRankings();
  const totalRaised = rankings.reduce((sum, c) => sum + Number(c.totalRaised || 0), 0);

  return (
    <main className="min-h-screen bg-[#f8f6f1] bg-pattern">
      {/* Decorative top gradient */}
      <div className="relative h-52 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50" />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-8 left-20 w-32 h-32 bg-yellow-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-5 right-10 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Navigation - floating bar */}
      <nav className="relative -mt-8 z-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 flex items-center justify-between px-6 py-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-sm">
                <Crown className="w-4 h-4 text-black" />
              </div>
              <span className="font-black text-base tracking-tight">
                Allsvenskans <span className="text-amber-600">Finaste</span>
              </span>
            </Link>
            <Link href="/" className="text-gray-500 hover:text-amber-600 transition-colors flex items-center gap-1.5 text-sm font-medium">
              ← Tillbaka
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="px-4 pt-10 pb-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
              <Crown className="w-7 h-7 text-black" />
            </div>
          </div>

          <h1 className="text-5xl font-black tracking-tight mb-2">
            <span className="text-gold-gradient">LEADERBOARD</span>
          </h1>

          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-4">
            <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
              <div className="text-xl font-black text-[#1a1a1a]">{rankings.filter(c => c.crownHolder).length}</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Trona tagna</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
              <div className="text-xl font-black text-amber-500">{rankings.reduce((s, c) => s + c.bidCount, 0)}</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Totala bud</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
              <div className="text-xl font-black text-amber-500">{totalRaised.toLocaleString('sv-SE')}</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Totalt kr</div>
            </div>
          </div>
        </div>
      </section>

      {/* Rankings */}
      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          {rankings.map((club, index) => {
            const isTop3 = index < 3;
            const accentColor = CLUB_COLORS[club.name] || getClubColors(club.colors);
            return (
              <div
                key={club.id}
                className={`flex items-center gap-4 p-4 mb-2.5 rounded-xl border transition-all ${
                  index === 0
                    ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-sm'
                    : index === 1
                    ? 'bg-white border-gray-100 shadow-sm'
                    : index === 2
                    ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100 shadow-sm'
                    : 'bg-white border-gray-100 shadow-sm hover:border-gray-200'
                }`}
              >
                {/* Position */}
                <div className="flex-shrink-0 w-8 text-center">
                  {index === 0 ? (
                    <Crown className="w-6 h-6 text-amber-500 mx-auto" />
                  ) : index === 1 ? (
                    <span className="text-gray-400 font-black text-lg">2</span>
                  ) : index === 2 ? (
                    <span className="text-orange-400 font-black text-lg">3</span>
                  ) : (
                    <span className="text-gray-300 font-bold text-sm">{index + 1}</span>
                  )}
                </div>

                {/* Club logo */}
                <div className="flex-shrink-0">
                  {club.logo ? (
                    <img src={club.logo} alt={club.name} className="w-10 h-10 rounded-xl" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100" />
                  )}
                </div>

                {/* Club info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#1a1a1a] truncate">{club.name}</h3>
                    {isTop3 && (
                      <div className="h-1 w-4 rounded-full" style={{ backgroundColor: accentColor, opacity: 0.5 }} />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>{club.city}</span>
                    <Calendar className="w-3 h-3 ml-2 shrink-0" />
                    <span>{club.founded}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <div className="text-amber-600 font-bold text-lg tabular-nums">
                    {Number(club.crownPrice).toLocaleString('sv-SE')} kr
                  </div>
                  <div className="text-xs text-gray-400">{club.bidCount} bud</div>
                </div>

                {/* Crown holder */}
                <div className="text-right flex-shrink-0 hidden md:block ml-4">
                  <div className="text-xs text-gray-400">Regent</div>
                  <div className={`font-semibold text-sm ${club.crownHolder ? 'text-amber-600' : 'text-gray-300'}`}>
                    {club.crownHolder || '—'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/60 py-8 px-6 text-center">
        <p className="text-gray-400 text-sm">En krona i taget. En klubb på toppen.</p>
      </footer>
    </main>
  );
}
