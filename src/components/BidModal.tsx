'use client';

import { Crown, X, Check, Loader2, CreditCard } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';

interface BidModalProps {
  club: { id: string; name: string; city: string; colors: string };
  crownPrice: number;
  crownHolder?: string;
  onClose: () => void;
}

export default function BidModal({ club, crownPrice, crownHolder, onClose }: BidModalProps) {
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elementsLoaded, setElementsLoaded] = useState(false);

  useEffect(() => {
    const initStripe = async () => {
      const stripeInstance = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
      );
      setStripe(stripeInstance);
    };
    initStripe();
  }, []);

  const handleCreatePayment = async () => {
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
      setClientSecret(data.clientSecret);
      setPaidPrice(data.amount);
      setStep('payment');
    } catch {
      setError('Kunde inte skapa betalning. Försök igen.');
    } finally {
      setSubmitting(false);
    }
  };

  const [paidPrice, setPaidPrice] = useState(crownPrice);

  useEffect(() => {
    if (clientSecret && stripe && !elementsLoaded) {
      const elems = stripe.elements({ clientSecret });
      const card = elems.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#1a1a1a',
            '::placeholder': { color: '#9ca3af' },
          },
          invalid: { color: '#dc2626' },
        },
      });
      const mountPoint = document.getElementById('card-element');
      if (mountPoint) {
        card.mount(mountPoint);
        setElementsLoaded(true);
      }
    }
  }, [clientSecret, stripe]);

  const handlePay = async () => {
    if (!stripe || !clientSecret) return;
    setProcessing(true);
    setError(null);

    const result = await stripe.confirmCardPayment(clientSecret);

    if (result.error) {
      setError(result.error.message || 'Betalningen misslyckades');
      setProcessing(false);
    } else if (result.paymentIntent?.status === 'succeeded') {
      setStep('success');
    } else {
      setError('Okänt betalningsläge. Vi kontrollerar att det kommit fram.');
      setProcessing(false);
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
                  <span className="text-[#1a1a1a] font-bold text-lg">{paidPrice} kr</span>
                </div>
              </div>

              {/* Stripe Card Element */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500 font-medium">Kortuppgifter</span>
                </div>
                <div id="card-element" className="py-2" />
                <p className="text-xs text-gray-400 mt-2">
                  Kortnumret, utgångsdatum och CVV. Säkerkrypterad via Stripe.
                </p>
              </div>

              <button
                onClick={handlePay}
                disabled={processing || !stripe}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-500 hover:to-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Betalar...
                  </>
                ) : (
                  <>
                    Betala — {paidPrice} kr
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400">Säker betalning via Stripe 🔒</p>
              <button onClick={onClose} className="w-full py-2 text-gray-400 text-sm hover:text-gray-700 transition-colors">
                Avbryt
              </button>
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
                onClick={handleCreatePayment}
                disabled={!name.trim() || submitting}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  name.trim() && !submitting
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-300 hover:to-amber-400 hover:shadow-lg active:scale-[0.98]'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                    Skapar betalning...
                  </>
                ) : (
                  `${crownPrice} kr — Krön ${club.name}`
                )}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
