'use client';

import { ChangeEvent, KeyboardEvent } from 'react';
import dynamic from 'next/dynamic';
import { LocationData } from './types';

const TomTomMap = dynamic(() => import('@/app/components/mainwebsite/TomTomMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto"></div>
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
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-2 h-5 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full"></span>
          Location Management
        </h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          OpenStreetMap
        </span>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Location
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchQueryChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search country, city, or address..."
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
              />
              <div className="absolute left-3 top-3.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button
              onClick={onSearch}
              disabled={loading}
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-400 rounded-lg font-medium text-white hover:from-blue-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 transition-all duration-200 shadow"
            >
              Search
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              value={location.country}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onLocationChange('country', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Province/State
            </label>
            <input
              type="text"
              value={location.province}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onLocationChange('province', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={location.city}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onLocationChange('city', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Address
            </label>
            <input
              type="text"
              value={location.address}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onLocationChange('address', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Map (Click to set location)
          </label>
          <div className="h-64">
            <TomTomMap
              center={location.coordinates}
              zoom={location.coordinates.lat === 30.67 ? 6 : 12}
              onLocationSelect={onMapClick}
              currentPosition={location.coordinates}
              address={location.address}
              apiKey={apiKey}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500 flex justify-between">
            <span>
              Coordinates: {location.coordinates.lat.toFixed(6)}, {location.coordinates.lng.toFixed(6)}
            </span>
            {location.coordinates.lat !== 0 && (
              <span className="text-green-600 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Location set
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}