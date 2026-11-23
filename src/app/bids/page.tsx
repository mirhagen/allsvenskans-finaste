import Link from 'next/link';
import { ArrowLeft, Crown, MessageSquare } from 'lucide-react';
import { db } from '@/lib/db';
import { bids, clubs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

const DQ = String.fromCharCode(34);

export default async function Bids() {
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
              <span className="text-2xl">🔥</span>
            </div>
          </div>

          <h1 className="text-5xl font-black tracking-tight mb-2">
            <span className="text-gold-gradient">BUDLOGGEN</span>
          </h1>

          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-4">
            <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
              <div className="text-xl font-black text-[#1a1a1a]">{bidHistory.length}</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Bud totalt</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
              <div className="text-xl font-black text-amber-500">{uniqueClubs}</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Klubbar</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
              <div className="text-xl font-black text-amber-500">{totalRaised.toLocaleString('sv-SE')}</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Totalt kr</div>
            </div>
          </div>

          <p className="text-sm text-gray-400">Alla kroningar genom tiden, nyaste först</p>
        </div>
      </section>

      {/* Bid list */}
      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          {bidHistory.length === 0 ? (
            <div className="text-center py-20">
              <Crown className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Inga bud ännu. Var den förste!</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {[...bidHistory].reverse().map((bid) => (
                <div
                  key={bid.id}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
                >
                  {/* Club logo */}
                  <div className="flex-shrink-0">
                    {bid.clubLogo ? (
                      <img src={bid.clubLogo} alt={bid.clubName} className="w-10 h-10 rounded-xl" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                        <Crown className="w-4 h-4 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Club name */}
                  <div className="flex-shrink-0 w-28">
                    <span className="text-[#1a1a1a] font-bold text-sm">{bid.clubName}</span>
                  </div>

                  {/* Holder + message */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-600 text-sm truncate">
                      <strong className="text-[#1a1a1a]">{bid.holderName}</strong>
                      {bid.message && (
                        <span className="text-gray-400 ml-1.5">
                          <MessageSquare className="w-3 h-3 inline" />
                          {DQ}{bid.message}{DQ}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-amber-600 font-bold text-lg tabular-nums">
                      {Number(bid.price).toLocaleString('sv-SE')} kr
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex-shrink-0 w-24 text-right">
                    <time className="text-gray-400 text-xs tabular-nums">
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

      {/* Footer */}
      <footer className="border-t border-gray-200/60 py-8 px-6 text-center">
        <p className="text-gray-400 text-sm">En krona i taget. En klubb på toppen.</p>
      </footer>
    </main>
  );
}
