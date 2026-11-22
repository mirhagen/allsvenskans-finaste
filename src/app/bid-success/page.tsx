import Link from 'next/link';
import { ArrowLeft, Crown, Check } from 'lucide-react';

export default function BidSuccess() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
          <Check className="w-10 h-10 text-green-400" />
        </div>

        <h1 className="text-3xl font-black text-white mb-2">
          Tack! 🎉
        </h1>
        <p className="text-gray-400 mb-8">
          Din betalning är genomförd. Din kroning behandlas och syns snart på sidan.
        </p>

        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-4">
            <Crown className="w-8 h-8 text-black" />
          </div>
          <p className="text-gray-300">
            Din kroning har registrerats och kommer synas när betalningen verifierats.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white font-bold bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tillbaka till kronan
        </Link>
      </div>
    </main>
  );
}
