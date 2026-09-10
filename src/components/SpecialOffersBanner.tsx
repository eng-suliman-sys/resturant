import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Copy, Check, ChevronRight, Flame } from 'lucide-react';
import { SPECIAL_OFFERS } from '../data/restaurantData';

export const SpecialOffersBanner: React.FC = () => {
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 2,
    minutes: 45,
    seconds: 18,
  });

  const activeOffer = SPECIAL_OFFERS[currentOfferIndex];

  // Real-time countdown timer calculation
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const target = new Date();
      // Target today at the designated hour, e.g. 7 PM or +3 hours from now if already past
      target.setHours(activeOffer.validUntilHour, 0, 0, 0);

      let diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        // Next day or default +4 hours for continuous engagement
        diff = 4 * 60 * 60 * 1000 + (60000 - (now.getMinutes() * 60000 + now.getSeconds() * 1000));
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [activeOffer.validUntilHour]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const nextOffer = () => {
    setCurrentOfferIndex((prev) => (prev + 1) % SPECIAL_OFFERS.length);
  };

  return (
    <div
      id="special-offers-banner"
      className="bg-[#1C1917] text-[#FAF9F6] border-b border-[#3A3530] text-xs sm:text-sm font-medium sticky top-0 z-50 shadow-md backdrop-blur-md bg-opacity-95 transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Live Badge + Offer */}
        <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E05A47] text-white font-bold text-[11px] tracking-wide uppercase animate-pulse">
            <Flame className="w-3.5 h-3.5" />
            Live Deal
          </span>

          <span className="bg-[#4A6B5D] text-white px-2 py-0.5 rounded text-[11px] font-semibold">
            {activeOffer.discountBadge}
          </span>

          <p className="truncate text-stone-200">
            <strong className="text-white font-semibold">{activeOffer.title}:</strong>{' '}
            <span className="text-stone-300 hidden md:inline">{activeOffer.subtitle}</span>
          </p>
        </div>

        {/* Center/Right: Real-time Countdown Timer + Promo Code Button */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Countdown Clock */}
          <div
            id="offer-countdown-timer"
            className="flex items-center gap-1.5 bg-[#2B2623] px-2.5 py-1 rounded-md border border-[#443E3A] text-stone-200"
            title="Time remaining for this offer"
          >
            <Clock className="w-3.5 h-3.5 text-[#E05A47]" />
            <span className="font-mono text-xs font-bold tracking-wider text-amber-200">
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>

          {/* Promo code copy badge */}
          <button
            id="btn-copy-promo"
            onClick={() => handleCopyCode(activeOffer.promoCode)}
            className="group flex items-center gap-1.5 bg-[#FAF9F6] text-[#1C1917] hover:bg-[#E05A47] hover:text-white px-3 py-1 rounded font-semibold text-xs transition-all shadow-sm active:scale-95"
          >
            <span className="font-mono font-bold tracking-wider">{activeOffer.promoCode}</span>
            {copiedCode === activeOffer.promoCode ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" />
            ) : (
              <Copy className="w-3 h-3 text-stone-500 group-hover:text-white transition-colors" />
            )}
            <span className="text-[10px] hidden sm:inline opacity-80">
              {copiedCode === activeOffer.promoCode ? 'Copied!' : 'Copy'}
            </span>
          </button>

          {/* Switch Offer */}
          <button
            id="btn-cycle-offers"
            onClick={nextOffer}
            className="p-1 rounded text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            title="Next daily offer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
