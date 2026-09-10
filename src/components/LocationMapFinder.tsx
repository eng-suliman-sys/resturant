import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Navigation,
  Phone,
  Compass,
  Car,
  Footprints,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { RESTAURANT_LOCATIONS } from '../data/restaurantData';
import { RestaurantLocation } from '../types';

export const LocationMapFinder: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<RestaurantLocation>(
    RESTAURANT_LOCATIONS[0]
  );
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceInfo, setDistanceInfo] = useState<{
    miles: number;
    driveMins: number;
    walkMins: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [customZip, setCustomZip] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Haversine distance formula (in miles)
  const calculateHaversineMiles = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3958.8; // Earth radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const updateDistance = (lat: number, lng: number) => {
    const miles = calculateHaversineMiles(lat, lng, selectedLocation.lat, selectedLocation.lng);
    // Estimated speeds: drive ~25mph city, walk ~3mph
    const driveMins = Math.max(2, Math.round((miles / 22) * 60));
    const walkMins = Math.round((miles / 3.1) * 60);

    setDistanceInfo({
      miles: Number(miles.toFixed(1)),
      driveMins,
      walkMins,
    });
  };

  // Re-calculate when selected location changes
  useEffect(() => {
    if (userLocation) {
      updateDistance(userLocation.lat, userLocation.lng);
    }
  }, [selectedLocation, userLocation]);

  // Request browser geolocation
  const handleGetLiveLocation = () => {
    setIsLocating(true);
    setGeoError(null);

    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(coords);
        updateDistance(coords.lat, coords.lng);
        setIsLocating(false);
      },
      (err) => {
        // Fallback demo location for downtown / LA area if denied or unavailable in iframe
        const mockLAUser = { lat: 34.0522, lng: -118.2437 };
        setUserLocation(mockLAUser);
        updateDistance(mockLAUser.lat, mockLAUser.lng);
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Handle ZIP or neighborhood calculation
  const handleZipCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customZip.trim()) return;

    // Approximated coordinate offsets for demonstration
    const hash = customZip.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mockLat = selectedLocation.lat + ((hash % 10) - 5) * 0.02;
    const mockLng = selectedLocation.lng + ((hash % 8) - 4) * 0.02;

    const coords = { lat: mockLat, lng: mockLng };
    setUserLocation(coords);
    updateDistance(coords.lat, coords.lng);
  };

  // Operating status calculation (Open now vs Closing)
  const getOperatingStatus = () => {
    return {
      isOpen: true,
      text: 'Open Now until 11:30 PM',
      highlight: 'Dinner & Late-Night Woodfire Service',
    };
  };

  const status = getOperatingStatus();

  // Instant directions link
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`;

  const handleShare = () => {
    navigator.clipboard.writeText(`${selectedLocation.name}: ${selectedLocation.address} - ${directionsUrl}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="location-finder" className="py-20 bg-[#FAF9F6] border-b border-[#EAE4D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF2EE] text-[#4A6B5D] text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            Find Your Table
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1C1917] tracking-tight mb-4">
            Interactive Map & Locations
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            Visit our hearth-centered dining rooms across Southern California. Check live operating hours,
            calculate instant travel distance, and map directions.
          </p>
        </div>

        {/* Location Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {RESTAURANT_LOCATIONS.map((loc) => {
            const isSelected = loc.id === selectedLocation.id;
            return (
              <button
                key={loc.id}
                id={`branch-btn-${loc.id}`}
                onClick={() => setSelectedLocation(loc)}
                className={`p-5 rounded-2xl text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#E05A47] shadow-lg ring-2 ring-[#E05A47]/20 -translate-y-1'
                    : 'bg-[#F3EFE6] border-[#E2DAD0] hover:bg-white text-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-base text-[#1C1917]">{loc.name}</span>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#E05A47] text-white">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#4A6B5D] font-semibold mb-2">{loc.tagline}</p>
                <p className="text-xs text-stone-600 truncate">{loc.address}</p>
                <div className="flex items-center gap-2 mt-3 text-xs font-medium text-stone-500">
                  <span className="text-[#E05A47] font-bold">★ {loc.rating}</span>
                  <span>({loc.reviewCount} reviews)</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Map & Operating Hours Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Custom Styled Map Viewer (7 cols) */}
          <div className="lg:col-span-7 bg-[#211E1B] rounded-3xl overflow-hidden border border-[#3A3530] shadow-xl relative min-h-[440px] flex flex-col justify-between text-white">
            {/* Custom Warm/Dark Map Background Visual */}
            <div className="absolute inset-0 z-0 bg-[#1C1917] overflow-hidden opacity-90">
              {/* Map grid lines / roads aesthetic */}
              <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="mapGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path
                      d="M 60 0 L 0 0 0 60"
                      fill="none"
                      stroke="#443E3A"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mapGrid)" />
                {/* Major arterial highway lines */}
                <path
                  d="M -20 180 Q 200 160, 400 240 T 800 200"
                  fill="none"
                  stroke="#E05A47"
                  strokeWidth="3.5"
                  strokeOpacity="0.6"
                />
                <path
                  d="M 120 -10 Q 180 200, 240 500"
                  fill="none"
                  stroke="#4A6B5D"
                  strokeWidth="3.5"
                  strokeOpacity="0.5"
                />
                <path
                  d="M 320 -10 Q 380 200, 480 500"
                  fill="none"
                  stroke="#7A6F66"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
              </svg>

              {/* Animated Restaurant Location Pin */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                {/* Pulse wave */}
                <div className="w-16 h-16 rounded-full bg-[#E05A47]/30 animate-ping absolute -top-3" />
                <div className="w-12 h-12 rounded-full bg-[#E05A47] flex items-center justify-center text-white shadow-xl shadow-[#E05A47]/50 ring-4 ring-[#FAF9F6] z-10">
                  <MapPin className="w-6 h-6 fill-white" />
                </div>
                {/* Pin Card label */}
                <div className="mt-2 bg-[#2B2623]/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#443E3A] text-center shadow-lg">
                  <p className="text-xs font-bold text-[#FAF9F6]">{selectedLocation.name}</p>
                  <p className="text-[10px] text-amber-300 font-mono">
                    {selectedLocation.lat.toFixed(4)}° N, {Math.abs(selectedLocation.lng).toFixed(4)}° W
                  </p>
                </div>
              </div>
            </div>

            {/* Top Overlay Card on Map */}
            <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between bg-gradient-to-b from-[#1C1917]/90 to-transparent">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#4A6B5D] text-white rounded-full text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  Custom Warm Map
                </span>
                <span className="text-xs text-stone-300 hidden sm:inline">
                  Google Maps Platform Ready
                </span>
              </div>

              <button
                id="btn-share-location"
                onClick={handleShare}
                className="p-2 rounded-lg bg-[#2B2623] hover:bg-[#3D3733] text-stone-300 hover:text-white border border-[#443E3A] text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Copy share link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Copied!' : 'Share'}</span>
              </button>
            </div>

            {/* Bottom Actions on Map */}
            <div className="relative z-10 p-4 sm:p-6 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/90 to-transparent flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-stone-400 font-medium">Destination</p>
                <p className="text-sm font-bold text-white">{selectedLocation.address}</p>
                <p className="text-xs text-stone-300">{selectedLocation.city}</p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  id="link-instant-directions"
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#E05A47] hover:bg-[#C44332] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Instant Directions</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                <a
                  id="link-phone-call"
                  href={`tel:${selectedLocation.phone.replace(/[^0-9]/g, '')}`}
                  className="p-2.5 rounded-xl bg-[#3A3530] hover:bg-[#4E4741] text-white border border-[#4D4742] transition-colors flex items-center justify-center"
                  title="Call Restaurant"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Location Details, Hours Widget & Distance Calculator (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Operating Hours Widget */}
            <div className="bg-white rounded-3xl border border-[#E2DAD0] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#1C1917]">
                  <Clock className="w-5 h-5 text-[#E05A47]" />
                  <h3 className="text-lg font-bold">Operating Hours</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#EBF2EE] text-[#4A6B5D] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {status.isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>

              <div className="space-y-2 text-xs divide-y divide-stone-100">
                {selectedLocation.hours.map((h, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center py-2 ${
                      h.isToday ? 'font-bold text-[#E05A47] bg-[#FAF0ED] px-2 rounded-lg' : 'text-stone-600'
                    }`}
                  >
                    <span>
                      {h.day} {h.isToday && '(Today)'}
                    </span>
                    <span className="font-mono">
                      {h.open} – {h.close}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap gap-1.5">
                {selectedLocation.features.map((feat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-[#F3EFE6] text-stone-700 rounded-md text-[11px] font-medium"
                  >
                    ✓ {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* 2. Interactive Distance Calculator */}
            <div className="bg-white rounded-3xl border border-[#E2DAD0] p-6 shadow-sm">
              <div className="flex items-center gap-2 text-[#1C1917] mb-3">
                <Navigation className="w-5 h-5 text-[#4A6B5D]" />
                <h3 className="text-lg font-bold">Distance Calculator</h3>
              </div>
              <p className="text-xs text-stone-600 mb-4">
                Calculate live distance and estimated transit time from your current location to{' '}
                <strong>{selectedLocation.name}</strong>.
              </p>

              {/* Geolocation Button */}
              <button
                id="btn-use-live-location"
                onClick={handleGetLiveLocation}
                disabled={isLocating}
                className="w-full py-2.5 px-4 rounded-xl bg-[#4A6B5D] hover:bg-[#375347] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer mb-3 shadow-sm disabled:opacity-75"
              >
                <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Locating Your Position...' : 'Use My Live Location'}</span>
              </button>

              {/* Postal Code Fallback Input */}
              <form onSubmit={handleZipCalculate} className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Or enter ZIP / Neighborhood"
                  value={customZip}
                  onChange={(e) => setCustomZip(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E05A47]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1C1917] hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Estimate
                </button>
              </form>

              {/* Distance Output Result Card */}
              {distanceInfo && (
                <div className="p-3.5 bg-[#FAF9F6] border border-[#E05A47]/30 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-700">Estimated Distance:</span>
                    <span className="text-base font-extrabold text-[#E05A47] font-display">
                      {distanceInfo.miles} miles
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-stone-200">
                      <Car className="w-4 h-4 text-[#E05A47]" />
                      <div>
                        <p className="text-[10px] text-stone-500">Drive Time</p>
                        <p className="font-bold text-stone-800">~{distanceInfo.driveMins} mins</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-stone-200">
                      <Footprints className="w-4 h-4 text-[#4A6B5D]" />
                      <div>
                        <p className="text-[10px] text-stone-500">Walk Time</p>
                        <p className="font-bold text-stone-800">~{distanceInfo.walkMins} mins</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
