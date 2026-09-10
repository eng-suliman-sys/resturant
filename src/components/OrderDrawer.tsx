import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Bike,
  Store,
} from 'lucide-react';
import { CartItem, Dish } from '../types';
import { RESTAURANT_LOCATIONS } from '../data/restaurantData';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onRemoveItem: (dishId: string) => void;
  onClearCart: () => void;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [selectedBranch, setSelectedBranch] = useState(RESTAURANT_LOCATIONS[0].id);
  const [promoInput, setPromoInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const tax = (subtotal - discountAmount) * 0.095;
  const deliveryFee = orderType === 'delivery' ? 4.99 : 0;
  const total = Math.max(0, subtotal - discountAmount + tax + deliveryFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (code === 'HAPPYHOUR50') {
      setDiscountPercent(50);
      setAppliedPromo('50% Off Happy Hour Special Applied!');
    } else if (code.startsWith('SAGEVIP') || code === 'SAGELOYAL15') {
      setDiscountPercent(25);
      setAppliedPromo('VIP Member $15 / 25% Off Applied!');
    } else if (code === 'CHEFGIFT') {
      setDiscountPercent(15);
      setAppliedPromo('Chef’s Gift 15% Off Applied!');
    } else {
      setAppliedPromo('Invalid or expired promo code.');
    }
  };

  const handleCheckout = () => {
    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#E05A47', '#4A6B5D', '#FAF9F6', '#FFD700'],
    });

    setOrderId('TS-' + Math.floor(100000 + Math.random() * 900000));
    setIsOrdered(true);
  };

  const handleReset = () => {
    setIsOrdered(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F6] shadow-2xl flex flex-col justify-between border-l border-[#E2DAD0]">
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#EAE4D9] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#FAF0ED] text-[#E05A47]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-[#1C1917]">Your Hearth Order</h3>
                <p className="text-xs text-stone-500">Fast pickup & eco-friendly delivery</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {isOrdered ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-extrabold text-[#1C1917]">Order Confirmed!</h4>
                <p className="text-xs text-stone-600 max-w-xs mx-auto">
                  Our woodfire chefs have received your ticket and are firing your dishes over 900°F oak embers.
                </p>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 text-left space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Order ID:</span>
                    <span className="font-mono font-bold text-[#1C1917]">{orderId}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Estimated Ready:</span>
                    <span className="font-bold text-[#4A6B5D]">20 – 25 minutes</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Method:</span>
                    <span className="font-semibold capitalize text-stone-800">{orderType}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-2 border-t border-stone-100 font-bold">
                    <span>Total Paid:</span>
                    <span className="text-[#E05A47]">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full py-3 rounded-full bg-[#1C1917] text-white font-bold text-sm cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                {/* Order Type Switch (Pickup vs Delivery) */}
                <div className="grid grid-cols-2 gap-2 bg-[#EFE9DF] p-1 rounded-2xl">
                  <button
                    onClick={() => setOrderType('pickup')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      orderType === 'pickup'
                        ? 'bg-white text-[#1C1917] shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5 text-[#E05A47]" />
                    <span>Store Pickup (Free)</span>
                  </button>
                  <button
                    onClick={() => setOrderType('delivery')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      orderType === 'delivery'
                        ? 'bg-white text-[#1C1917] shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Bike className="w-3.5 h-3.5 text-[#4A6B5D]" />
                    <span>Courier Delivery</span>
                  </button>
                </div>

                {/* Branch Selection */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Pickup/Preparing Branch
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full text-xs font-medium bg-white border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#E05A47] focus:outline-none"
                  >
                    {RESTAURANT_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} — {loc.address}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cart Items List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Items in Order ({cart.length})
                  </h4>

                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-stone-400">
                      <p className="text-xs">Your order basket is empty.</p>
                      <p className="text-[11px] text-stone-500 mt-1">
                        Select a plate from the 3D showcase to add!
                      </p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.dish.id}
                        className="flex items-center justify-between p-3 bg-white rounded-2xl border border-stone-200/80 shadow-xs"
                      >
                        <div className="flex-1 pr-2">
                          <p className="font-bold text-xs text-[#1C1917]">{item.dish.name}</p>
                          <p className="text-[11px] text-[#E05A47] font-semibold">
                            ${item.dish.price} each
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-[#F3EFE6] px-2 py-1 rounded-xl">
                          <button
                            onClick={() => onUpdateQuantity(item.dish.id, -1)}
                            className="p-1 rounded text-stone-600 hover:text-stone-900 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs font-bold text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.dish.id, 1)}
                            className="p-1 rounded text-stone-600 hover:text-stone-900 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Delete Item */}
                        <button
                          onClick={() => onRemoveItem(item.dish.id)}
                          className="ml-2 text-stone-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Promo Code Input Form */}
                <form onSubmit={handleApplyPromo} className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. HAPPYHOUR50)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 text-xs px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E05A47]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-[#1C1917] hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <p
                      className={`text-[11px] mt-1.5 font-medium ${
                        discountPercent > 0 ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {appliedPromo}
                    </p>
                  )}
                </form>

                {/* Kitchen Special Notes */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Special Dietary / Prep Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="E.g., extra crispy skin, dressing on side, olive wood smoke preference..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]"
                  />
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer / Checkout Button */}
          {!isOrdered && (
            <div className="p-5 border-t border-[#EAE4D9] bg-white space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({discountPercent}%)</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {orderType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Eco Delivery Fee</span>
                    <span className="font-mono">${deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-mono">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#1C1917] pt-2 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span className="font-mono text-[#E05A47]">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                id="btn-complete-checkout"
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="liquid-btn w-full py-3.5 rounded-full bg-[#E05A47] hover:bg-[#C44332] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#E05A47]/30 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <span>Place Order (${total.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
