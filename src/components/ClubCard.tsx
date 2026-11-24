'use client';

import { Crown, MapPin, Calendar, Trophy } from 'lucide-react';
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

// Riktiga Allsvenskan-färger (brand-accurate)
const CLUB_COLORS: Record<string, { primary: string; secondary: string }> = {
  'AIK': { primary: '#FFD700', secondary: '#000000' },
  'BK Häcken': { primary: '#E30613', secondary: '#FFFFFF' },
  'Degerfors IF': { primary: '#1E40AF', secondary: '#FFFFFF' },
  'Djurgårdens IF': { primary: '#004C97', secondary: '#00205B' },
  'GAIS': { primary: '#FFC72C', secondary: '#000000' },
  'Halmstads BK': { primary: '#FFFFFF', secondary: '#000000' },
  'Hammarby IF': { primary: '#003DA5', secondary: '#FFC72C' },
  'IF Brommapojkarna': { primary: '#1E40AF', secondary: '#FFFFFF' },
  'IF Elfsborg': { primary: '#FFFFFF', secondary: '#000000' },
  'IFK Göteborg': { primary: '#004CA0', secondary: '#FFFFFF' },
  'IK Sirius': { primary: '#1E40AF', secondary: '#FFC72C' },
  'Kalmar FF': { primary: '#C8102E', secondary: '#000000' },
  'Malmö FF': { primary: '#003366', secondary: '#FFFFFF' },
  'Mjällby AIF': { primary: '#FFFFFF', secondary: '#000000' },
  'Västerås SK': { primary: '#1E40AF', secondary: '#FFFFFF' },
  'Örgryte IS': { primary: '#FFFFFF', secondary: '#000000' },
};

// Färgnamn → hex för färgfläckar
const COLOR_NAME_TO_HEX: Record<string, string> = {
  'Gult': '#FFD700',
  'Gul': '#FFC72C',
  'Svart': '#18181b',
  'Blå': '#1E40AF',
  'Vit': '#FFFFFF',
  'Rött': '#E30613',
  'Grönt': '#16a34a',
};

export default function ClubCard({ club, crownPrice, crownHolder, index = 0 }: ClubCardProps) {
  const [showBidModal, setShowBidModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const colors = CLUB_COLORS[club.name] || { primary: '#6b7280', secondary: '#9ca3af' };
  const isCrowned = !!crownHolder;

  return (
    <>
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: index * 0.04, duration: 0.4 }}
          className="relative group warm-card rounded-2xl cursor-pointer"
          onClick={() => setShowBidModal(true)}
        >
          {/* Crown price badge */}
          <div className="absolute -top-3 right-4 z-20">
            <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${
              isCrowned
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                : 'bg-white border border-gray-200 text-gray-600'
            }`}>
              {isCrowned && <span className="text-sm">👑</span>}
              {crownPrice} kr
            </div>
          </div>

          {/* Club colors top bar — club-specifik färg */}
          <div className="h-1.5 rounded-t-2xl overflow-hidden" style={{
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
          }} />

          <div className="p-5">
            {/* Club logo */}
            <div className="flex justify-center mb-4">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.primary}18, ${colors.secondary}10)`,
                }}
              >
                {club.logo ? (
                  <img
                    src={club.logo}
                    alt={club.name}
                    className="w-14 h-14 object-contain"
                  />
                ) : (
                  <Trophy className="w-8 h-8 text-gray-300" />
                )}
              </div>
            </div>

            {/* Club name & city */}
            <div className="mb-3">
              <h3 className="text-lg font-bold text-[#1a1a1a] leading-tight">{club.name}</h3>
              <div className="flex items-center gap-1 text-gray-400 text-sm mt-0.5">
                <MapPin className="w-3 h-3" />
                {club.city}
              </div>
            </div>

            {/* Club details */}
            <div className="space-y-1 text-sm text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 shrink-0" />
                <span>Grundad {club.founded}</span>
              </div>
              <div>
                <span className="text-gray-500">Färg: </span>
                <div className="inline-flex items-center gap-1.5 ml-2">
                  {club.colors.split('/').map((c, i) => {
                    const hex = COLOR_NAME_TO_HEX[c.trim()] || '#9CA3AF';
                    return (
                      <div key={i} className="flex items-center gap-1">
                        <div
                          className={`w-4 h-4 rounded-full shadow-sm ${hex === '#FFFFFF' ? 'border-2 border-gray-400' : 'border border-gray-200'}`}
                          style={{ backgroundColor: hex }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <span>Arena: </span>
                <span className="text-gray-600">{club.stadium}</span>
              </div>
            </div>

            {/* Crown holder info */}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-400">Regerar: </span>
                  <span className={`font-semibold ${isCrowned ? 'text-amber-600' : 'text-gray-300'}`}>
                    {crownHolder ?? '—'}
                  </span>
                </div>
                {isCrowned && <Crown className="w-4 h-4 text-amber-400" />}
              </div>
            </div>
          </div>

          {/* Hover CTA overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg hover:scale-105 transition-transform">
              Krön {club.name} →
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
      </div>
    </>
  );
}
