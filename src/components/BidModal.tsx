'use client';

import { Crown, X, Check } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BidModalProps {
  club: { id: string; name: string; city: string; colors: string };
  crownPrice: number;
  crownHolder?: string;
  onClose: () => void;
}

export default function BidModal({ club, crownPrice, crownHolder, onClose }: BidModalProps) {
  const [paidPrice, setPaidPrice] = useState(crownPrice);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/bids/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clubId: club.id,
          holderName: name.trim(),
          message: message.trim(),
        }),
      });
      if (!res.ok) throw new Error('Kunde inte skapa betalning');
      const data = await res.json();
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ett fel inträffade');
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl max-w-md w-full p-8 relative shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative top gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 to-amber-500" />

          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-xl mb-3 shadow-md">
              <Crown className="w-7 h-7 text-black" />
            </div>
            <h2 className="text-xl font-black text-[#1a1a1a]">
              Krön {club.name}
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">
              {club.city} • {club.colors}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Form step */}
          {step === 'form' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1.5 font-medium">Ditt namn</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="T.ex. Anders L."
                  autoFocus
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1.5 font-medium">Hälsning (valfritt)</label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Låt oss vinna Allsvenskan!"
                  maxLength={80}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                />
              </div>

              {/* Price info */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Pris för kronan</span>
                  <span className="text-amber-600 font-bold text-2xl">{crownPrice} kr</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Pengarna går till att hålla sändningen uppe. Ingen vinst att vinna — bara ära.
                </p>
                {crownHolder && (
                  <p className="text-xs text-gray-500 mt-1.5">
                    Nuvarande regent: <span className="font-medium text-amber-700">{crownHolder}</span>
                  </p>
                )}
              </div>

              <button
                onClick={() => name.trim() && setStep('payment')}
                disabled={!name.trim()}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  name.trim()
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-300 hover:to-amber-400 hover:shadow-lg active:scale-[0.98]'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {crownPrice} kr — Krön {club.name}
              </button>
            </div>
          )}

          {/* Payment step */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-gray-600 text-sm mb-2">
                  <strong className="text-[#1a1a1a]">{name}</strong> krönt {club.name} med hälsningen:
                </p>
                <p className="text-amber-600 italic text-sm border-l-2 border-amber-300 pl-3">
                  {message || '—'}
                </p>
                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                  <span className="text-gray-400 text-sm">Belopp</span>
                  <span className="text-[#1a1a1a] font-bold text-lg">{crownPrice} kr</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-500 hover:to-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                {submitting ? (
                  'Dirigerar till Stripe...'
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                    Betala — {crownPrice} kr
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400">Säker betalning via Stripe 🔒</p>
              <button onClick={() => setStep('form')} className="w-full py-2 text-gray-400 text-sm hover:text-gray-700 transition-colors">
                ← Tillbaka
              </button>
            </div>
          )}

          {/* Success step */}
          {step === 'success' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-green-600 font-bold text-lg">Grattis! 🎉</p>
                <p className="text-gray-600 mt-2">
                  <strong className="text-[#1a1a1a]">{name}</strong> krönte {club.name}!
                </p>
                <p className="text-amber-600 font-bold text-2xl mt-3">{paidPrice} kr</p>
                <p className="text-gray-400 text-sm mt-1">Nytt pris: {paidPrice + 10} kr</p>
              </div>
              <button onClick={onClose} className="w-full py-3 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition-all font-medium">
                Stäng
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
