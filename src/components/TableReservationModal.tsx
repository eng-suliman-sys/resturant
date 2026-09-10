import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Calendar, Clock, Users, CheckCircle2, Sparkles, Utensils } from 'lucide-react';
import { RESTAURANT_LOCATIONS } from '../data/restaurantData';

interface TableReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableReservationModal: React.FC<TableReservationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState('2026-09-12');
  const [time, setTime] = useState('19:00');
  const [seating, setSeating] = useState<'hearth' | 'garden' | 'chef-counter'>('hearth');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isReserved, setIsReserved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#E05A47', '#4A6B5D', '#FAF9F6'],
    });
    setIsReserved(true);
  };

  const handleReset = () => {
    setIsReserved(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="relative bg-[#FAF9F6] rounded-3xl border border-[#E2DAD0] max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isReserved ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-[#4A6B5D] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#1C1917]">Table Confirmed!</h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xs mx-auto">
              We look forward to welcoming you, <strong>{name || 'Guest'}</strong>, for a sensory dining
              experience at our hearth.
            </p>
            <div className="p-4 bg-white rounded-2xl border border-stone-200 text-xs space-y-1 text-left max-w-xs mx-auto">
              <div className="flex justify-between">
                <span className="text-stone-500">Party Size:</span>
                <span className="font-bold text-stone-800">{guests} Guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Date & Time:</span>
                <span className="font-bold text-stone-800">
                  {date} at {time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Atmosphere:</span>
                <span className="font-bold capitalize text-[#E05A47]">{seating} Dining</span>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-full bg-[#1C1917] text-white font-bold text-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1 text-[#E05A47]">
              <Utensils className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Reserve Your Evening</span>
            </div>
            <h3 className="text-2xl font-extrabold text-[#1C1917] mb-2">
              Book a Dining Experience
            </h3>
            <p className="text-xs text-stone-600 mb-6">
              Experience open-flame cooking and seasonal botanicals in our warm ambient dining room.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Seating preference */}
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">Seating Ambience</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'hearth', label: 'Wood Hearth' },
                    { id: 'garden', label: 'Sage Garden' },
                    { id: 'chef-counter', label: 'Chef Counter' },
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setSeating(s.id as any)}
                      className={`py-2 px-2 rounded-xl font-bold border transition-all text-center cursor-pointer ${
                        seating === s.id
                          ? 'bg-[#1C1917] text-white border-[#1C1917]'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Party Size, Date, Time */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Time</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl font-medium"
                  >
                    {['17:30', '18:15', '19:00', '19:45', '20:30', '21:15'].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guest Name & Phone */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Elena Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="(213) 555-0100"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="liquid-btn w-full py-3.5 mt-2 rounded-full bg-[#E05A47] hover:bg-[#C44332] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#E05A47]/30 transition-all active:scale-95 cursor-pointer"
              >
                <span>Confirm Reservation</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
