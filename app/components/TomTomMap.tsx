'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as tt from '@tomtom-international/web-sdk-maps';
import * as ttServices from '@tomtom-international/web-sdk-services';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

interface Coordinates {
  lat: number;
  lng: number;
}

interface TomTomMapProps {
  center: Coordinates;
  zoom: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  onZoomChange?: (zoom: number) => void;
  onCenterChange?: (center: Coordinates) => void;
  markers?: Array<{
    position: Coordinates;
    title: string;
    color: string;
    icon?: string;
  }>;
  route?: {
    start: Coordinates;
    end: Coordinates;
    waypoints?: Coordinates[];
    hasTraffic?: boolean;
  } | null;
  apiKey: string;
  showTraffic?: boolean;
  countryCode?: string;
  currentPosition?: Coordinates;
  address?: string;
}

export default function TomTomMap({
  center = { lat: 30.3753, lng: 69.3451 }, // Default to Pakistan center
  zoom = 6,
  onLocationSelect = () => {},
  onZoomChange = () => {},
  onCenterChange = () => {},
  markers = [],
  route = null,
  apiKey,
  showTraffic = true,
  countryCode = 'PK',
  currentPosition,
  address
}: TomTomMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<tt.Map | null>(null);
  const markersRef = useRef<tt.Marker[]>([]);
  const routeLayerRef = useRef<string | null>(null);
  const trafficLayerRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !apiKey) return;

    // Initialize map with country-specific style
    const map = tt.map({
      key: apiKey,
      container: mapRef.current,
      center: [center.lng, center.lat],
      zoom: zoom
    });

    mapInstanceRef.current = map;

    // Add click handler
    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      onLocationSelect(lat, lng);
    });

    // Track zoom changes
    map.on('zoomend', () => {
      onZoomChange(map.getZoom());
    });

    // Track center changes
    map.on('moveend', () => {
      const center = map.getCenter();
      onCenterChange({ lat: center.lat, lng: center.lng });
    });

    // Add navigation control
    map.addControl(new tt.NavigationControl());

    // Add scale control
    map.addControl(new tt.ScaleControl());

    setIsLoaded(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [apiKey]);

  // Update center when prop changes
  useEffect(() => {
    if (mapInstanceRef.current && isLoaded) {
      mapInstanceRef.current.setCenter([center.lng, center.lat]);
    }
  }, [center.lat, center.lng, isLoaded]);

  // Update zoom when prop changes
  useEffect(() => {
    if (mapInstanceRef.current && isLoaded) {
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [zoom, isLoaded]);

  // Draw route
  const drawRoute = useCallback(async () => {
    if (!mapInstanceRef.current || !route) return;

    try {
      // Remove existing route
      if (routeLayerRef.current && mapInstanceRef.current.getLayer(routeLayerRef.current)) {
        mapInstanceRef.current.removeLayer(routeLayerRef.current);
      }
      if (mapInstanceRef.current.getSource('route')) {
        mapInstanceRef.current.removeSource('route');
      }

      // Use waypoints if available, otherwise create straight line
      let coordinates: [number, number][];
      if (route.waypoints && route.waypoints.length > 0) {
        // Use the waypoints from the route (proper path with turns)
        coordinates = route.waypoints.map(point => [point.lng, point.lat]);
        console.log('🛣️ Drawing route with', coordinates.length, 'waypoints');
      } else {
        // Fallback to straight line between start and end
        coordinates = [
          [route.start.lng, route.start.lat],
          [route.end.lng, route.end.lat]
        ];
        console.log('📏 Drawing straight line route');
      }

      // Add route source
      mapInstanceRef.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        }
      });

      // Add route layer with proper styling
      const routeColor = route.hasTraffic ? '#ef4444' : '#3b82f6';
      const routeWidth = route.hasTraffic ? 6 : 4;

      mapInstanceRef.current.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': routeColor,
          'line-width': routeWidth,
          'line-opacity': 0.9,
          'line-blur': 0.5 // Add slight blur for smoother appearance
        }
      });

      // Add route outline for better visibility
      mapInstanceRef.current.addLayer({
        id: 'route-outline',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ffffff',
          'line-width': routeWidth + 2,
          'line-opacity': 0.5
        }
      }, 'route-line');

      routeLayerRef.current = 'route-line';

      // Fit map to route bounds
      if (coordinates.length > 0) {
        const bounds = new tt.LngLatBounds();
        coordinates.forEach((coord: [number, number]) => {
          bounds.extend(coord);
        });
        mapInstanceRef.current.fitBounds(bounds, {
          padding: 50
        });
      }
    } catch (error) {
      console.error('Error drawing route:', error);
      // Fallback to straight line
      drawStraightLineRoute();
    }
  }, [route]);

  // Fallback straight line route
  const drawStraightLineRoute = useCallback(() => {
    if (!mapInstanceRef.current || !route) return;

    const coordinates = [
      [route.start.lng, route.start.lat],
      [route.end.lng, route.end.lat]
    ];

    mapInstanceRef.current.addSource('route-fallback', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      }
    });

    const routeColor = route.hasTraffic ? '#ef4444' : '#3b82f6';
    const routeWidth = route.hasTraffic ? 6 : 4;

    mapInstanceRef.current.addLayer({
      id: 'route-fallback-line',
      type: 'line',
      source: 'route-fallback',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': routeColor,
        'line-width': routeWidth,
        'line-opacity': 0.8,
        'line-dasharray': [2, 2]
      }
    });

    routeLayerRef.current = 'route-fallback-line';
  }, []);

  // Update route when route prop changes
  useEffect(() => {
    if (isLoaded && route) {
      drawRoute();
    } else if (isLoaded && routeLayerRef.current) {
      // Remove route if route is null
      if (mapInstanceRef.current?.getLayer(routeLayerRef.current)) {
        mapInstanceRef.current.removeLayer(routeLayerRef.current);
      }
      if (mapInstanceRef.current?.getSource('route')) {
        mapInstanceRef.current.removeSource('route');
      }
      if (mapInstanceRef.current?.getSource('route-fallback')) {
        mapInstanceRef.current.removeSource('route-fallback');
      }
      routeLayerRef.current = null;
    }
  }, [route, isLoaded, drawRoute]);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach(markerData => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.cssText = `
        background-color: ${markerData.color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: white;
        font-weight: bold;
      `;
      
      if (markerData.icon) {
        el.innerHTML = markerData.icon;
      } else {
        el.textContent = markerData.title.charAt(0);
      }

      const marker = new tt.Marker({ element: el })
        .setLngLat(new tt.LngLat(markerData.position.lng, markerData.position.lat))
        .addTo(mapInstanceRef.current!);

      const popup = new tt.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <div class="font-bold text-gray-800">${markerData.title}</div>
            <div class="text-sm text-gray-600">Lat: ${markerData.position.lat.toFixed(6)}</div>
            <div class="text-sm text-gray-600">Lng: ${markerData.position.lng.toFixed(6)}</div>
          </div>
        `)
        .setLngLat(new tt.LngLat(markerData.position.lng, markerData.position.lat));
      marker.setPopup(popup);

      markersRef.current.push(marker);
    });
  }, [markers, isLoaded]);

  // Add traffic layer
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded || !showTraffic) return;

    try {
      // Add traffic flow layer
      mapInstanceRef.current.addSource('traffic-flow', {
        type: 'vector',
        url: `https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.pbf?key=${apiKey}`
      });

      mapInstanceRef.current.addLayer({
        id: 'traffic-flow-layer',
        type: 'line',
        source: 'traffic-flow',
        'source-layer': 'traffic',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': [
            'match',
            ['get', 'frc'],
            '0', '#009900', // Free flow - green
            '1', '#44cc44',
            '2', '#ffff00', // Heavy - yellow
            '3', '#ff9900', // Slow - orange
            '4', '#ff0000', // Congestion - red
            '#cccccc' // Default
          ],
          'line-width': 3,
          'line-opacity': 0.7
        }
      }, 'route-line'); // Add below route line

      trafficLayerRef.current = 'traffic-flow-layer';

    } catch (error) {
      console.error('Error adding traffic layer:', error);
    }

    return () => {
      if (trafficLayerRef.current && mapInstanceRef.current?.getLayer(trafficLayerRef.current)) {
        mapInstanceRef.current.removeLayer(trafficLayerRef.current);
      }
      if (mapInstanceRef.current?.getSource('traffic-flow')) {
        mapInstanceRef.current.removeSource('traffic-flow');
      }
    };
  }, [isLoaded, showTraffic, apiKey]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '500px' }}
      />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
          <div className="text-sm font-medium text-gray-700 mb-2">Map Legend</div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 border border-white"></div>
              <span className="text-gray-600">Pickup</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
              <span className="text-gray-600">Dropoff</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-blue-500"></div>
              <span className="text-gray-600">Route</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-red-500"></div>
              <span className="text-gray-600">Traffic Route</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-4 left-4 bg-black/80 text-white text-sm px-4 py-3 rounded-lg backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>Click on map to set location</span>
          </div>
          {countryCode && (
            <div className="flex items-center gap-2 pl-3 border-l border-white/30">
              <span className="text-xs opacity-75">Country:</span>
              <span className="font-medium">{countryCode}</span>
            </div>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto"></div>
            <p className="mt-4 text-white text-lg">Loading map...</p>
            <p className="text-gray-300 text-sm mt-1">Country: {countryCode}</p>
          </div>
        </div>
      )}
    </div>
  );
}