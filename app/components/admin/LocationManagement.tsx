'use client';

import { ChangeEvent, KeyboardEvent } from 'react';
import dynamic from 'next/dynamic';
import { LocationData } from './types';
import { MapPin, Search, Loader2 } from 'lucide-react';

const TomTomMap = dynamic(() => import('@/app/components/mainwebsite/TomTomMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin h-8 w-8 text-white mx-auto" />
        <p className="mt-2 text-gray-300 text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

interface LocationManagementProps {
  location: LocationData;
  searchQuery: string;
  loading: boolean;
  onSearchQueryChange: (value: string) => void;
  onSearch: () => void;
  onLocationChange: (field: keyof Omit<LocationData, 'coordinates'>, value: string) => void;
  onMapClick: (lat: number, lng: number) => void;
  apiKey: string;
}

export default function LocationManagement({
  location,
  searchQuery,
  loading,
  onSearchQueryChange,
  onSearch,
  onLocationChange,
  onMapClick,
  apiKey
}: LocationManagementProps) {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="bg-[#0A0A0A]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 ring-1 ring-white/5 relative overflow-hidden group/card transition-all duration-300">
      {/* Accent Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[rgb(var(--primary))]/10 rounded-full blur-3xl group-hover/card:bg-[rgb(var(--primary))]/20 transition-all duration-500" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-[rgb(var(--primary))]/20 rounded-lg">
            <MapPin className="w-5 h-5 text-[rgb(var(--primary))]" />
          </div>
          Location Control
        </h2>
        <span className="text-[10px] font-bold text-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Live Geocoding
        </span>
      </div>

      <div className="space-y-6">
        <div className="relative z-10">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5 ml-1">
            Search Destination
          </label>
          <div className="flex gap-3">
            <div className="flex-1 relative group/input">
              <input
                type="text"
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchQueryChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search country, city, or address..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 focus:border-[rgb(var(--primary))]/50 transition-all duration-300 pl-11 group-hover/input:border-white/20"
              />
              <div className="absolute left-4 top-3.5 text-gray-500 group-hover/input:text-[rgb(var(--primary))] transition-colors">
                <Search className="w-5 h-5" />
              </div>
            </div>
            <button
              onClick={onSearch}
              disabled={loading}
              className="px-6 py-3 bg-[rgb(var(--primary))] hover:brightness-110 disabled:bg-gray-800 disabled:text-gray-500 rounded-xl font-bold text-white transition-all duration-300 shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] active:scale-95 flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin border-white/30 text-white" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
          {[
            { label: 'Country', field: 'country', value: location.country },
            { label: 'Province/State', field: 'province', value: location.province },
            { label: 'City', field: 'city', value: location.city },
            { label: 'Full Address', field: 'address', value: location.address },
          ].map((item) => (
            <div key={item.field}>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                {item.label}
              </label>
              <input
                type="text"
                value={item.value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => onLocationChange(item.field as any, e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 focus:border-[rgb(var(--primary))]/30 transition-all duration-300"
              />
            </div>
          ))}
        </div>

        <div className="relative z-10">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
            Map Interaction
          </label>
          <div className="h-72 rounded-2xl overflow-hidden border border-white/10 relative group/map shadow-inner bg-gray-900/50">
            <TomTomMap
              center={location.coordinates}
              zoom={location.coordinates.lat === 30.67 ? 6 : 12}
              onLocationSelect={onMapClick}
              currentPosition={location.coordinates}
              address={location.address}
              apiKey={apiKey}
            />
            {/* Map Overlay for click instruction */}
            <div className="absolute top-4 left-4 z-40 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 pointer-events-none opacity-0 group-hover/map:opacity-100 transition-opacity duration-500">
              <p className="text-[10px] font-bold text-[rgb(var(--primary))] uppercase tracking-wider">Click map to set coordinates</p>
            </div>
          </div>
          <div className="mt-4 px-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1 px-2 bg-white/5 rounded-md border border-white/10">
                <p className="text-[10px] font-mono text-gray-400">
                  LAT: {location.coordinates.lat.toFixed(6)}
                </p>
              </div>
              <div className="p-1 px-2 bg-white/5 rounded-md border border-white/10">
                <p className="text-[10px] font-mono text-gray-400">
                  LNG: {location.coordinates.lng.toFixed(6)}
                </p>
              </div>
            </div>
            {location.coordinates.lat !== 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Active Pin</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}