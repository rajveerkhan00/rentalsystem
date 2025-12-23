// components/MapComponent.tsx
'use client';

import { ComponentType } from 'react';
import dynamic from 'next/dynamic';

const TomTomMap = dynamic(
  () => import('./TomTomMap') as Promise<{ default: ComponentType<any> }>,
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto"></div>
        <p className="mt-2 text-gray-300 text-sm">Loading map...</p>
      </div>
    ),
  }
);

interface MapComponentProps {
  center: { lat: number; lng: number };
  zoom: number;
  markers: Array<{
    position: { lat: number; lng: number };
    title: string;
    color: string;
    icon?: string;
  }>;
  route: {
    start: { lat: number; lng: number };
    end: { lat: number; lng: number };
    waypoints?: { lat: number; lng: number }[];
    hasTraffic?: boolean;
  } | null;
  userCountry: string;
  pickupCoords: { lat: number; lng: number } | null;
  dropoffCoords: { lat: number; lng: number } | null;
  distance: number | null;
  unit: 'km' | 'mile';
  hasTraffic: boolean;
  onLocationSelect: (lat: number, lng: number) => void;
  onZoomChange: (zoom: number) => void;
  onCenterChange: (center: { lat: number; lng: number }) => void;
  onMapRouteChange: (route: any) => void;
  getCurrentCountryName: () => string;
}

const COUNTRY_DEFAULTS: Record<string, { lat: number; lng: number; zoom: number }> = {
  'PK': { lat: 30.3753, lng: 69.3451, zoom: 6 },
  'IN': { lat: 20.5937, lng: 78.9629, zoom: 5 },
  'US': { lat: 37.0902, lng: -95.7129, zoom: 4 },
  'GB': { lat: 55.3781, lng: -3.4360, zoom: 6 },
  'CA': { lat: 56.1304, lng: -106.3468, zoom: 4 },
  'AU': { lat: -25.2744, lng: 133.7751, zoom: 4 },
  'CN': { lat: 35.8617, lng: 104.1954, zoom: 4 },
  'BR': { lat: -14.2350, lng: -51.9253, zoom: 4 },
  'RU': { lat: 61.5240, lng: 105.3188, zoom: 3 },
  'ZA': { lat: -30.5595, lng: 22.9375, zoom: 5 },
  'AE': { lat: 23.4241, lng: 53.8478, zoom: 7 },
  'DE': { lat: 51.1657, lng: 10.4515, zoom: 6 },
  'default': { lat: 31.5656822, lng: 74.3141829, zoom: 6 }
};

export default function MapComponent({
  center,
  zoom,
  markers,
  route,
  userCountry,
  pickupCoords,
  dropoffCoords,
  distance,
  unit,
  hasTraffic,
  onLocationSelect,
  onZoomChange,
  onCenterChange,
  onMapRouteChange,
  getCurrentCountryName
}: MapComponentProps) {
  
  const calculateBounds = (start: { lat: number; lng: number }, end: { lat: number; lng: number }) => {
    return {
      minLat: Math.min(start.lat, end.lat),
      maxLat: Math.max(start.lat, end.lat),
      minLng: Math.min(start.lng, end.lng),
      maxLng: Math.max(start.lng, end.lng)
    };
  };

  const calculateZoomLevel = (bounds: any) => {
    const latDiff = bounds.maxLat - bounds.minLat;
    const lngDiff = bounds.maxLng - bounds.minLng;
    const maxDiff = Math.max(latDiff, lngDiff);
    
    if (maxDiff > 10) return 5;
    if (maxDiff > 5) return 6;
    if (maxDiff > 2) return 7;
    if (maxDiff > 1) return 8;
    if (maxDiff > 0.5) return 9;
    if (maxDiff > 0.2) return 10;
    if (maxDiff > 0.1) return 11;
    if (maxDiff > 0.05) return 12;
    return 13;
  };

  const handleFitRoute = () => {
    if (pickupCoords && dropoffCoords) {
      const bounds = calculateBounds(pickupCoords, dropoffCoords);
      onCenterChange({
        lat: (bounds.minLat + bounds.maxLat) / 2,
        lng: (bounds.minLng + bounds.maxLng) / 2
      });
      onZoomChange(calculateZoomLevel(bounds));
    }
  };

  const handleResetView = () => {
    const countryDefault = COUNTRY_DEFAULTS[userCountry] || COUNTRY_DEFAULTS['default'];
    onCenterChange(countryDefault);
    onZoomChange(countryDefault.zoom);
  };

  // Handle map click events
  const handleMapClick = (lat: number, lng: number) => {
    onLocationSelect(lat, lng);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">
            {getCurrentCountryName()} Map
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Pickup</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">Dropoff</span>
            </div>
            {route && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-1 bg-purple-500"></div>
                <span className="text-sm text-gray-600">Route</span>
              </div>
            )}
            {hasTraffic && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-sm text-gray-600">Traffic</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {distance !== null 
            ? `Route distance: ${distance?.toFixed(2)} ${unit}${hasTraffic ? ' • Traffic detected (+2%)' : ''}`
            : `Viewing ${getCurrentCountryName()}. Click on the map to set locations or type addresses above.`}
        </p>
      </div>
      
      <div className="h-[500px] w-full" style={{ minHeight: '500px' }}>
        <TomTomMap
          center={center}
          zoom={zoom}
          onLocationSelect={handleMapClick}
          markers={markers}
          route={route}
          apiKey={process.env.NEXT_PUBLIC_TOMTOM_API_KEY || "YxbLh0enMQBXkiLMbuUc78T2ZLTaW6b6"}
          showTraffic={true}
          countryCode={userCountry}
          onZoomChange={onZoomChange}
          onCenterChange={onCenterChange}
        />
      </div>
      
      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleFitRoute}
          disabled={!pickupCoords || !dropoffCoords}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Fit route to view"
        >
          🎯
        </button>
        <button
          onClick={handleResetView}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition"
          title="Reset to country view"
        >
          🌍
        </button>
      </div>
    </div>
  );
}