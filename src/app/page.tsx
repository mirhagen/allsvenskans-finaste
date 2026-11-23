import ClubCard from '@/components/ClubCard';
import { Crown, Trophy } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { clubs } from '@/lib/db/schema';
import { unstable_noStore } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function Home() {
  unstable_noStore();
  const data = await db.select().from(clubs).orderBy(clubs.name);
  const totalRaised = data.reduce((sum, c) => sum + Number(c.crownPrice || 0), 0);
  const crownedCount = data.filter(c => c.crownHolder).length;

  return (
    <main className="min-h-screen bg-pattern">
      {/* Navigation - fixed at top */}
      <nav className="sticky top-0 z-50 px-4 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 flex items-center justify-between px-6 py-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-sm">
                <Crown className="w-4 h-4 text-black" />
              </div>
              <span className="font-black text-sm tracking-tight">
                Allsvenskans <span className="text-amber-600">Finaste</span>
              </span>
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/leaderboard" className="text-gray-500 hover:text-amber-600 transition-colors flex items-center gap-1.5 font-medium">
                <Trophy className="w-4 h-4" />
                Leaderboard
              </Link>
              <Link href="/bids" className="text-gray-500 hover:text-amber-600 transition-colors font-medium">
                Budlogg
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Subtle hero strip */}
      <div className="px-4 pt-4 pb-2">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-4">
            <p className="text-[#1a1a1a] font-black text-3xl md:text-4xl tracking-tight">
              Allsvenskans <span className="text-amber-600">Finaste</span>
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {data.length} troner. {data.length} klubbar. <span className="text-amber-600 font-medium">Vem regerar din?</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <section className="px-4 py-2">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
              <div className="text-2xl font-black text-[#1a1a1a]">{data.length}</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Klubbar</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
              <div className="text-2xl font-black text-amber-500">{crownedCount}</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Trona tagna</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
              <div className="text-2xl font-black text-amber-500">{totalRaised.toLocaleString('sv-SE')}</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Totalt kr</div>
            </div>
          </div>
        </div>
      </section>

      {/* Club Grid */}
      <section className="px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map((club, index) => (
              <ClubCard
                key={club.id}
                club={{
                  id: club.id,
                  name: club.name,
                  city: club.city,
                  founded: club.founded ?? 0,
                  colors: club.colors,
                  stadium: club.stadium ?? '\u2014',
                  logo: club.logo ?? '',
                }}
                crownPrice={Number(club.crownPrice) || 10}
                crownHolder={club.crownHolder ?? undefined}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/60 py-8 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md flex items-center justify-center">
              <Crown className="w-3 h-3 text-black" />
            </div>
            <span className="text-gray-400 font-semibold text-sm">Allsvenskans Finaste</span>
          </div>
          <p className="text-gray-400 text-sm">{data.length} troner. {data.length} klubbar. En krona i taget.</p>
        </div>
      </footer>
    </main>
  );
}
