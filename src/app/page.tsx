import Image from 'next/image';
import ClubCard from '@/components/ClubCard';
import { Crown } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { clubs } from '@/lib/db/schema';
import { unstable_noStore } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function Home() {
  unstable_noStore();
  const data = await db.select().from(clubs).orderBy(clubs.name);
  const totalRaised = data.reduce((sum, c) => sum + Number(c.crownPrice || 0), 0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <nav className="border-b border-gray-800 py-3 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg hover:text-yellow-400 transition-colors">
            Allsvenskans Finaste
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/leaderboard" className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-1 text-sm">
              <Crown className="w-4 h-4" />
              Leaderboard
            </Link>
            <Link href="/bids" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
              Budlogg
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden py-20 px-4 text-center">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 49px, gold 49px, gold 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, gold 49px, gold 50px)',
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <Image src="/crown-icon.svg" alt="Guld-krona" fill className="object-contain" />
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
              ALLSVENSKANS
            </span>
            <br />
            <span className="text-white">FINASTE</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-2 font-light">
            {data.length} troner. {data.length} klubbar.
          </p>
          <p className="text-2xl md:text-3xl text-yellow-400 font-bold mb-2">
            Totalt lyft: {totalRaised.toLocaleString('sv-SE')} kr
          </p>
          <p className="text-lg text-gray-500 mb-12">Vem regerar i din?</p>

          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-16">
            <Crown className="w-4 h-4" />
            <span>Allsvenskans supporterlojalitet, rankad</span>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((club) => (
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
              />
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-8 px-4 text-center text-gray-600 text-sm">
        <p>16 troner. 16 klubbar.</p>
        <p className="mt-1">En krona i taget. En klubb på toppen.</p>
      </footer>
    </main>
  );
}
