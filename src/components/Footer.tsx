import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Send,
  Gift,
  CheckCircle2,
  Instagram,
  Youtube,
  Utensils,
  Copy,
  Check,
  Heart,
  ArrowRight,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [copiedVoucher, setCopiedVoucher] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    // Trigger celebratory confetti burst
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.85 },
      colors: ['#E05A47', '#4A6B5D', '#FAF9F6', '#F5C366'],
    });

    setVoucherCode('SAGEVIP' + Math.floor(1000 + Math.random() * 9000));
    setIsSubmitted(true);
  };

  const handleCopyVoucher = () => {
    if (!voucherCode) return;
    navigator.clipboard.writeText(voucherCode);
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2000);
  };

  return (
    <footer id="loyalty-footer" className="bg-[#1C1917] text-[#FAF9F6] pt-16 pb-12 border-t border-[#332E29]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Loyalty Rewards Signup Banner */}
        <div className="bg-gradient-to-br from-[#2B2623] to-[#211E1B] border border-[#3E3833] rounded-3xl p-8 sm:p-12 mb-16 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#E05A47]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#4A6B5D]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E05A47]/20 border border-[#E05A47]/40 text-[#FAF9F6] text-xs font-bold uppercase tracking-wider mb-4">
              <Gift className="w-3.5 h-3.5 text-[#E05A47]" />
              Exclusive Terracotta Club
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              Join the Sage Loyalty Society
            </h3>
            <p className="text-stone-300 text-sm sm:text-base mb-8 max-w-xl mx-auto">
              Subscribe for chef’s seasonal allocations, secret off-menu invites, and get an instant{' '}
              <strong className="text-[#E05A47] font-semibold">$15 Welcome Dining Credit</strong>.
            </p>

            {/* Newsletter Input Form or Interactive Success State */}
            {!isSubmitted ? (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
              >
                <div className="relative w-full">
                  <input
                    type="email"
                    id="newsletter-email-input"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-full bg-[#1C1917] border border-stone-700 text-white placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05A47] transition-all"
                  />
                </div>
                <button
                  type="submit"
                  id="btn-newsletter-submit"
                  className="liquid-btn w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#E05A47] hover:bg-[#C44332] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#E05A47]/30 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <span>Claim $15 Credit</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="p-5 rounded-2xl bg-[#211E1B] border border-[#4A6B5D] max-w-md mx-auto animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-base mb-1">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Welcome to the Inner Circle!</span>
                </div>
                <p className="text-xs text-stone-300 mb-3">
                  Your $15 dining credit is ready. Use this promo code at checkout:
                </p>
                <div className="flex items-center justify-between bg-[#1C1917] px-4 py-2.5 rounded-xl border border-stone-700">
                  <span className="font-mono text-sm font-bold text-amber-300 tracking-wider">
                    {voucherCode}
                  </span>
                  <button
                    onClick={handleCopyVoucher}
                    className="flex items-center gap-1 text-xs font-semibold text-stone-300 hover:text-white px-2.5 py-1 rounded bg-[#332E29] transition-colors cursor-pointer"
                  >
                    {copiedVoucher ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <p className="text-[11px] text-stone-400 mt-4">
              We respect your privacy. Zero spam, unsubscribe anytime with one click.
            </p>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800 text-sm">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E05A47] flex items-center justify-center text-white">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Terracotta & Sage
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Vibrant modern gastronomy centered around open-fire cooking, ancient terracotta hearth traditions,
              and foraged herbs from our regional partner growers.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#showcase-3d" className="hover:text-[#E05A47] transition-colors">
                  Interactive 3D Dishes
                </a>
              </li>
              <li>
                <a href="#special-offers-banner" className="hover:text-[#E05A47] transition-colors">
                  Daily Happy Hour Deals
                </a>
              </li>
              <li>
                <a href="#location-finder" className="hover:text-[#E05A47] transition-colors">
                  Locations & Hours
                </a>
              </li>
              <li>
                <a href="#loyalty-footer" className="hover:text-[#E05A47] transition-colors">
                  Loyalty Rewards ($15 Credit)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Hearth Locations */}
          <div>
            <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase mb-3">
              Locations
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <strong className="text-stone-300">Downtown Flagship:</strong> 428 S Spring St
              </li>
              <li>
                <strong className="text-stone-300">Sage Heights:</strong> 1642 Hillhurst Ave
              </li>
              <li>
                <strong className="text-stone-300">Marina Wharf:</strong> 13955 Marquesas Way
              </li>
              <li className="pt-1 text-[#4A6B5D] font-semibold">
                Reservations: (213) 555-0194
              </li>
            </ul>
          </div>

          {/* Col 4: Social Media Links */}
          <div>
            <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase mb-3">
              Connect With Us
            </h4>
            <p className="text-xs text-stone-400 mb-4">
              Tag @TerracottaSage to get featured on our live dining stream.
            </p>
            <div className="flex items-center gap-3">
              <a
                id="social-link-instagram"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#2B2623] hover:bg-[#E05A47] text-stone-300 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                id="social-link-tiktok"
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#2B2623] hover:bg-[#4A6B5D] text-stone-300 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm font-bold text-xs"
                title="TikTok"
              >
                TT
              </a>
              <a
                id="social-link-youtube"
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#2B2623] hover:bg-[#E05A47] text-stone-300 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                id="social-link-yelp"
                href="https://yelp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#2B2623] hover:bg-amber-600 text-stone-300 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm font-bold text-xs"
                title="Yelp 4.9★"
              >
                ★
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Terracotta & Sage Kitchen. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Farm-to-Table Verified</span>
            <span>Zero Single-Use Plastics</span>
            <span>Made with Fire & Herbs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
