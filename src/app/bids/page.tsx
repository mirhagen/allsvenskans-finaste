import Link from 'next/link';
import { ArrowLeft, Crown, MessageSquare, Flame } from 'lucide-react';
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

  // Group by club for a summary
  const clubSummary = new Map<string, { name: string; price: number; count: number }>();
  for (const bid of bidHistory) {
    const existing = clubSummary.get(bid.clubId);
    if (existing) {
      existing.price = Number(bid.price);
      existing.count += 1;
    } else {
      clubSummary.set(bid.clubId, { name: bid.clubName, price: Number(bid.price), count: 1 });
    }
  }

  return (
    <main className="min-h-screen bg-grid-subtle">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-48 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
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
                <Flame className="w-8 h-8 text-black" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
            <span className="text-gold-gradient">BUDLOGGEN</span>
          </h1>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/5">
              <div className="text-xl font-black text-white">{bidHistory.length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Bud totalt</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/5">
              <div className="text-xl font-black text-yellow-400">{uniqueClubs}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Klubbar</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/5">
              <div className="text-xl font-black text-yellow-400">{totalRaised.toLocaleString('sv-SE')}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Totalt kr</div>
            </div>
          </div>

          <p className="text-sm text-gray-500">Alla kroningar genom tiden, nyaste först</p>
        </div>
      </section>

      {/* Bid list */}
      <section className="relative px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          {bidHistory.length === 0 ? (
            <div className="text-center py-20">
              <Crown className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Inga bud ännu. Var den förste!</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {[...bidHistory].reverse().map((bid) => (
                <div
                  key={bid.id}
                  className="flex items-center gap-4 p-4 glass-card rounded-xl"
                >
                  {/* Club logo */}
                  <div className="flex-shrink-0">
                    {bid.clubLogo ? (
                      <img src={bid.clubLogo} alt={bid.clubName} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <Crown className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Club name */}
                  <div className="flex-shrink-0 w-32">
                    <span className="text-white font-bold text-sm">{bid.clubName}</span>
                  </div>

                  {/* Holder + message */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 text-sm truncate">
                      <strong className="text-white">{bid.holderName}</strong>
                      {bid.message && (
                        <span className="text-gray-500 ml-1.5">
                          <MessageSquare className="w-3 h-3 inline" />
                          {DQ}{bid.message}{DQ}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-yellow-400 font-bold text-lg tabular-nums">
                      {Number(bid.price).toLocaleString('sv-SE')} kr
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex-shrink-0 w-24 text-right">
                    <time className="text-gray-600 text-xs tabular-nums">
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
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <p className="text-gray-600 text-sm">En krona i taget. En klubb på toppen.</p>
      </footer>
    </main>
  );
}
