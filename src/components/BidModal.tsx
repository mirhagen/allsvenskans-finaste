'use client';

import { Crown, X, Check } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface BidModalProps {
  club: { id: string; name: string; city: string; colors: string };
  crownPrice: number;
  crownHolder?: string;
  onClose: () => void;
}

const DQ = String.fromCharCode(34);

export default function BidModal({ club, crownPrice, crownHolder, onClose }: BidModalProps) {
  const router = useRouter();
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="glass-card rounded-2xl max-w-md w-full p-8 relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative background glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl" />

          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6 relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-4 shadow-lg glow-gold-sm">
              <Crown className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-black text-white">
              Krön {club.name}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {club.city} • {club.colors}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4"
            >
              <p className="text-red-400 text-sm text-center">{error}</p>
            </motion.div>
          )}

          {/* Form step */}
          {step === 'form' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm text-gray-400 mb-1.5 font-medium">Ditt namn</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="T.ex. Anders L."
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5 font-medium">Hälsning (valfritt)</label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Låt oss vinna Allsvenskan!"
                  maxLength={80}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all"
                />
              </div>

              {/* Price info */}
              <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 rounded-xl p-4 border border-yellow-500/10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Pris för kronan</span>
                  <span className="text-yellow-400 font-bold text-2xl">{crownPrice} kr</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Pengarna går till att hålla sändningen uppe. Ingen vinst att vinna — bara ära.
                </p>
                {crownHolder && (
                  <p className="text-xs text-gray-400 mt-1.5">
                    Nuvarande regent: <span className="text-yellow-400/80 font-medium">{crownHolder}</span>
                  </p>
                )}
              </div>

              <button
                onClick={() => name.trim() && setStep('payment')}
                disabled={!name.trim()}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  name.trim()
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-300 hover:to-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 active:scale-[0.98]'
                    : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                }`}
              >
                {crownPrice} kr — Krön {club.name}
              </button>
            </motion.div>
          )}

          {/* Payment step */}
          {step === 'payment' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-gray-300 text-sm mb-2">
                  <strong className="text-white">{name}</strong> kröner {club.name} med hälsningen:
                </p>
                <p className="text-yellow-400/80 italic text-sm border-l-2 border-yellow-500/30 pl-3">
                  {DQ}{message || '—'}{DQ}
                </p>
                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between">
                  <span className="text-gray-400 text-sm">Belopp</span>
                  <span className="text-white font-bold text-lg">{crownPrice} kr</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-500 hover:to-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-blue-500/20"
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

              <p className="text-center text-xs text-gray-500">Säker betalning via Stripe 🔒</p>
              <button onClick={() => setStep('form')} className="w-full py-2 text-gray-500 text-sm hover:text-white transition-colors">
                ← Tillbaka
              </button>
            </motion.div>
          )}

          {/* Success step */}
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mb-3">
                  <Check className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-green-400 font-bold text-lg">Grattis! 🎉</p>
                <p className="text-gray-300 mt-2">
                  <strong className="text-white">{name}</strong> krönte {club.name}!
                </p>
                <p className="text-yellow-400 font-bold text-2xl mt-3">{paidPrice} kr</p>
                <p className="text-gray-500 text-sm mt-1">Nytt pris: {paidPrice + 10} kr</p>
              </div>
              <button onClick={onClose} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all font-medium">
                Stäng
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
