'use client';

import { Crown, MapPin, Calendar, Trophy } from 'lucide-react';
import { useState } from 'react';
import BidModal from './BidModal';

interface Club {
  id: string;
  name: string;
  city: string;
  founded: number;
  colors: string;
  stadium: string;
  logo: string;
}

interface ClubCardProps {
  club: Club;
  crownPrice: number;
  crownHolder?: string;
}

export default function ClubCard({ club, crownPrice, crownHolder }: ClubCardProps) {
  const [showBidModal, setShowBidModal] = useState(false);

  return (
    <>
      <div
        className="relative group bg-gray-900/80 border border-gray-800 rounded-xl p-6 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/5"
        onClick={() => setShowBidModal(true)}
      >
        {/* Crown indicator */}
        <div className="absolute -top-3 right-4 z-20 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <Crown className="w-3 h-3" />
          {crownPrice} kr
        </div>

        {/* Club colors stripe */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
          style={{
            background: `linear-gradient(90deg, ${club.colors.includes('Gul') ? '#FFD700' : club.colors.includes('Blå') ? '#1E3A8A' : club.colors.includes('Rött') ? '#DC2626' : club.colors.includes('Grönt') ? '#16A34A' : '#FFFFFF'}, ${club.colors.includes('Svart') ? '#000000' : club.colors.includes('Vit') ? '#FFFFFF' : '#6B7280'})`,
          }}
        />

        {/* Club logo */}
        {club.logo && (
          <div className="flex justify-center mb-3">
            <img
              src={club.logo}
              alt={club.name}
              className="w-16 h-16 rounded-full object-contain shadow-lg"
            />
          </div>
        )}

        <div className="flex items-start justify-between mb-4 pt-2">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">{club.name}</h3>
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <MapPin className="w-3 h-3" />
              {club.city}
            </div>
          </div>
          <div className="text-right">
            <Trophy className="w-8 h-8 text-yellow-500/30" />
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>Grundad {club.founded}</span>
          </div>
          <div>
            <span className="text-gray-400">Färg: </span>
            <span>{club.colors}</span>
          </div>
          <div>
            <span className="text-gray-400">Arena: </span>
            <span>{club.stadium}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-gray-500">Troninnehavare: </span>
              <span className="text-white font-semibold">{crownHolder ?? '—'}</span>
            </div>
          </div>
        </div>

        {/* Hover CTA */}
        <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-yellow-500 text-black font-bold text-lg px-6 py-3 rounded-lg">
            Krön {club.name}
          </span>
        </div>
      </div>

      {showBidModal && (
        <BidModal
          club={club}
          crownPrice={crownPrice}
          crownHolder={crownHolder}
          onClose={() => setShowBidModal(false)}
        />
      )}
    </>
  );
}
