'use client';

import { Crown, MapPin, Calendar, Trophy, Flame } from 'lucide-react';
import { useState, useEffect } from 'react';
import BidModal from './BidModal';
import { motion } from 'framer-motion';

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
  index?: number;
}

// Helper to extract primary/secondary colors
function getClubColors(colors: string) {
  const [c1, c2] = colors.split('/');
  const colorMap: Record<string, string> = {
    'Gult': '#FFD700',
    'Svart': '#000000',
    'Blå': '#1E40AF',
    'Vit': '#FFFFFF',
    'Rött': '#DC2626',
    'Grönt': '#16A34A',
  };
  return {
    primary: colorMap[c1?.trim()] || '#6B7280',
    secondary: colorMap[c2?.trim()] || '#9CA3AF',
  };
}

// Get a subtle gradient background for logo based on club colors
function getLogoBg(colors: string) {
  const { primary, secondary } = getClubColors(colors);
  return `radial-gradient(circle, ${primary}22 0%, ${secondary}11 100%)`;
}

export default function ClubCard({ club, crownPrice, crownHolder, index = 0 }: ClubCardProps) {
  const [showBidModal, setShowBidModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const colors = getClubColors(club.colors);
  const isCrowned = !!crownHolder;
  const priceGlow = crownPrice > 10 ? 'glow-gold-sm' : '';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: index * 0.05, duration: 0.4 }}
        className="relative group glass-card rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1"
        onClick={() => setShowBidModal(true)}
      >
        {/* Club colors top bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl" style={{
          background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
        }} />

        {/* Crown price badge */}
        <div className="absolute -top-3 right-4 z-20">
          <div className={`flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-bold px-3 py-1.5 rounded-full ${priceGlow} transition-shadow`}>
            {isCrowned && <Flame className="w-3 h-3" />}
            <Crown className="w-3 h-3" />
            <span>{crownPrice} kr</span>
          </div>
        </div>

        {/* Club logo with colored bg circle */}
        <div className="flex justify-center mb-4 pt-2">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
            style={{ background: getLogoBg(club.colors) }}
          >
            {club.logo ? (
              <img
                src={club.logo}
                alt={club.name}
                className="w-14 h-14 object-contain rounded-full"
              />
            ) : (
              <Trophy className="w-8 h-8 text-gray-600" />
            )}
          </div>
        </div>

        {/* Club name & city */}
        <div className="mb-4">
          <h3 className="text-xl font-black text-white tracking-tight">{club.name}</h3>
          <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5">
            <MapPin className="w-3 h-3" />
            {club.city}
          </div>
        </div>

        {/* Club details */}
        <div className="space-y-1.5 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 shrink-0" />
            <span>Grundad {club.founded}</span>
          </div>
          <div>
            <span className="text-gray-500">Färg: </span>
            <span className="text-gray-300">{club.colors}</span>
          </div>
          <div>
            <span className="text-gray-500">Arena: </span>
            <span className="text-gray-300">{club.stadium}</span>
          </div>
        </div>

        {/* Crown holder info */}
        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-gray-500">Regerar: </span>
              <span className={`font-semibold ${isCrowned ? 'text-yellow-400' : 'text-gray-400'}`}>
                {crownHolder ?? '—'}
              </span>
            </div>
            {isCrowned && <Crown className="w-4 h-4 text-yellow-500/50" />}
          </div>
        </div>

        {/* Hover CTA overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-yellow-500/25 transition-shadow transform hover:scale-105">
            Krön {club.name}
          </span>
        </div>
      </motion.div>

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
