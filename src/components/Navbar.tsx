import React, { useState } from 'react';
import { Utensils, ShoppingBag, MapPin, Sparkles, Menu, X } from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenReservation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cart,
  onOpenCart,
  onOpenReservation,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      id="main-navbar"
      className="sticky top-[37px] z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#EAE4D9] transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#E05A47] to-[#F77462] flex items-center justify-center text-white shadow-md shadow-[#E05A47]/20 group-hover:scale-105 transition-transform">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-[#1C1917] block leading-none">
                Terracotta & Sage
              </span>
              <span className="text-[11px] font-semibold tracking-widest uppercase text-[#4A6B5D] block mt-1">
                Woodfire & Botanical Kitchen
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-stone-700">
            <button
              onClick={() => scrollToSection('showcase-3d')}
              className="hover:text-[#E05A47] transition-colors cursor-pointer"
            >
              3D Dish Showcase
            </button>
            <button
              onClick={() => scrollToSection('special-offers-banner')}
              className="hover:text-[#E05A47] transition-colors cursor-pointer flex items-center gap-1 text-[#E05A47]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Daily Happy Hour
            </button>
            <button
              onClick={() => scrollToSection('location-finder')}
              className="hover:text-[#E05A47] transition-colors cursor-pointer flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5 text-[#4A6B5D]" />
              Locations & Hours
            </button>
            <button
              onClick={() => scrollToSection('loyalty-footer')}
              className="hover:text-[#E05A47] transition-colors cursor-pointer"
            >
              Loyalty Rewards
            </button>
          </div>

          {/* Right Actions: Cart + Reservation button */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              id="btn-nav-cart"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-white hover:bg-[#F3EFE6] border border-[#E0D7CC] text-stone-800 transition-all active:scale-95 shadow-sm cursor-pointer"
              title="View Cart & Order"
            >
              <ShoppingBag className="w-5 h-5 text-[#1C1917]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#E05A47] text-white text-[11px] font-extrabold flex items-center justify-center animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Table Reservation Action */}
            <button
              id="btn-nav-reserve"
              onClick={onOpenReservation}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4A6B5D] hover:bg-[#375347] text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <span>Reserve Table</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200 space-y-3 bg-[#FAF9F6] pb-6">
            <button
              onClick={() => scrollToSection('showcase-3d')}
              className="block w-full text-left px-4 py-2 font-semibold text-stone-700 hover:text-[#E05A47]"
            >
              3D Dish Showcase
            </button>
            <button
              onClick={() => scrollToSection('special-offers-banner')}
              className="block w-full text-left px-4 py-2 font-semibold text-[#E05A47]"
            >
              Daily Happy Hour (50% Off)
            </button>
            <button
              onClick={() => scrollToSection('location-finder')}
              className="block w-full text-left px-4 py-2 font-semibold text-stone-700"
            >
              Locations & Live Operating Hours
            </button>
            <button
              onClick={() => scrollToSection('loyalty-footer')}
              className="block w-full text-left px-4 py-2 font-semibold text-stone-700"
            >
              Join VIP Loyalty Rewards
            </button>
            <div className="px-4 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReservation();
                }}
                className="w-full py-2.5 rounded-full bg-[#4A6B5D] text-white font-bold text-sm"
              >
                Reserve a Table
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
