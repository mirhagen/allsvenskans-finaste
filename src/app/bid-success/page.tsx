import Link from 'next/link';
import { ArrowLeft, Crown, Check } from 'lucide-react';

export default function BidSuccess() {
  return (
    <main className="min-h-screen bg-[#f8f6f1] bg-pattern flex items-center justify-center p-4">
      {/* Decorative top gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-48 w-96 h-96 bg-yellow-100/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full text-center relative z-10">
        {/* Success icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-2xl mb-6 shadow-sm">
          <Check className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-4xl font-black text-[#1a1a1a] mb-2">
          Tack! <span className="text-amber-500">🎉</span>
        </h1>
        <p className="text-gray-500 mb-10 text-lg">
          Din betalning är genomförd. Din kroning behandlas och syns snart!
        </p>

        {/* Info card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-xl mb-3 shadow-sm">
            <Crown className="w-7 h-7 text-black" />
          </div>
          <p className="text-gray-500">
            Din kroning har registrerats och kommer synas när betalningen verifierats.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-black font-bold bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 px-8 py-4 rounded-xl transition-all hover:shadow-lg active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          Tillbaka till kronan
        </Link>
      </div>
    </main>
  );
}
