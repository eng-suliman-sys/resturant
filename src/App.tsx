/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SpecialOffersBanner } from './components/SpecialOffersBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DishShowcase3D } from './components/DishShowcase3D';
import { LocationMapFinder } from './components/LocationMapFinder';
import { Footer } from './components/Footer';
import { OrderDrawer } from './components/OrderDrawer';
import { TableReservationModal } from './components/TableReservationModal';
import { CartItem, Dish } from './types';
import { DISHES } from './data/restaurantData';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([
    { dish: DISHES[0], quantity: 1 }, // Default initial preview item
  ]);
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  const handleAddToCart = (dish: Dish) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { dish, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (dishId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.dish.id === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (dishId: string) => {
    setCart((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C1917] flex flex-col selection:bg-[#E05A47] selection:text-white">
      {/* 1. Live Special Offers Banner with Real-Time Countdown */}
      <SpecialOffersBanner />

      {/* 2. Sticky Navigation Bar */}
      <Navbar
        cart={cart}
        onOpenCart={() => setIsOrderDrawerOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
      />

      {/* 3. Hero Section with 3D Animated Floating Ingredients & Liquid Hover CTA */}
      <HeroSection
        onOrderNowClick={() => setIsOrderDrawerOpen(true)}
        onExploreDishesClick={() => scrollToSection('showcase-3d')}
      />

      {/* 4. Interactive 3D Dish Showcase Carousel */}
      <DishShowcase3D onAddToCart={handleAddToCart} />

      {/* 5. Interactive Map & Location Finder with Distance Calculator */}
      <LocationMapFinder />

      {/* 6. Footer with Loyalty Rewards Signup & Confetti Animation */}
      <Footer />

      {/* 7. Slide-over Online Ordering Drawer */}
      <OrderDrawer
        isOpen={isOrderDrawerOpen}
        onClose={() => setIsOrderDrawerOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* 8. Table Reservation Modal */}
      <TableReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />
    </div>
  );
}

