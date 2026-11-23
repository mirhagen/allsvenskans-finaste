import Image from 'next/image';
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
      {/* Decorative top gradient */}
      <div className="relative h-72 sm:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50" />
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-10 left-10 w-40 h-40 bg-yellow-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-5 right-20 w-56 h-56 bg-amber-200/30 rounded-full blur-3xl" />
          <div className="absolute top-20 right-10 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl" />
        </div>
        {/* Crown shape at top */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-[0.04]">
          <Crown className="w-96 h-96 text-yellow-600" />
        </div>
      </div>

      {/* Navigation - floating bar */}
      <nav className="relative -mt-8 z-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 flex items-center justify-between px-6 py-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-sm">
                <Crown className="w-4 h-4 text-black" />
              </div>
              <span className="font-black text-base tracking-tight">
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

      {/* Hero */}
      <section className="px-4 pt-12 pb-8 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Crown icon */}
          <div className="flex justify-center mb-6 animate-fade-in-up">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 bg-yellow-400/10 rounded-full blur-xl scale-125 crown-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-6 transition-transform">
                <Crown className="w-10 h-10 text-black" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-3 animate-fade-in-up-delay-1">
            <span className="text-gold-gradient">ALLSVENSKANS</span>
            <br />
            <span className="text-[#1a1a1a]">FINASTE</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl text-gray-500 mb-8 font-light animate-fade-in-up-delay-2">
            {data.length} troner. {data.length} klubbar. <span className="text-amber-600 font-medium">Vem regerar din?</span>
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-10">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="text-2xl font-black text-[#1a1a1a]">{data.length}</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Klubbar</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="text-2xl font-black text-amber-500">{crownedCount}</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Trona tagna</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="text-2xl font-black text-amber-500">{totalRaised.toLocaleString('sv-SE')}</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Totalt kr</div>
            </div>
          </div>

          {/* Subtext */}
          <p className="text-gray-400 text-sm animate-fade-in-up-delay-2">
            Betala mer än den som sitter på tronen — så är den din!
          </p>
        </div>
      </section>

      {/* Club Grid */}
      <section className="px-4 pb-20">
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
