import Link from 'next/link';
import { ArrowLeft, Crown, Check, PartyPopper } from 'lucide-react';

export default function BidSuccess() {
  return (
    <main className="min-h-screen bg-grid-subtle flex items-center justify-center p-4">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-48 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full text-center relative z-10">
        {/* Success icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6 glow-gold-sm">
          <Check className="w-10 h-10 text-green-400" />
        </div>

        <h1 className="text-4xl font-black text-white mb-2">
          Tack! <span className="text-gold-gradient">🎉</span>
        </h1>
        <p className="text-gray-400 mb-10 text-lg">
          Din betalning är genomförd. Din kroning behandlas och syns snart!
        </p>

        {/* Info card */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-4 glow-gold-sm">
            <Crown className="w-8 h-8 text-black" />
          </div>
          <p className="text-gray-300">
            Din kroning har registrerats och kommer synas när betalningen verifierats.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-black font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 px-8 py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-yellow-500/20 active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          Tillbaka till kronan
        </Link>
      </div>
    </main>
  );
}
