import Image from 'next/image';
import ClubCard from '@/components/ClubCard';
import { Crown, Swords, Trophy, MapPin, Calendar } from 'lucide-react';
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
    <main className="min-h-screen bg-grid-subtle">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-48 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-yellow-600/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <Crown className="w-6 h-6 text-yellow-400 group-hover:rotate-12 transition-transform" />
            <span className="text-white font-bold text-lg tracking-tight">
              Allsvenskans <span className="text-yellow-400">Finaste</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/leaderboard" className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-1.5 text-sm font-medium">
              <Trophy className="w-4 h-4" />
              Leaderboard
            </Link>
            <Link href="/bids" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm font-medium">
              Budlogg
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-12 text-center">
        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Crown icon */}
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-2xl scale-150" />
              <div className="relative w-20 h-20 flex items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full glow-gold crown-pulse">
                <Crown className="w-10 h-10 text-black" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 animate-fade-in-up-delay-1">
            <span className="text-gold-gradient">ALLSVENSKANS</span>
            <br />
            <span className="text-white/90">FINASTE</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-400 mb-8 font-light animate-fade-in-up-delay-2">
            {data.length} troner. {data.length} klubbar. Vem regerar din?
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/5">
              <div className="text-2xl md:text-3xl font-black text-white">{data.length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Klubbar</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/5">
              <div className="text-2xl md:text-3xl font-black text-yellow-400">{crownedCount}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Trona tagna</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/5">
              <div className="text-2xl md:text-3xl font-black text-yellow-400">{totalRaised.toLocaleString('sv-SE')}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Totalt kr</div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-center gap-3 text-gray-500 text-sm animate-fade-in-up-delay-2">
            <Swords className="w-4 h-4" />
            <span>Allsvenskans supporterlojalitet, rankad – betala och krön</span>
          </div>
        </div>
      </section>

      {/* Club Grid */}
      <section className="relative px-6 pb-24">
        <div className="max-w-6xl mx-auto">
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
      <footer className="border-t border-white/5 py-10 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Crown className="w-5 h-5 text-yellow-500/50" />
            <span className="text-gray-400 font-semibold">Allsvenskans Finaste</span>
          </div>
          <p className="text-gray-600 text-sm">
            {data.length} troner. {data.length} klubbar. En krona i taget.
          </p>
        </div>
      </footer>
    </main>
  );
}
