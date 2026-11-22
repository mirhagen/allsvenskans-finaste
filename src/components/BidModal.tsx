'use client';

import { Crown, X } from 'lucide-react';
import { useState } from 'react';

interface BidModalProps {
  club: { id: string; name: string; city: string; colors: string; };
  onClose: () => void;
}

export default function BidModal({ club, onClose }: BidModalProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const price = 10 + Math.floor(Math.random() * 40);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-4">
            <Crown className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-black text-white">
            Krön {club.name}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {club.city} • Färg: {club.colors}
          </p>
        </div>

        {step === 'form' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Ditt namn</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="T.ex. Anders L."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Hälsning (valfritt)</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Låt oss vinna Allsvenskan!"
                maxLength={80}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500"
              />
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Pris för kronan</span>
                <span className="text-yellow-400 font-bold text-xl">{price} kr</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Pengarna går till att hålla sändningen uppe. Ingen vinst att vinna — bara ära.
              </p>
            </div>

            <button
              onClick={() => name.trim() && setStep('payment')}
              disabled={!name.trim()}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                name.trim()
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-400 hover:to-yellow-500'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {price} kr — Krön {club.name}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-300 text-sm mb-3">
                <strong className="text-white">{name}</strong> kröner {club.name} med hälsningen:
              </p>
              <p className="text-yellow-400 italic text-sm">"{message || '—'}"</p>
              <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between">
                <span className="text-gray-400">Belopp</span>
                <span className="text-white font-bold">{price} kr</span>
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full py-4 bg-white text-black rounded-lg font-bold text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                Betala med Apple Pay
              </button>
              <button className="w-full py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all flex items-center justify-center gap-2 border border-gray-700">
                Betala med kort
              </button>
            </div>

            <button
              onClick={() => setStep('form')}
              className="w-full py-2 text-gray-500 text-sm hover:text-white transition-colors"
            >
              ← Tillbaka
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
