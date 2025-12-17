'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default icons in Leaflet
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
  iconUrl: '/leaflet/images/marker-icon.png',
  shadowUrl: '/leaflet/images/marker-shadow.png',
});

interface LocationMarkerProps {
  position: { lat: number; lng: number };
  onPositionChange: (lat: number, lng: number) => void;
  address: string;
}

function LocationMarker({ position, onPositionChange, address }: LocationMarkerProps) {
  const map = useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position.lat === 0 ? null : (
    <Marker position={[position.lat, position.lng]}>
      <Popup>{address || 'Selected Location'}</Popup>
    </Marker>
  );
}

interface OSMMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  currentPosition?: { lat: number; lng: number };
  address?: string;
}

export default function OSMMap({
  center = { lat: 30.67, lng: 69.36 }, // Default to your coordinates
  zoom = 6,
  onLocationSelect = () => {},
  currentPosition = { lat: 0, lng: 0 },
  address = ''
}: OSMMapProps) {
  const [mapCenter, setMapCenter] = useState(center);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (currentPosition.lat !== 0 && currentPosition.lng !== 0) {
      setMapCenter(currentPosition);
    }
  }, [currentPosition]);

  const handlePositionChange = (lat: number, lng: number) => {
    if (onLocationSelect) {
      onLocationSelect(lat, lng);
    }
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-700">
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={zoom}
        className="w-full h-full"
        ref={mapRef}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker 
          position={currentPosition} 
          onPositionChange={handlePositionChange}
          address={address}
        />
      </MapContainer>
      
      <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>Click on map to set location</span>
        </div>
      </div>
    </div>
  );
}