import Link from 'next/link';
import { ArrowLeft, Crown, MessageSquare } from 'lucide-react';
import { db } from '@/lib/db';
import { bids, clubs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { unstable_noStore } from 'next/cache';

export const dynamic = 'force-dynamic';

const DQ = String.fromCharCode(34);

export default async function Bids() {
  unstable_noStore();
  const bidHistory = await db
    .select({
      id: bids.id,
      clubId: bids.clubId,
      clubName: clubs.name,
      clubLogo: clubs.logo,
      holderName: bids.holderName,
      price: bids.price,
      message: bids.message,
      createdAt: bids.createdAt,
    })
    .from(bids)
    .innerJoin(clubs, eq(clubs.id, bids.clubId))
    .orderBy(bids.createdAt)
    .execute();

  const totalRaised = bidHistory.reduce((sum, b) => sum + Number(b.price), 0);
  const uniqueClubs = new Set(bidHistory.map(b => b.clubName)).size;

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
              <img src="/crown-icon.svg" alt="Krona" className="w-full h-full object-contain" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
              BUDLOGGEN
            </span>
          </h1>

          <div className="flex justify-center gap-8 text-gray-400 mb-2">
            <span>{bidHistory.length} bud</span>
            <span>{uniqueClubs} klubbar</span>
            <span className="text-yellow-400 font-bold">{totalRaised.toLocaleString('sv-SE')} kr totalt</span>
          </div>
          <p className="text-sm text-gray-600">Alla kroningar genom tiden, nyaste först</p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {bidHistory.length === 0 ? (
            <div className="text-center py-20">
              <Crown className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Inga bud ännu. Var den förste!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {bidHistory.map((bid) => (
                <div
                  key={bid.id}
                  className="flex items-center gap-4 p-4 bg-gray-900/60 border border-gray-800 rounded-xl hover:border-gray-700 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {bid.clubLogo && (
                      <img src={bid.clubLogo} alt={bid.clubName} className="w-10 h-10 rounded-full" />
                    )}
                  </div>

                  <div className="flex-shrink-0 w-36">
                    <span className="text-white font-bold text-sm">{bid.clubName}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 text-sm truncate">
                      <strong className="text-white">{bid.holderName}</strong>
                      {bid.message && (
                        <span className="text-gray-500 ml-1">
                          <MessageSquare className="w-3 h-3 inline" />
                          {DQ}{bid.message}{DQ}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <div className="text-yellow-400 font-bold text-lg">{Number(bid.price).toLocaleString('sv-SE')} kr</div>
                  </div>

                  <div className="flex-shrink-0 w-28 text-right">
                    <time className="text-gray-600 text-xs">
                      {new Date(bid.createdAt).toLocaleDateString('sv-SE', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-gray-800 py-8 px-4 text-center text-gray-600 text-sm">
        <p>16 troner. 16 klubbar.</p>
        <p className="mt-1">En krona i taget. En klubb på toppen.</p>
      </footer>
    </main>
  );
}
