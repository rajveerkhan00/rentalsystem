'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as tt from '@tomtom-international/web-sdk-maps';
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
  isLiveTracking?: boolean;
  onLocationUpdate?: (location: Coordinates) => void;
  liveLocation?: Coordinates;
}

export default function TomTomMap({
  center = { lat: 30.3753, lng: 69.3451 },
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
  address,
  isLiveTracking = false,
  onLocationUpdate,
  liveLocation
}: TomTomMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<tt.Map | null>(null);
  const markersRef = useRef<tt.Marker[]>([]);
  const routeLayerRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [remainingDistance, setRemainingDistance] = useState<number | null>(null);
  const [routeDuration, setRouteDuration] = useState<number | null>(null);
  const [remainingDuration, setRemainingDuration] = useState<number | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [routeAlternatives, setRouteAlternatives] = useState<any[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [mapStyle, setMapStyle] = useState<'light' | 'dark' | 'satellite'>('light');
  const [compassDirection, setCompassDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLayers, setShowLayers] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState<'traffic' | 'satellite' | 'terrain' | 'none'>('traffic');
  const recognitionRef = useRef<any>(null);
  const [routeInstructions, setRouteInstructions] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [movingMarker, setMovingMarker] = useState<tt.Marker | null>(null);
  const [isPinpointSelected, setIsPinpointSelected] = useState(false);
  const [pinpointCoords, setPinpointCoords] = useState<Coordinates | null>(null);
  const [pinpointMarker, setPinpointMarker] = useState<tt.Marker | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [simulatedPath, setSimulatedPath] = useState<Coordinates[]>([]);
  const [currentSimulationIndex, setCurrentSimulationIndex] = useState(0);
  const initializingRef = useRef(false);

  // Handle voice commands
  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('center') || lowerCommand.includes('zoom out')) {
      mapInstanceRef.current?.setZoom((mapInstanceRef.current?.getZoom() ?? 0) - 1);
      speak('Zooming out');
    } else if (lowerCommand.includes('zoom in') || lowerCommand.includes('closer')) {
      mapInstanceRef.current?.setZoom((mapInstanceRef.current?.getZoom() ?? 0) + 1);
      speak('Zooming in');
    } else if (lowerCommand.includes('traffic')) {
      speak('Toggling traffic view');
    } else if (lowerCommand.includes('my location')) {
      if (userLocation) {
        mapInstanceRef.current?.setCenter([userLocation.lng, userLocation.lat]);
        mapInstanceRef.current?.setZoom(15);
        speak(`Moving to your location at ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`);
      }
    }
  };

  // Text-to-speech function
  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
    }
  };

  // Initialize voice recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setVoiceText('🎤 Listening...');
        };

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              setVoiceText(transcript);
              handleVoiceCommand(transcript);
            } else {
              interimTranscript += transcript;
            }
          }
          if (interimTranscript) setVoiceText(interimTranscript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setVoiceText(`Error: ${event.error}`);
          setIsListening(false);
        };
      }
    }
  }, []);

  // Get user's current location with compass
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setUserLocation(newLocation);
          
          // Add user location marker
          if (mapInstanceRef.current && isLoaded) {
            addUserLocationMarker(newLocation);
          }
          
          console.log('📍 User location detected:', newLocation);
        },
        (error) => {
          console.warn('Could not get user location:', error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );

      // Watch position for live updates
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setUserLocation(newLocation);
          
          if (onLocationUpdate) {
            onLocationUpdate(newLocation);
          }
          
          // Update user location marker
          if (mapInstanceRef.current && isLiveTracking && isLoaded) {
            updateUserLocationMarker(newLocation);
          }
        },
        (error) => {
          console.warn('Error watching position:', error);
        },
        { enableHighAccuracy: true, maximumAge: 1000 }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }

    // Compass tracking
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      const handleOrientation = (event: any) => {
        if (event.alpha !== null) {
          setCompassDirection(Math.round(event.alpha));
        }
      };

      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, [isLiveTracking, onLocationUpdate, isLoaded]);

  // Add user location marker
  const addUserLocationMarker = (location: Coordinates) => {
    if (!mapInstanceRef.current || !isLoaded) return;

    // Remove existing user location marker
    const existingUserMarker = markersRef.current.find(m => 
      m.getElement()?.classList?.contains('user-location-marker')
    );
    if (existingUserMarker) {
      existingUserMarker.remove();
      markersRef.current = markersRef.current.filter(m => m !== existingUserMarker);
    }

    const el = document.createElement('div');
    el.className = 'user-location-marker';
    el.style.cssText = `
      width: 24px;
      height: 24px;
      background: radial-gradient(circle, #4285F4 40%, #fff 41%, #4285F4 42%, #fff 43%, #4285F4 44%);
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      position: relative;
      z-index: 1001;
    `;

    // Add direction arrow
    const arrow = document.createElement('div');
    arrow.style.cssText = `
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 10px solid #4285F4;
      position: absolute;
      top: -12px;
      left: 6px;
    `;
    el.appendChild(arrow);

    const marker = new tt.Marker({
      element: el,
      anchor: 'center'
    })
      .setLngLat(new tt.LngLat(location.lng, location.lat))
      .addTo(mapInstanceRef.current);

    markersRef.current.push(marker);
  };

  // Update user location marker
  const updateUserLocationMarker = (location: Coordinates) => {
    if (!mapInstanceRef.current || !isLoaded) return;

    const userMarker = markersRef.current.find(m => 
      m.getElement()?.classList?.contains('user-location-marker')
    );
    
    if (userMarker) {
      userMarker.setLngLat(new tt.LngLat(location.lng, location.lat));
      
      // Add smooth animation
      const currentCenter = mapInstanceRef.current.getCenter();
      const newCenter = new tt.LngLat(location.lng, location.lat);
      
      // Only follow if user location is far from center
      const distance = Math.sqrt(
        Math.pow(currentCenter.lng - location.lng, 2) + 
        Math.pow(currentCenter.lat - location.lat, 2)
      );
      
      if (distance > 0.01) { // Only follow if > ~1km away
        mapInstanceRef.current.easeTo({
          center: newCenter,
          duration: 1000,
          essential: true
        });
      }
    } else {
      addUserLocationMarker(location);
    }
  };

  // Start location simulation for demo
  const startLocationSimulation = useCallback(() => {
    if (!route || !mapInstanceRef.current || !pinpointCoords || !isLoaded) return;

    setIsSimulating(true);
    
    // Generate a path from pinpoint to route end
    const path: Coordinates[] = [];
    const steps = 100;
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const lat = pinpointCoords.lat + (route.end.lat - pinpointCoords.lat) * progress;
      const lng = pinpointCoords.lng + (route.end.lng - pinpointCoords.lng) * progress;
      path.push({ lat, lng });
    }
    
    setSimulatedPath(path);
    setCurrentSimulationIndex(0);

    // Clear existing interval
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }

    // Start simulation
    simulationIntervalRef.current = setInterval(() => {
      setCurrentSimulationIndex(prev => {
        if (prev >= path.length - 1) {
          setIsSimulating(false);
          setIsMoving(false);
          if (simulationIntervalRef.current) {
            clearInterval(simulationIntervalRef.current);
          }
          return prev;
        }
        
        const newIndex = prev + 1;
        const newLocation = path[newIndex];
        
        // Update moving marker
        if (movingMarker && mapInstanceRef.current) {
          movingMarker.setLngLat(new tt.LngLat(newLocation.lng, newLocation.lat));
          
          // Update distance and duration
          if (routeDistance) {
            const remainingDist = routeDistance * ((path.length - newIndex) / path.length);
            setRemainingDistance(remainingDist);
            
            if (routeDuration) {
              const remainingDur = routeDuration * ((path.length - newIndex) / path.length);
              setRemainingDuration(Math.max(0, Math.round(remainingDur)));
            }
          }
        }
        
        // Update UI
        setIsMoving(true);
        
        return newIndex;
      });
    }, 100); // Update every 100ms
  }, [route, pinpointCoords, routeDistance, routeDuration, movingMarker, isLoaded]);

  // Stop simulation
  const stopLocationSimulation = () => {
    setIsSimulating(false);
    setIsMoving(false);
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }
  };

  // Enhanced location selection with better visual feedback
  const selectCurrentLocationAsPickup = useCallback(() => {
    if (!userLocation) {
      speak('Location not available. Please enable location services.');
      return;
    }

    // Call the parent's location select handler
    onLocationSelect(userLocation.lat, userLocation.lng);

    // Add a special marker for selected pickup location
    if (mapInstanceRef.current && isLoaded) {
      // Remove any existing pickup selection marker
      const existingPickupMarker = markersRef.current.find(m =>
        m.getElement()?.classList?.contains('pickup-selection-marker')
      );
      if (existingPickupMarker) {
        existingPickupMarker.remove();
        markersRef.current = markersRef.current.filter(m => m !== existingPickupMarker);
      }

      // Add new pickup selection marker
      const el = document.createElement('div');
      el.className = 'pickup-selection-marker';
      el.style.cssText = `
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: white;
        animation: bounce 0.6s ease-out;
        z-index: 1002;
      `;

      el.innerHTML = '🚗';

      const marker = new tt.Marker({
        element: el,
        anchor: 'center'
      })
        .setLngLat(new tt.LngLat(userLocation.lng, userLocation.lat))
        .addTo(mapInstanceRef.current);

      const popup = new tt.Popup({
        offset: 30,
        closeButton: false,
        className: 'pickup-popup'
      })
        .setHTML(`
          <div class="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">🚗</span>
              <h4 class="font-bold text-blue-800">Pickup Location Selected</h4>
            </div>
            <div class="text-sm text-blue-700 space-y-1">
              <div class="flex justify-between">
                <span>Lat:</span>
                <span class="font-mono bg-white px-2 py-1 rounded text-xs">${userLocation.lat.toFixed(6)}</span>
              </div>
              <div class="flex justify-between">
                <span>Lng:</span>
                <span class="font-mono bg-white px-2 py-1 rounded text-xs">${userLocation.lng.toFixed(6)}</span>
              </div>
            </div>
            <div class="mt-3 text-xs text-blue-600 font-medium">
              ✅ Ready for route calculation
            </div>
          </div>
        `)
        .setLngLat(new tt.LngLat(userLocation.lng, userLocation.lat));

      marker.setPopup(popup);
      markersRef.current.push(marker);

      // Center map on the selected location
      mapInstanceRef.current.setCenter([userLocation.lng, userLocation.lat]);
      mapInstanceRef.current.setZoom(16);

      // Auto-close popup after 3 seconds
      setTimeout(() => {
        popup.remove();
      }, 3000);

      speak(`Pickup location set to your current position`);
    }
  }, [userLocation, onLocationSelect, isLoaded]);

  // Handle pinpoint location selection
  const handlePinpointSelect = useCallback((lat: number, lng: number) => {
    const coords = { lat, lng };
    setPinpointCoords(coords);
    setIsPinpointSelected(true);
    onLocationSelect(lat, lng);

    // Add pinpoint marker
    if (mapInstanceRef.current && isLoaded) {
      // Remove existing pinpoint marker
      if (pinpointMarker) {
        pinpointMarker.remove();
      }

      const el = document.createElement('div');
      el.className = 'pinpoint-marker';
      el.style.cssText = `
        width: 24px;
        height: 24px;
        background: radial-gradient(circle, #FF0000 40%, #fff 41%, #FF0000 42%, #fff 43%, #FF0000 44%);
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(255,0,0,0.5);
        animation: pulse 1.5s infinite;
        position: relative;
        z-index: 1003;
      `;

      const marker = new tt.Marker({
        element: el,
        anchor: 'center'
      })
        .setLngLat(new tt.LngLat(lng, lat))
        .addTo(mapInstanceRef.current);

      // Add popup
      const popup = new tt.Popup({
        offset: 25,
        closeButton: true,
        className: 'pinpoint-popup'
      })
        .setHTML(`
          <div class="p-3">
            <div class="font-bold text-red-700 mb-2">📍 Pinpoint Location</div>
            <div class="text-sm space-y-1">
              <div class="flex justify-between">
                <span>Latitude:</span>
                <span class="font-mono">${lat.toFixed(6)}</span>
              </div>
              <div class="flex justify-between">
                <span>Longitude:</span>
                <span class="font-mono">${lng.toFixed(6)}</span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-t border-gray-200">
              <button class="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition">
                Start Tracking
              </button>
            </div>
          </div>
        `)
        .setLngLat(new tt.LngLat(lng, lat));

      marker.setPopup(popup);
      setPinpointMarker(marker);
    }
  }, [pinpointMarker, onLocationSelect, isLoaded]);

  // Change map style when mapStyle state changes
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    try {
      // Don't change style if already set
      const currentStyle = mapInstanceRef.current.getStyle();
      if (currentStyle.name?.toLowerCase().includes(mapStyle)) {
        return;
      }

      // Remove existing style layers first
      const existingLayers = mapInstanceRef.current.getStyle()?.layers || [];
      existingLayers.forEach((layer: any) => {
        if (layer.id.includes('traffic') || layer.id.includes('satellite')) {
          try {
            mapInstanceRef.current?.removeLayer(layer.id);
          } catch (e) {
            // Layer might not exist, continue
          }
        }
      });

      // Remove existing sources
      const existingSources = mapInstanceRef.current.getStyle()?.sources || {};
      Object.keys(existingSources).forEach(sourceId => {
        if (sourceId.includes('satellite') || sourceId.includes('traffic')) {
          try {
            mapInstanceRef.current?.removeSource(sourceId);
          } catch (e) {
            // Source might not exist, continue
          }
        }
      });

      if (mapStyle === 'satellite') {
        // Add satellite imagery layer
        mapInstanceRef.current.addSource('satellite', {
          type: 'raster',
          tiles: [
            `https://api.tomtom.com/map/1/tile/sat/main/{z}/{x}/{y}.png?key=${apiKey}`
          ],
          tileSize: 256,
          attribution: '© TomTom'
        });

        mapInstanceRef.current.addLayer({
          id: 'satellite-layer',
          type: 'raster',
          source: 'satellite',
          minzoom: 0,
          maxzoom: 22
        });

        console.log('🛰️ Satellite mode applied successfully');

      } else if (mapStyle === 'dark') {
        // Apply dark theme
        try {
          mapInstanceRef.current?.setStyle('night');
          console.log('🌙 Dark mode applied successfully');
        } catch (error) {
          console.warn('Could not apply dark mode:', error);
        }

      } else {
        // Light mode
        try {
          mapInstanceRef.current?.setStyle('main');
          console.log('☀️ Light mode applied successfully');
        } catch (error) {
          console.warn('Could not apply light mode:', error);
        }
      }

      // Re-add traffic layer if it was enabled
      if (showTraffic) {
        setTimeout(() => addTrafficLayer(), 500);
      }

    } catch (error) {
      console.warn('Could not change map style:', error);
    }
  }, [mapStyle, isLoaded, apiKey, showTraffic]);

  // Initialize map on mount
  useEffect(() => {
    if (initializingRef.current) return;
    
    if (!mapRef.current || !apiKey) {
      setMapError('API key is required for TomTom Maps');
      return;
    }

    // Don't reinitialize if map already exists
    if (mapInstanceRef.current) {
      console.log('🗺️ Map already initialized, skipping...');
      return;
    }

    initializingRef.current = true;
    
    try {
      console.log('🗺️ Initializing TomTom Map with API key:', apiKey.substring(0, 10) + '...');

      // Initialize map
      const map = tt.map({
        key: apiKey,
        container: mapRef.current,
        center: [center.lng, center.lat],
        zoom: zoom,
        stylesVisibility: {
          trafficIncidents: showTraffic,
          trafficFlow: showTraffic
        }
      });

      mapInstanceRef.current = map;

      // Add click handler for pinpoint selection
      map.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        handlePinpointSelect(lat, lng);
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

      // Add controls
      map.addControl(new tt.NavigationControl());
      map.addControl(new tt.ScaleControl());
      map.addControl(new tt.FullscreenControl());

      // Add geolocate control
      const geolocateControl = new tt.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserLocation: true
      });
      map.addControl(geolocateControl);

      // Map ready event
      map.on('load', () => {
        console.log('🎯 Map fully loaded');
        setIsLoaded(true);
        
        // Add traffic layer if enabled
        if (showTraffic && apiKey) {
          addTrafficLayer();
        }
        
        // If route exists, draw it
        if (route) {
          drawRealRoute();
        }

        // Add user location marker if available
        if (userLocation) {
          addUserLocationMarker(userLocation);
        }
      });

    } catch (error) {
      console.error('❌ Error initializing map:', error);
      const errorMessage = (error as any)?.message || 'Failed to load map';
      if (errorMessage.includes('401') || errorMessage.includes('invalid')) {
        setMapError('❌ Invalid API Key: The TomTom API key is not valid. Please check https://developer.tomtom.com/ to get a new one.');
      } else {
        setMapError(`Map Error: ${errorMessage}. Please check your API key and internet connection.`);
      }
      setIsLoaded(false);
    } finally {
      initializingRef.current = false;
    }

    return () => {
      if (mapInstanceRef.current) {
        console.log('🧹 Cleaning up map instance');
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setIsLoaded(false);
      }
    };
  }, [apiKey, showTraffic]); // Only depend on apiKey and showTraffic

  // Add traffic layer function
  const addTrafficLayer = useCallback(() => {
    if (!mapInstanceRef.current || !apiKey || !isLoaded) return;

    try {
      console.log('🚦 Adding traffic layer...');

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
            '0', '#00cc00', // Free flow - green
            '1', '#66ff66',
            '2', '#ffff00', // Heavy - yellow
            '3', '#ff9900', // Slow - orange
            '4', '#ff0000', // Congestion - red
            '#cccccc' // Default
          ],
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5, 1,
            10, 2,
            15, 4
          ],
          'line-opacity': 0.7
        }
      });

    } catch (error) {
      console.error('⚠️ Could not add traffic layer:', error);
    }
  }, [apiKey, showTraffic, isLoaded]);

  // Draw REAL ROUTE with actual roads
  const drawRealRoute = useCallback(async () => {
    if (!mapInstanceRef.current || !route || !apiKey || !isLoaded) {
      console.log('❌ Cannot draw route: missing map, route, or apiKey');
      return;
    }

    setIsRouting(true);
    console.log('🛣️ Fetching REAL road route...');
    console.log('📍 Start:', route.start);
    console.log('🏁 End:', route.end);

    try {
      // Remove existing route layers
      if (routeLayerRef.current) {
        const layersToRemove = [
          'route-line',
          'route-outline',
          'route-label',
          'route-start-marker',
          'route-end-marker',
          'route-fallback'
        ];
        
        layersToRemove.forEach(layerId => {
          if (mapInstanceRef.current?.getLayer(layerId)) {
            mapInstanceRef.current.removeLayer(layerId);
          }
        });
        
        ['route', 'route-fallback', 'route-label'].forEach(sourceId => {
          if (mapInstanceRef.current?.getSource(sourceId)) {
            mapInstanceRef.current.removeSource(sourceId);
          }
        });
        
        routeLayerRef.current = null;
      }

      // Fetch route from TomTom Routing API
      const response = await fetch(
        `https://api.tomtom.com/routing/1/calculateRoute/${route.start.lat},${route.start.lng}:${route.end.lat},${route.end.lng}/json?key=${apiKey}&routeType=fastest&traffic=true&travelMode=car&routeRepresentation=polyline&computeBestOrder=false&instructionsType=tagged&language=en-US&vehicleMaxSpeed=120&vehicleWeight=2000&departAt=now&computeTravelTimeFor=all&sectionType=traffic&report=effectiveSettings`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Route API error:', response.status, errorText);
        throw new Error(`Route API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Route API response received:', data);

      if (data.routes && data.routes.length > 0) {
        const routes = data.routes;
        setRouteAlternatives(routes);

        // Use the first route (fastest) by default
        const selectedRoute = routes[selectedRouteIndex] || routes[0];
        const legs = selectedRoute.legs[0];
        
        // Extract coordinates from the geometry
        let coordinates: [number, number][] = [];
        
        if (selectedRoute.legs && selectedRoute.legs[0] && selectedRoute.legs[0].points) {
          coordinates = selectedRoute.legs[0].points.map((point: any) => 
            [point.longitude, point.latitude]
          );
          console.log(`📈 Got ${coordinates.length} route points from API geometry`);
        }

        // Calculate distance and duration
        if (legs.summary) {
          const distanceKm = legs.summary.lengthInMeters / 1000;
          const durationMinutes = Math.ceil(legs.summary.travelTimeInSeconds / 60);
          setRouteDistance(distanceKm);
          setRemainingDistance(distanceKm);
          setRouteDuration(durationMinutes);
          setRemainingDuration(durationMinutes);
          console.log(`📏 Distance: ${distanceKm.toFixed(2)} km, Duration: ${durationMinutes} min`);
          
          // Check for traffic
          const hasTrafficDelay = legs.summary.trafficDelayInSeconds > 0;
          console.log(`🚦 Traffic delay: ${hasTrafficDelay ? 'Yes' : 'No'}`);
        }

        // Extract route instructions
        if (selectedRoute.guidance && selectedRoute.guidance.instructions) {
          const instructions = selectedRoute.guidance.instructions.map((inst: any) => ({
            message: inst.message,
            drivingDirection: inst.drivingDirection,
            maneuver: inst.maneuver,
            distance: inst.routeOffsetInMeters,
            streetName: inst.streetName || 'Unknown road',
            signpostText: inst.signpostText,
            junctionType: inst.junctionType,
            turnAngle: inst.turnAngle,
            isPossibleToCombineWithNext: inst.isPossibleToCombineWithNext
          }));
          setRouteInstructions(instructions);
          console.log(`📋 Extracted ${instructions.length} enhanced turn-by-turn instructions`);
        }

        // Add route source to map
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
            'line-width': 8,
            'line-opacity': 0.8
          }
        });

        // Add main route line
        const routeColor = route.hasTraffic ? '#ef4444' : '#3b82f6';
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
            'line-width': 5,
            'line-opacity': 0.9
          }
        });

        routeLayerRef.current = 'route-line';

        // Add start and end markers
        addRouteMarker(route.start.lng, route.start.lat, 'Pickup Location', '#3b82f6', '🚗', true);
        addRouteMarker(route.end.lng, route.end.lat, 'Dropoff Location', '#ef4444', '🏁', true);

        // Add distance label in the middle of route
        if (coordinates.length > 10) {
          const midIndex = Math.floor(coordinates.length / 2);
          const [midLng, midLat] = coordinates[midIndex];
          
          mapInstanceRef.current.addSource('route-label', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [midLng, midLat]
              },
              properties: {
                label: routeDistance ? `${routeDistance.toFixed(1)} km` : 'Route'
              }
            }
          });

          mapInstanceRef.current.addLayer({
            id: 'route-label',
            type: 'symbol',
            source: 'route-label',
            layout: {
              'text-field': ['get', 'label'],
              'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
              'text-size': 12,
              'text-offset': [0, 0]
            },
            paint: {
              'text-color': routeColor,
              'text-halo-color': '#ffffff',
              'text-halo-width': 2
            }
          });
        }

        // Fit map to route bounds
        if (coordinates.length > 0) {
          const bounds = new tt.LngLatBounds();
          coordinates.forEach(coord => bounds.extend(coord));
          
          mapInstanceRef.current.fitBounds(bounds, {
            padding: 100,
            duration: 1500
          });
        }

        // Animate route appearance
        setTimeout(() => {
          if (mapInstanceRef.current?.getLayer('route-line')) {
            mapInstanceRef.current.setPaintProperty('route-line', 'line-opacity', 0);
            mapInstanceRef.current.setPaintProperty('route-outline', 'line-opacity', 0);
            
            let opacity = 0;
            const animate = () => {
              opacity += 0.05;
              if (opacity <= 1) {
                mapInstanceRef.current?.setPaintProperty('route-line', 'line-opacity', opacity);
                mapInstanceRef.current?.setPaintProperty('route-outline', 'line-opacity', opacity * 0.8);
                requestAnimationFrame(animate);
              }
            };
            requestAnimationFrame(animate);
          }
        }, 300);

        console.log('✅ REAL road route drawn successfully with', coordinates.length, 'points');

      } else {
        console.warn('⚠️ No routes found in API response');
        drawStraightLineRoute();
      }

    } catch (error) {
      console.error('❌ Error fetching real route:', error);
      setMapError('Could not calculate road route. Please check locations and try again.');
      setTimeout(() => setMapError(null), 5000);
    } finally {
      setIsRouting(false);
    }
  }, [route, apiKey, selectedRouteIndex, isLoaded]);

  // Helper to decode polyline
  const decodePolyline = (encoded: string): [number, number][] => {
    const coordinates: [number, number][] = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      coordinates.push([lng * 1e-5, lat * 1e-5]);
    }

    return coordinates;
  };

  // Draw straight line as fallback
  const drawStraightLineRoute = useCallback(() => {
    if (!mapInstanceRef.current || !route || !isLoaded) return;

    console.log('📐 Drawing straight line route as fallback');

    const coordinates: [number, number][] = [
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
    
    mapInstanceRef.current.addLayer({
      id: 'route-fallback-outline',
      type: 'line',
      source: 'route-fallback',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#ffffff',
        'line-width': 6,
        'line-opacity': 0.6
      }
    });

    mapInstanceRef.current.addLayer({
      id: 'route-fallback',
      type: 'line',
      source: 'route-fallback',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': routeColor,
        'line-width': 4,
        'line-opacity': 0.9,
        'line-dasharray': [2, 2]
      }
    });

    routeLayerRef.current = 'route-fallback';
    
    // Add markers
    addRouteMarker(route.start.lng, route.start.lat, 'Start', '#3b82f6', '📍', true);
    addRouteMarker(route.end.lng, route.end.lat, 'End', '#ef4444', '🏁', true);
  }, [route, isLoaded]);

  // Helper function to add route markers
  const addRouteMarker = (lng: number, lat: number, title: string, color: string, icon?: string, isRouteMarker = false) => {
    if (!mapInstanceRef.current || !isLoaded) return;

    const el = document.createElement('div');
    el.className = isRouteMarker ? 'route-marker' : 'custom-marker';
    el.style.cssText = `
      background-color: ${color};
      width: ${isRouteMarker ? '44px' : '36px'};
      height: ${isRouteMarker ? '44px' : '36px'};
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${isRouteMarker ? '20px' : '18px'};
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 1000;
    `;
    
    el.innerHTML = icon || title.charAt(0);
    
    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.2)';
      el.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
      el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    });

    const marker = new tt.Marker({ 
      element: el,
      anchor: 'center'
    })
      .setLngLat(new tt.LngLat(lng, lat))
      .addTo(mapInstanceRef.current);

    const popup = new tt.Popup({ 
      offset: 25,
      closeButton: true,
      closeOnClick: false,
      maxWidth: '300px'
    })
      .setHTML(`
        <div class="p-3">
          <div class="font-bold text-lg text-gray-800 mb-2">${title}</div>
          <div class="text-sm text-gray-600 space-y-1">
            <div class="flex justify-between">
              <span>Latitude:</span>
              <span class="font-mono">${lat.toFixed(6)}</span>
            </div>
            <div class="flex justify-between">
              <span>Longitude:</span>
              <span class="font-mono">${lng.toFixed(6)}</span>
            </div>
            ${routeDistance && isRouteMarker ? `
            <div class="mt-2 pt-2 border-t border-gray-200">
              <div class="flex justify-between">
                <span>Route Distance:</span>
                <span class="font-bold text-blue-600">${routeDistance.toFixed(2)} km</span>
              </div>
              ${routeDuration ? `
              <div class="flex justify-between mt-1">
                <span>Estimated Time:</span>
                <span class="font-bold text-green-600">${routeDuration} min</span>
              </div>
              ` : ''}
            </div>
            ` : ''}
          </div>
        </div>
      `)
      .setLngLat(new tt.LngLat(lng, lat));

    marker.setPopup(popup);
    markersRef.current.push(marker);
  };

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

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    // Clear existing markers (except route markers if we have a route)
    markersRef.current.forEach(marker => {
      const el = marker.getElement();
      if (!el?.classList?.contains('route-marker') && 
          !el?.classList?.contains('user-location-marker') &&
          !el?.classList?.contains('pinpoint-marker')) {
        marker.remove();
      }
    });
    
    // Filter out non-route markers
    markersRef.current = markersRef.current.filter(marker => 
      marker.getElement()?.classList?.contains('route-marker') ||
      marker.getElement()?.classList?.contains('user-location-marker') ||
      marker.getElement()?.classList?.contains('pinpoint-marker')
    );

    // Add new markers
    markers.forEach(markerData => {
      // Skip if it's a route marker (already added)
      if (markerData.title.includes('Pickup') || markerData.title.includes('Dropoff')) {
        return;
      }

      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.cssText = `
        background-color: ${markerData.color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: white;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease;
      `;
      
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.1)';
        el.style.zIndex = '1000';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });
      
      if (markerData.icon) {
        el.innerHTML = markerData.icon;
      } else {
        el.textContent = markerData.title.charAt(0);
      }

      const marker = new tt.Marker({ 
        element: el,
        anchor: 'bottom'
      })
        .setLngLat(new tt.LngLat(markerData.position.lng, markerData.position.lat))
        .addTo(mapInstanceRef.current!);

      const popup = new tt.Popup({ 
        offset: 30,
        closeButton: true,
        closeOnClick: true,
        maxWidth: '300px'
      })
        .setHTML(`
          <div class="p-3">
            <div class="font-bold text-lg text-gray-800 mb-1">${markerData.title}</div>
            <div class="text-sm text-gray-600 mb-2">
              <div>Latitude: ${markerData.position.lat.toFixed(6)}</div>
              <div>Longitude: ${markerData.position.lng.toFixed(6)}</div>
            </div>
            <div class="flex items-center gap-2 mt-2">
              <div class="w-3 h-3 rounded-full" style="background-color: ${markerData.color}"></div>
              <span class="text-xs text-gray-500">${markerData.color}</span>
            </div>
          </div>
        `)
        .setLngLat(new tt.LngLat(markerData.position.lng, markerData.position.lat));
      
      marker.setPopup(popup);
      markersRef.current.push(marker);
    });
  }, [markers, isLoaded]);

  // Update route when route prop changes
  useEffect(() => {
    if (isLoaded && route && apiKey) {
      console.log('🔄 Route updated, drawing REAL road route');
      drawRealRoute();
    } else if (isLoaded && routeLayerRef.current) {
      // Remove route if route is null
      console.log('🗑️ Removing existing route');
      if (mapInstanceRef.current?.getLayer(routeLayerRef.current)) {
        mapInstanceRef.current.removeLayer(routeLayerRef.current);
      }
      if (mapInstanceRef.current?.getSource('route')) {
        mapInstanceRef.current.removeSource('route');
      }
      if (mapInstanceRef.current?.getSource('route-fallback')) {
        mapInstanceRef.current.removeSource('route-fallback');
      }
      if (mapInstanceRef.current?.getLayer('route-label')) {
        mapInstanceRef.current.removeLayer('route-label');
      }
      if (mapInstanceRef.current?.getSource('route-label')) {
        mapInstanceRef.current.removeSource('route-label');
      }
      routeLayerRef.current = null;
      setRouteDistance(null);
      setRemainingDistance(null);
      setRouteDuration(null);
      setRemainingDuration(null);
      setRouteInstructions([]);
    }
  }, [route, isLoaded, apiKey, drawRealRoute]);

  // Add moving marker for simulation
  useEffect(() => {
    if (isSimulating && mapInstanceRef.current && pinpointCoords && isLoaded) {
      // Remove existing moving marker
      if (movingMarker) {
        movingMarker.remove();
      }

      const el = document.createElement('div');
      el.className = 'moving-marker';
      el.style.cssText = `
        width: 32px;
        height: 32px;
        background: radial-gradient(circle, #10B981 40%, #fff 41%, #10B981 42%, #fff 43%, #10B981 44%);
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5);
        position: relative;
        animation: pulse 1s infinite;
        z-index: 1004;
      `;

      // Add direction arrow
      const arrow = document.createElement('div');
      arrow.style.cssText = `
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 12px solid #10B981;
        position: absolute;
        top: -15px;
        left: 8px;
      `;
      el.appendChild(arrow);

      const marker = new tt.Marker({
        element: el,
        anchor: 'center'
      })
        .setLngLat(new tt.LngLat(pinpointCoords.lng, pinpointCoords.lat))
        .addTo(mapInstanceRef.current);

      setMovingMarker(marker);
    }

    return () => {
      if (movingMarker && !isSimulating) {
        movingMarker.remove();
        setMovingMarker(null);
      }
    };
  }, [isSimulating, pinpointCoords, isLoaded]);

  // Start voice listening
  const startVoiceListener = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  // Stop voice listening
  const stopVoiceListener = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100">
      <style jsx global>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .pickup-selection-marker {
          animation: bounce 0.6s ease-out;
        }
        
        .voice-active {
          animation: glow 1s infinite;
        }
        
        .route-card {
          animation: slideIn 0.5s ease-out;
        }
        
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .compass-rotate {
          transition: transform 0.3s ease-out;
        }
      `}</style>
      
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '500px' }}
      />
      
      {/* Moving Location Indicator */}
      {isMoving && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <span className="font-medium">📍 Location Moving</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded">LIVE</span>
          </div>
        </div>
      )}

      {/* Route Distance Indicator */}
      {remainingDistance !== null && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-4 min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-gray-800 text-sm">📍 Route Distance</h4>
              <div className={`w-2 h-2 rounded-full ${isMoving ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Remaining:</span>
                <span className="font-bold text-lg text-blue-600">
                  {remainingDistance.toFixed(1)} km
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Total:</span>
                <span className="font-medium text-gray-700">
                  {routeDistance?.toFixed(1)} km
                </span>
              </div>
              {remainingDuration !== null && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Time Left:</span>
                  <span className="font-bold text-green-600">
                    {remainingDuration} min
                  </span>
                </div>
              )}
              {isMoving && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((routeDistance! - remainingDistance) / routeDistance!) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Control Bar */}
      <div className="absolute top-0 left-0 right-0 bg-linear-to-b from-black/40 to-transparent p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/90 backdrop-blur-md rounded-lg px-4 py-2 shadow-lg">
              <h3 className="text-sm font-bold text-gray-800">🗺️ Advanced Navigation</h3>
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isLoaded ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                <span className="text-xs text-gray-700 font-medium">
                  {isLoaded ? 'Ready' : 'Loading...'}
                </span>
              </div>
            </div>
            {isPinpointSelected && (
              <div className="bg-red-100 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-xs text-red-700 font-medium">
                    Pinpoint Selected
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Minimal Style Selector */}
          <div className="flex gap-1">
            <button
              onClick={() => setMapStyle('light')}
              className={`px-3 py-2 rounded-lg font-medium text-xs transition-all ${
                mapStyle === 'light'
                  ? 'bg-white text-gray-800 shadow-lg'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}
            >
              ☀️
            </button>
            <button
              onClick={() => setMapStyle('dark')}
              className={`px-3 py-2 rounded-lg font-medium text-xs transition-all ${
                mapStyle === 'dark'
                  ? 'bg-white text-gray-800 shadow-lg'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}
            >
              🌙
            </button>
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-3 py-2 rounded-lg font-medium text-xs transition-all ${
                mapStyle === 'satellite'
                  ? 'bg-white text-gray-800 shadow-lg'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}
            >
              🛰️
            </button>
          </div>
        </div>
      </div>
      
      {/* Left Control Panel */}
      <div className="absolute top-24 left-4 flex flex-col gap-3 max-w-xs">
        {/* Quick Actions Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⚡</span>
            <h4 className="font-bold text-gray-800 text-sm">Quick Actions</h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => mapInstanceRef.current?.setZoom((mapInstanceRef.current?.getZoom() ?? 0) + 1)}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 shadow-md"
              title="Zoom In"
            >
              🔍+
            </button>
            <button
              onClick={() => mapInstanceRef.current?.setZoom((mapInstanceRef.current?.getZoom() ?? 0) - 1)}
              className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 shadow-md"
              title="Zoom Out"
            >
              🔍-
            </button>
            <button
              onClick={() => {
                if (userLocation) {
                  mapInstanceRef.current?.setCenter([userLocation.lng, userLocation.lat]);
                  mapInstanceRef.current?.setZoom(16);
                  speak('Centered on your location');
                }
              }}
              className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 shadow-md col-span-2"
              title="My Location"
            >
              📍 My Location
            </button>
            {isPinpointSelected && (
              <button
                onClick={startLocationSimulation}
                disabled={isSimulating}
                className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 shadow-md col-span-2"
                title="Start Simulation"
              >
                {isSimulating ? '▶️ Simulating...' : '🎬 Start Simulation'}
              </button>
            )}
          </div>
        </div>

        {/* Map Layers Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-gray-800 text-sm">🗺️ Map Layers</h4>
            <button
              onClick={() => setShowLayers(!showLayers)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showLayers ? '▼' : '▶'}
            </button>
          </div>

          {showLayers && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Traffic</span>
                <button
                  onClick={() => setSelectedLayer(selectedLayer === 'traffic' ? 'none' : 'traffic')}
                  className={`w-6 h-6 rounded border-2 transition-all ${
                    selectedLayer === 'traffic'
                      ? 'bg-red-500 border-red-500'
                      : 'border-gray-300 hover:border-red-400'
                  }`}
                >
                  {selectedLayer === 'traffic' && '✓'}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Satellite</span>
                <button
                  onClick={() => setMapStyle(mapStyle === 'satellite' ? 'light' : 'satellite')}
                  className={`w-6 h-6 rounded border-2 transition-all ${
                    mapStyle === 'satellite'
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {mapStyle === 'satellite' && '✓'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Compass */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-4 flex items-center justify-center">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full border-4 border-gray-300 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 shadow-inner"
              style={{ transform: `rotate(${compassDirection}deg)` }}
            >
              <div className="w-1 h-8 bg-red-500 rounded-full absolute top-1"></div>
              <div className="w-1 h-6 bg-gray-600 rounded-full absolute bottom-1 transform rotate-180"></div>
              <div className="text-xs font-bold text-gray-700">N</div>
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
              {compassDirection}°
            </div>
          </div>
        </div>
      </div>

      {/* Right Control Panel */}
      <div className="absolute top-24 right-4 flex flex-col gap-3 max-w-xs">
        {/* Voice Assistant Card */}
        <div className={`bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-4 transition-all ${isListening ? 'voice-active' : ''}`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-gray-800 text-sm">🎤 Voice Assistant</h4>
            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
          </div>
          
          {voiceText && (
            <p className="text-xs text-gray-600 mb-3 bg-blue-50 p-2 rounded border-l-2 border-blue-500">
              {voiceText}
            </p>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={startVoiceListener}
              disabled={isListening}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🎙️ Listen
            </button>
            <button
              onClick={stopVoiceListener}
              disabled={!isListening}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⏹️ Stop
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Try: "zoom in", "my location", "zoom out"</p>
        </div>

        {/* Current Location Card */}
        {userLocation && (
          <div className="bg-linear-to-br from-green-50 to-green-100 backdrop-blur-md rounded-xl shadow-xl p-4 border-l-4 border-green-500">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📍</span>
              <h4 className="font-bold text-gray-800 text-sm">Your Location</h4>
            </div>
            <div className="text-xs text-gray-700 space-y-1">
              <div className="flex justify-between">
                <span>Lat:</span>
                <span className="font-mono bg-white/50 px-2 py-1 rounded">{userLocation.lat.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span>Lng:</span>
                <span className="font-mono bg-white/50 px-2 py-1 rounded">{userLocation.lng.toFixed(6)}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  if (userLocation) {
                    mapInstanceRef.current?.setCenter([userLocation.lng, userLocation.lat]);
                    mapInstanceRef.current?.setZoom(16);
                    // Automatically set as pickup location
                    onLocationSelect(userLocation.lat, userLocation.lng);
                    speak(`Centered on your location and set as pickup`);
                  }
                }}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all"
              >
                📍 Center on Me
              </button>
              <button
                onClick={() => {
                  if (userLocation) {
                    onLocationSelect(userLocation.lat, userLocation.lng);
                    speak(`Using your location as pickup`);
                  }
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105 active:scale-95 shadow-md"
              >
                🚗 Use as Pickup
              </button>
            </div>
          </div>
        )}

        {/* Route Info Card */}
        {route && (routeDistance || routeDuration) && (
          <div className="route-card bg-linear-to-br from-blue-50 to-blue-100 backdrop-blur-md rounded-xl shadow-xl p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-gray-800 text-sm">📍 Route Details</h4>
              <div className={`w-3 h-3 rounded-full ${route.hasTraffic ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
            </div>
            
            {/* Route Alternatives */}
            {routeAlternatives.length > 1 && (
              <div className="mb-3 p-2 bg-white/60 rounded-lg">
                <div className="text-xs text-gray-600 font-bold mb-2">Route Options:</div>
                <div className="flex gap-1">
                  {routeAlternatives.map((alt, index) => {
                    const altDistance = alt.legs[0].summary.lengthInMeters / 1000;
                    const altDuration = Math.ceil(alt.legs[0].summary.travelTimeInSeconds / 60);
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedRouteIndex(index);
                          // Re-draw route with selected alternative
                          setTimeout(() => drawRealRoute(), 100);
                        }}
                        className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                          selectedRouteIndex === index
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/80 text-gray-700 hover:bg-white'
                        }`}
                      >
                        {index === 0 ? '🚀 Fastest' : index === 1 ? '⚖️ Balanced' : '🛣️ Alternative'}<br />
                        {altDistance.toFixed(1)}km • {altDuration}min
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/80 p-2 rounded-lg">
                  <div className="text-xs text-gray-500">Distance</div>
                  <div className="font-bold text-blue-600">{routeDistance?.toFixed(2)} km</div>
                </div>
                <div className="bg-white/80 p-2 rounded-lg">
                  <div className="text-xs text-gray-500">Duration</div>
                  <div className="font-bold text-green-600">{routeDuration} min</div>
                </div>
              </div>
              
              {remainingDistance !== null && (
                <div className="bg-white/80 p-2 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Remaining</div>
                  <div className="font-bold text-orange-600 text-lg">
                    {remainingDistance.toFixed(1)} km
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${routeDistance ? Math.max(0, ((routeDistance - remainingDistance) / routeDistance) * 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="bg-white/80 p-2 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Status</div>
                <div className={`text-sm font-medium ${route.hasTraffic ? 'text-red-600' : 'text-green-600'}`}>
                  {route.hasTraffic ? '🚦 Heavy Traffic' : '✅ Clear Roads'}
                </div>
              </div>
              
              {routeInstructions.length > 0 && (
                <div className="bg-white/80 p-2 rounded-lg max-h-24 overflow-y-auto">
                  <div className="text-xs text-gray-500 font-bold mb-1">📋 Directions</div>
                  <div className="space-y-1">
                    {routeInstructions.slice(0, 2).map((inst, idx) => (
                      <div key={idx} className="text-xs text-gray-700 flex items-start gap-1">
                        <span>•</span>
                        <span>{inst.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Nearby POIs */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-gray-800 text-sm">🏪 Nearby</h4>
            <button className="text-gray-500 hover:text-gray-700 transition-colors text-xs">
              🔍 Search
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer">
              <span>⛽</span>
              <div>
                <div className="font-medium">Gas Station</div>
                <div className="text-gray-500">2.3 km • Shell</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer">
              <span>🏥</span>
              <div>
                <div className="font-medium">Hospital</div>
                <div className="text-gray-500">4.1 km • City General</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer">
              <span>🍽️</span>
              <div>
                <div className="font-medium">Restaurant</div>
                <div className="text-gray-500">1.8 km • Italian Cuisine</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-3 shadow-lg">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-800">
                {isPinpointSelected ? 'Click map to select new pinpoint location' : 'Click map to select pinpoint location'}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {/* Route Info Button */}
            {route && routeDistance && routeDuration && (
              <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-blue-600">{routeDistance.toFixed(1)} km</span>
                  {remainingDistance !== null && (
                    <>
                      <span className="text-xs text-gray-600">→</span>
                      <span className="text-sm font-bold text-orange-600">{remainingDistance.toFixed(1)} km</span>
                    </>
                  )}
                  <span className="text-xs text-gray-600">•</span>
                  <span className="text-sm font-bold text-green-600">{routeDuration} min</span>
                  {route?.hasTraffic && (
                    <span className="text-xs text-red-500 animate-pulse">🚦</span>
                  )}
                  {isMoving && (
                    <span className="text-xs text-green-500 animate-pulse">▶️</span>
                  )}
                </div>
              </div>
            )}

            {/* Fullscreen Toggle */}
            <button
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen?.();
                  setIsFullscreen(true);
                } else {
                  document.exitFullscreen?.();
                  setIsFullscreen(false);
                }
              }}
              className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? '🗗' : '🗖'}
            </button>

            {/* Location Button */}
            {userLocation && (
              <button
                onClick={() => {
                  if (userLocation) {
                    mapInstanceRef.current?.setCenter([userLocation.lng, userLocation.lat]);
                    mapInstanceRef.current?.setZoom(15);
                    speak('Centered on your location');
                  }
                }}
                className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-full font-medium shadow-lg transition-all hover:shadow-xl"
                title="Center on current position"
              >
                📍 My Location
              </button>
            )}
            
            {/* Simulate Button */}
            {isPinpointSelected && route && (
              <button
                onClick={isSimulating ? stopLocationSimulation : startLocationSimulation}
                className={`px-4 py-3 rounded-full font-medium shadow-lg transition-all ${
                  isSimulating
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white'
                }`}
                title={isSimulating ? "Stop Simulation" : "Start Simulation"}
              >
                {isSimulating ? '⏹️ Stop Sim' : '▶️ Simulate'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {!isLoaded && !mapError && (
        <div className="absolute inset-0 bg-linear-to-br from-blue-900/90 to-purple-900/90 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="text-center max-w-md px-8">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-white border-t-transparent mx-auto"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-400 border-t-transparent animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <h3 className="text-white text-3xl font-bold mb-3">🗺️ Advanced Navigation</h3>
            <p className="text-gray-200 text-sm mb-6">Initializing TomTom Maps with AI-powered navigation...</p>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3 text-white/80 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Loading road networks</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/80 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <span>Setting up voice assistant</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/80 text-sm">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span>Preparing routing engine</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/80 text-sm">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                <span>Calibrating GPS accuracy</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {mapError && (
        <div className="absolute inset-0 bg-linear-to-br from-red-900/90 to-orange-900/90 backdrop-blur-md flex items-center justify-center">
          <div className="text-center max-w-md px-8">
            <div className="text-red-400 text-7xl mb-6">⚠️</div>
            <h3 className="text-white text-2xl font-bold mb-3">Map Error</h3>
            <p className="text-red-200 text-sm mb-6">{mapError}</p>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white text-sm mb-3">Please verify:</p>
              <ul className="text-white/80 text-xs text-left space-y-2">
                <li>✓ Valid TomTom API key configured</li>
                <li>✓ Stable internet connection</li>
                <li>✓ Correct map container size</li>
                <li>✓ Browser supports Web GL</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Routing Loading Indicator */}
      {isRouting && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-gray-800 font-bold text-lg mb-2">🛣️ Calculating Route</p>
            <p className="text-gray-600 text-sm mb-4">Finding optimal roads with live traffic...</p>
            <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-linear-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}