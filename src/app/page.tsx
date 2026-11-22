import Image from 'next/image';
import ClubCard from '@/components/ClubCard';
import { clubList as clubs } from '@/data/clubs';
import { Crown } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4 text-center">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 49px, gold 49px, gold 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, gold 49px, gold 50px)',
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <Image
                src="/crown-icon.svg"
                alt="Guld-krona"
                fill
                className="object-contain"
              />
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
            18 troner. 18 klubbar.
          </p>
          <p className="text-2xl md:text-3xl text-yellow-400 font-bold mb-12">
            Vem regerar i din?
          </p>

          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-16">
            <Crown className="w-4 h-4" />
            <span>Allsvenskans supporterlojalitet, rankad</span>
          </div>
        </div>
      </section>

      {/* Clubs Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 text-center text-gray-600 text-sm">
        <p>En krona i taget. En klubb på toppen.</p>
      </footer>
    </main>
  );
}
