import React from 'react';

export const DishCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#F3EFE6] rounded-3xl p-6 border border-[#E2DAD0] animate-pulse space-y-4">
      <div className="w-full h-48 bg-stone-300/60 rounded-2xl" />
      <div className="space-y-2">
        <div className="w-1/3 h-4 bg-stone-300/70 rounded" />
        <div className="w-3/4 h-6 bg-stone-300/80 rounded" />
        <div className="w-full h-3 bg-stone-200 rounded" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="w-16 h-6 bg-stone-300/70 rounded" />
        <div className="w-24 h-8 bg-stone-300/70 rounded-full" />
      </div>
    </div>
  );
};

export const MapSkeleton: React.FC = () => {
  return (
    <div className="w-full h-96 bg-[#2B2623] rounded-3xl border border-[#3E3833] animate-pulse flex items-center justify-center text-stone-500 text-xs">
      Loading interactive map coordinates...
    </div>
  );
};
