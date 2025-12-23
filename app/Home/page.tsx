'use client';

import { useState, useEffect, useRef, useCallback, ComponentType } from 'react';
import dynamic from 'next/dynamic';
import { 
  calculateDistance, 
  calculateRent, 
  geocodeAddress,
  getCurrencySymbolById,
  getCurrencyById,
  searchLocationSuggestions,
  fetchDomainPricing,
  debounce,
  currencies,
  getCountryCodeFromIP
} from '@/lib/db.utils';

const TomTomMap = dynamic(
  () => import('../components/TomTomMap') as Promise<{ default: ComponentType<any> }>,
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

interface Coordinates {
  lat: number;
  lng: number;
}

interface FormData {
  pickup: string;
  dropoff: string;
  unit: 'km' | 'mile';
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    country_code?: string;
  };
}

interface DomainData {
  domain?: {
    domainName: string;
    status: string;
    expiryDate: string;
  };
  location?: {
    coordinates: Coordinates;
    city: string;
    country: string;
    country_code: string;
  };
  pricing?: {
    rentPerKm: number;
    rentPerMile: number;
    currency: number;
    conversionRate: number;
  };
  isDefault?: boolean;
}

// Country-specific default coordinates
const COUNTRY_DEFAULTS: Record<string, { lat: number; lng: number; zoom: number }> = {
  'PK': { lat: 30.3753, lng: 69.3451, zoom: 6 }, // Pakistan
  'IN': { lat: 20.5937, lng: 78.9629, zoom: 5 }, // India
  'US': { lat: 37.0902, lng: -95.7129, zoom: 4 }, // USA
  'GB': { lat: 55.3781, lng: -3.4360, zoom: 6 }, // UK
  'CA': { lat: 56.1304, lng: -106.3468, zoom: 4 }, // Canada
  'AU': { lat: -25.2744, lng: 133.7751, zoom: 4 }, // Australia
  'CN': { lat: 35.8617, lng: 104.1954, zoom: 4 }, // China
  'BR': { lat: -14.2350, lng: -51.9253, zoom: 4 }, // Brazil
  'RU': { lat: 61.5240, lng: 105.3188, zoom: 3 }, // Russia
  'ZA': { lat: -30.5595, lng: 22.9375, zoom: 5 }, // South Africa
  'NG': { lat: 9.0820, lng: 8.6753, zoom: 6 }, // Nigeria
  'EG': { lat: 26.8206, lng: 30.8025, zoom: 6 }, // Egypt
  'SA': { lat: 23.8859, lng: 45.0792, zoom: 5 }, // Saudi Arabia
  'AE': { lat: 23.4241, lng: 53.8478, zoom: 7 }, // UAE
  'TR': { lat: 38.9637, lng: 35.2433, zoom: 6 }, // Turkey
  'FR': { lat: 46.6034, lng: 1.8883, zoom: 6 }, // France
  'DE': { lat: 51.1657, lng: 10.4515, zoom: 6 }, // Germany
  'JP': { lat: 36.2048, lng: 138.2529, zoom: 6 }, // Japan
  'KR': { lat: 35.9078, lng: 127.7669, zoom: 7 }, // South Korea
  'MX': { lat: 23.6345, lng: -102.5528, zoom: 5 }, // Mexico
  'AR': { lat: -38.4161, lng: -63.6167, zoom: 4 }, // Argentina
  'ID': { lat: -0.7893, lng: 113.9213, zoom: 5 }, // Indonesia
  'BD': { lat: 23.6850, lng: 90.3563, zoom: 7 }, // Bangladesh
  'LK': { lat: 7.8731, lng: 80.7718, zoom: 7 }, // Sri Lanka
  'NP': { lat: 28.3949, lng: 84.1240, zoom: 7 }, // Nepal
  'default': { lat: 31.5656822, lng: 74.3141829, zoom: 6 } // Default fallback
};

// Helper function to clean domain
const cleanDomain = (domain: string): string => {
  if (!domain) return '';
  let cleaned = domain.trim().toLowerCase();
  cleaned = cleaned.replace(/^https?:\/\//i, '');
  cleaned = cleaned.replace(/^www\./i, '');
  cleaned = cleaned.replace(/\/$/, '');
  cleaned = cleaned.split(':')[0];
  return cleaned;
};

export default function RentCalculatorPage() {
  const [formData, setFormData] = useState<FormData>({
    pickup: '',
    dropoff: '',
    unit: 'km'
  });
  
  const [pickupCoords, setPickupCoords] = useState<Coordinates | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<Coordinates | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [rent, setRent] = useState<number | null>(null);
  const [domainData, setDomainData] = useState<DomainData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasTraffic, setHasTraffic] = useState<boolean>(false);
  
  // New states for suggestions
  const [pickupSuggestions, setPickupSuggestions] = useState<LocationSuggestion[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<LocationSuggestion[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);
  const [mapMarkers, setMapMarkers] = useState<Array<{ position: { lat: number; lng: number }; title: string; color: string; icon?: string }>>([]);
  const [mapRoute, setMapRoute] = useState<{ 
    start: { lat: number; lng: number }; 
    end: { lat: number; lng: number };
    waypoints?: Coordinates[];
    hasTraffic?: boolean;
  } | null>(null);
  const [mapCenter, setMapCenter] = useState<Coordinates>({ lat: 31.5656822, lng: 74.3141829 });
  const [mapZoom, setMapZoom] = useState<number>(6);
  const [userCountry, setUserCountry] = useState<string>('PK');
  const [routeInstructions, setRouteInstructions] = useState<Array<{
    instruction: string;
    distance: number;
  }>>([]);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropoffInputRef = useRef<HTMLInputElement>(null);

  // Get current domain
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  
  // Detect user country on mount
  useEffect(() => {
    const detectUserCountry = async () => {
      try {
        // Try to get country from IP
        const countryCode = await getCountryCodeFromIP();
        if (countryCode) {
          setUserCountry(countryCode.toUpperCase());
          const countryDefault = COUNTRY_DEFAULTS[countryCode.toUpperCase()] || COUNTRY_DEFAULTS['default'];
          setMapCenter(countryDefault);
          setMapZoom(countryDefault.zoom);
        }
      } catch (error) {
        console.error('Failed to detect country:', error);
        // Fallback to default country based on browser language or IP
        const fallbackCountry = getFallbackCountry();
        const countryDefault = COUNTRY_DEFAULTS[fallbackCountry] || COUNTRY_DEFAULTS['default'];
        setMapCenter(countryDefault);
        setMapZoom(countryDefault.zoom);
        setUserCountry(fallbackCountry);
      }
    };

    detectUserCountry();
  }, []);

  // Helper to get fallback country
  const getFallbackCountry = () => {
    if (typeof navigator !== 'undefined') {
      const language = navigator.language || 'en-US';
      if (language.includes('ur') || language.includes('PK')) return 'PK';
      if (language.includes('en-IN') || language.includes('hi')) return 'IN';
      if (language.includes('en-US') || language.includes('en-CA')) return 'US';
      if (language.includes('en-GB')) return 'GB';
    }
    return 'PK'; // Default to Pakistan
  };

  // Debug current domain
  useEffect(() => {
    console.log('🌐 Current domain detected:', currentDomain);
    console.log('🔧 Cleaned domain:', cleanDomain(currentDomain));
  }, [currentDomain]);

  // Load domain data on component mount
  useEffect(() => {
    async function loadDomainData() {
      setIsLoading(true);
      try {
        // Clean the current domain for comparison
        const cleanedCurrentDomain = cleanDomain(currentDomain);
        console.log('🚀 Fetching domain pricing for:', cleanedCurrentDomain);
        
        const data = await fetchDomainPricing(cleanedCurrentDomain);
        console.log('📦 Domain data response:', data);
        
        if (data) {
          setDomainData(data);
          console.log('✅ Domain pricing loaded successfully');
          console.log('💵 Using pricing:', data.pricing);
          console.log('📍 Using location:', data.location);
          
          if (data.location?.coordinates) {
            setMapCenter(data.location.coordinates);
            setMapZoom(13);
          } else if (data.location?.country_code) {
            const countryCode = data.location.country_code.toUpperCase();
            const countryDefault = COUNTRY_DEFAULTS[countryCode] || COUNTRY_DEFAULTS['default'];
            setMapCenter(countryDefault);
            setMapZoom(countryDefault.zoom);
            setUserCountry(countryCode);
          }
        } else {
          console.log('❌ No domain data received');
        }
      } catch (err) {
        console.error('💥 Error loading domain data:', err);
        setError('Failed to load domain pricing information');
        // Use user's country default
        const countryDefault = COUNTRY_DEFAULTS[userCountry] || COUNTRY_DEFAULTS['default'];
        setMapCenter(countryDefault);
        setMapZoom(countryDefault.zoom);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDomainData();
  }, [currentDomain, userCountry]);

  // Automatically draw route when both locations are selected
  useEffect(() => {
    if (pickupCoords && dropoffCoords) {
      console.log('📍 Both locations selected, drawing route...');
      console.log('📍 Pickup coords:', pickupCoords);
      console.log('📍 Dropoff coords:', dropoffCoords);
      // Clear previous route instructions
      setRouteInstructions([]);
      drawRouteLine();
    } else {
      // Clear route when locations are not both set
      console.log('🗑️ Clearing route - missing coordinates');
      setMapRoute(null);
      setRouteInstructions([]);
    }
  }, [pickupCoords, dropoffCoords]);

  // Enhanced debounced search with country filtering
  const debouncedSearch = useCallback(
    debounce(async (query: string, type: 'pickup' | 'dropoff') => {
      if (query.length < 2) {
        if (type === 'pickup') setPickupSuggestions([]);
        else setDropoffSuggestions([]);
        return;
      }

      setFetchingSuggestions(true);
      try {
        // Pass country code to get location-specific suggestions
        const countryFilter = domainData?.location?.country_code || userCountry;
        const suggestions = await searchLocationSuggestions(query, countryFilter);
        
        // Filter suggestions by country if available
        const filteredSuggestions = suggestions.filter((suggestion: any) => {
          // If we have country code in suggestion, filter by it
          if (suggestion.address?.country_code) {
            return suggestion.address.country_code.toLowerCase() === countryFilter.toLowerCase();
          }
          return true;
        });
        
        if (type === 'pickup') {
          setPickupSuggestions(filteredSuggestions);
        } else {
          setDropoffSuggestions(filteredSuggestions);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setFetchingSuggestions(false);
      }
    }, 300),
    [domainData?.location?.country_code, userCountry]
  );

  // Handle input change
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear coordinates when input changes
    if (name === 'pickup') {
      setPickupCoords(null);
      setShowPickupSuggestions(true);
      debouncedSearch(value, 'pickup');
    } else if (name === 'dropoff') {
      setDropoffCoords(null);
      setShowDropoffSuggestions(true);
      debouncedSearch(value, 'dropoff');
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: LocationSuggestion, type: 'pickup' | 'dropoff') => {
    const coords = {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon)
    };

    if (type === 'pickup') {
      setFormData(prev => ({ ...prev, pickup: suggestion.display_name }));
      setPickupCoords(coords);
      setPickupSuggestions([]);
      setShowPickupSuggestions(false);
      addMarker(coords.lat, coords.lng, 'Pickup', '#3B82F6', '📍');
    } else {
      setFormData(prev => ({ ...prev, dropoff: suggestion.display_name }));
      setDropoffCoords(coords);
      setDropoffSuggestions([]);
      setShowDropoffSuggestions(false);
      addMarker(coords.lat, coords.lng, 'Dropoff', '#EF4444', '🏁');
    }
  };

  // Add marker to map
  const addMarker = (lat: number, lng: number, title: string, color: string, icon?: string) => {
    setMapMarkers(prev => {
      // Remove existing marker of the same type
      const filtered = prev.filter(marker => marker.title !== title);
      // Add new marker
      return [...filtered, { position: { lat, lng }, title, color, icon }];
    });
  };

  // Draw route line between pickup and dropoff with waypoints
 // Enhanced drawRouteLine function
const drawRouteLine = async () => {
  if (!pickupCoords || !dropoffCoords) return;
  
  try {
    console.log('🛣️ Fetching REAL road route from TomTom API...');
    console.log('📍 Start:', pickupCoords);
    console.log('🏁 End:', dropoffCoords);

    // Check if API key exists
    const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY || "YxbLh0enMQBXkiLMbuUc78T2ZLTaW6b6";
    if (!apiKey || apiKey === "YOUR_TOMTOM_API_KEY") {
      throw new Error('TomTom API key is missing or invalid');
    }

    // Fetch route from TomTom Routing API for REAL ROADS
    const response = await fetch(
      `https://api.tomtom.com/routing/1/calculateRoute/${pickupCoords.lat},${pickupCoords.lng}:${dropoffCoords.lat},${dropoffCoords.lng}/json?key=${apiKey}&routeType=fastest&traffic=true&travelMode=car&routeRepresentation=polyline&computeBestOrder=false&instructionsType=tagged&language=en-US&vehicleMaxSpeed=120&vehicleWeight=2000&departAt=now`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Route API error:', response.status, errorText);
      throw new Error(`Route API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('📊 Road Route API response received:', data);

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const legs = route.legs[0];
      
      // Extract waypoints for detailed ROAD route
      let waypoints: Coordinates[] = [];
      
      if (legs.points && legs.points.length > 0) {
        waypoints = legs.points.map((point: any) => ({
          lat: point.latitude,
          lng: point.longitude
        }));
        console.log(`✅ Got ${waypoints.length} ROAD route points from API`);
      } else if (route.geometry && route.geometry.coordinates) {
        // Alternative: use geometry coordinates
        waypoints = route.geometry.coordinates.map((coord: [number, number]) => ({
          lat: coord[1],
          lng: coord[0]
        }));
        console.log(`✅ Got ${waypoints.length} coordinates from geometry`);
      }

      // Extract route instructions for turn-by-turn
      const instructions = [];
      if (route.guidance && route.guidance.instructions) {
        for (const inst of route.guidance.instructions) {
          if (instructions.length < 10) { // Limit to 10 instructions
            instructions.push({
              instruction: inst.message,
              distance: inst.routeOffsetInMeters
            });
          }
        }
      }
      setRouteInstructions(instructions);
      console.log(`📋 Extracted ${instructions.length} turn-by-turn instructions`);

      // Check for traffic delays
      const hasTraffic = legs.summary?.trafficDelayInSeconds > 0;
      setHasTraffic(hasTraffic);
      
      if (hasTraffic) {
        const delayMinutes = Math.ceil(legs.summary.trafficDelayInSeconds / 60);
        console.log(`⚠️ Traffic delay detected: ${delayMinutes} minutes`);
      }

      // Calculate accurate distance from ROAD route
      const routeDistanceKm = legs.summary?.lengthInMeters / 1000;
      const displayDistance = formData.unit === 'km' 
        ? routeDistanceKm 
        : routeDistanceKm * 0.621371; // Convert to miles
        
      setDistance(displayDistance);
      console.log(`📏 Accurate ROAD route distance: ${displayDistance.toFixed(2)} ${formData.unit}`);

      // Update map route with detailed ROAD waypoints
      setMapRoute({
        start: pickupCoords,
        end: dropoffCoords,
        waypoints: waypoints,
        hasTraffic: hasTraffic
      });

      console.log('✅ ROAD route data sent to map component');

      // Recalculate rent with accurate ROAD distance
      const pricing = domainData?.pricing || { 
        rentPerKm: 1, 
        rentPerMile: 1.6, 
        currency: 0, 
        conversionRate: 1 
      };
      
      const trafficMultiplier = hasTraffic ? 1.02 : 1.0;
      const baseRent = calculateRent(displayDistance, pricing, formData.unit);
      const calculatedRent = baseRent * trafficMultiplier;
      setRent(calculatedRent);
      
      console.log('💰 Rent recalculated based on ROAD distance:', {
        distance: displayDistance,
        unit: formData.unit,
        baseRent: baseRent,
        trafficMultiplier: trafficMultiplier,
        finalRent: calculatedRent
      });

    } else {
      console.warn('⚠️ No road routes found in API response');
      throw new Error('No road route found between locations');
    }

  } catch (error) {
    console.error('❌ Error fetching road route:', error);
    
    // Show error but don't draw straight line
    setError('Could not calculate road route. Please check locations and try again.');
    setTimeout(() => setError(null), 5000);
    
    // Clear any existing route
    setMapRoute(null);
  }
};
  // Calculate bounds for zoom level
  const calculateBounds = (start: Coordinates, end: Coordinates) => {
    return {
      minLat: Math.min(start.lat, end.lat),
      maxLat: Math.max(start.lat, end.lat),
      minLng: Math.min(start.lng, end.lng),
      maxLng: Math.max(start.lng, end.lng)
    };
  };

  // Calculate zoom level based on bounds
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

  // Handle geocode button click
  const handleGeocode = async (type: 'pickup' | 'dropoff') => {
    const address = type === 'pickup' ? formData.pickup : formData.dropoff;
    if (!address.trim()) {
      setError(`Please enter ${type} address`);
      return;
    }
    
    setIsGeocoding(true);
    setError(null);
    
    try {
      // Pass country code for better geocoding results
      const countryFilter = domainData?.location?.country_code || userCountry;
      const result = await geocodeAddress(address, countryFilter);
      if (result) {
        const coords = { lat: result.lat, lng: result.lng };
        if (type === 'pickup') {
          setPickupCoords(coords);
          addMarker(coords.lat, coords.lng, 'Pickup', '#3B82F6', '📍');
        } else {
          setDropoffCoords(coords);
          addMarker(coords.lat, coords.lng, 'Dropoff', '#EF4444', '🏁');
        }
        setFormData(prev => ({
          ...prev,
          [type]: result.address
        }));
      } else {
        setError(`Could not find location for ${type} address`);
      }
    } catch (err) {
      setError('Geocoding service error. Please try again.');
    } finally {
      setIsGeocoding(false);
    }
  };

  // Check for traffic incidents on the route
  const checkTrafficIncidents = async (start: Coordinates, end: Coordinates): Promise<boolean> => {
    try {
      // Create a bounding box around the route
      const minLng = Math.min(start.lng, end.lng) - 0.1;
      const maxLng = Math.max(start.lng, end.lng) + 0.1;
      const minLat = Math.min(start.lat, end.lat) - 0.1;
      const maxLat = Math.max(start.lat, end.lat) + 0.1;
      const bbox = `${minLng},${minLat},${maxLng},${maxLat}`;

      const response = await fetch(
        `https://api.tomtom.com/traffic/services/5/incidentDetails?key=YxbLh0enMQBXkiLMbuUc78T2ZLTaW6b6&bbox=${bbox}&fields={incidents{type,geometry{type,coordinates}}}&language=en-GB`
      );

      if (!response.ok) {
        console.error('Traffic API error:', response.status);
        return false;
      }

      const data = await response.json();
      console.log('Traffic incidents:', data);

      // Check if there are any incidents
      return data.incidents && data.incidents.length > 0;
    } catch (error) {
      console.error('Error checking traffic:', error);
      return false;
    }
  };

  // Calculate rent
  const calculateRentHandler = async () => {
    if (!pickupCoords || !dropoffCoords) {
      setError('Please select both pickup and dropoff locations');
      return;
    }

    // First draw the route to get accurate distance
    await drawRouteLine();
    
    const calculatedDistance = calculateDistance(
      pickupCoords.lat,
      pickupCoords.lng,
      dropoffCoords.lat,
      dropoffCoords.lng,
      formData.unit
    );
    
    setDistance(calculatedDistance);
    setError(null);

    // Check for traffic incidents on the route
    const hasTrafficIncidents = await checkTrafficIncidents(pickupCoords, dropoffCoords);
    const trafficMultiplier = hasTrafficIncidents ? 1.02 : 1.0; // 2% increase if traffic

    // Calculate rent based on domain pricing or default
    const pricing = domainData?.pricing || { 
      rentPerKm: 1, 
      rentPerMile: 1.6, 
      currency: 0, 
      conversionRate: 1 
    };
    
    console.log('🧮 Calculating rent with:', {
      distance: calculatedDistance,
      unit: formData.unit,
      pricing: pricing,
      rentPerKm: pricing.rentPerKm,
      rentPerMile: pricing.rentPerMile,
      hasTraffic: hasTrafficIncidents,
      trafficMultiplier
    });
    
    const baseRent = calculateRent(calculatedDistance, pricing, formData.unit);
    const calculatedRent = baseRent * trafficMultiplier;
    setRent(calculatedRent);
    setHasTraffic(hasTrafficIncidents);
  };

  // Handle unit change
  const handleUnitChange = async (unit: 'km' | 'mile') => {
    setFormData(prev => ({
      ...prev,
      unit
    }));
    
    // Recalculate rent if distance exists
    if (distance && domainData?.pricing && pickupCoords && dropoffCoords) {
      const hasTrafficIncidents = await checkTrafficIncidents(pickupCoords, dropoffCoords);
      const trafficMultiplier = hasTrafficIncidents ? 1.02 : 1.0;
      
      const newRent = calculateRent(distance, domainData.pricing, unit) * trafficMultiplier;
      setRent(newRent);
      setHasTraffic(hasTrafficIncidents);
      
      // Update route line with new distance
      const newDistance = calculateDistance(
        pickupCoords.lat,
        pickupCoords.lng,
        dropoffCoords.lat,
        dropoffCoords.lng,
        unit
      );
      setDistance(newDistance);
      drawRouteLine();
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      pickup: '',
      dropoff: '',
      unit: 'km'
    });
    setPickupCoords(null);
    setDropoffCoords(null);
    setDistance(null);
    setRent(null);
    setError(null);
    setPickupSuggestions([]);
    setDropoffSuggestions([]);
    setMapMarkers([]);
    setMapRoute(null);
    setHasTraffic(false);
    setRouteInstructions([]);
    
    // Reset to country default view
    const countryDefault = COUNTRY_DEFAULTS[userCountry] || COUNTRY_DEFAULTS['default'];
    setMapCenter(countryDefault);
    setMapZoom(countryDefault.zoom);
  };

  // Get current currency info
  const getCurrentCurrency = () => {
    const currencyId = domainData?.pricing?.currency ?? 0;
    return getCurrencyById(currencyId);
  };

  // Get current country name
  const getCurrentCountryName = () => {
    const countryCodes: Record<string, string> = {
      'PK': 'Pakistan',
      'IN': 'India',
      'US': 'United States',
      'GB': 'United Kingdom',
      'CA': 'Canada',
      'AU': 'Australia',
      'CN': 'China',
      'BR': 'Brazil',
      'RU': 'Russia',
      'ZA': 'South Africa',
      'NG': 'Nigeria',
      'EG': 'Egypt',
      'SA': 'Saudi Arabia',
      'AE': 'United Arab Emirates',
      'TR': 'Turkey',
      'FR': 'France',
      'DE': 'Germany',
      'JP': 'Japan',
      'KR': 'South Korea',
      'MX': 'Mexico',
      'AR': 'Argentina',
      'ID': 'Indonesia',
      'BD': 'Bangladesh',
      'LK': 'Sri Lanka',
      'NP': 'Nepal'
    };
    return countryCodes[userCountry] || userCountry;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Rent Calculator
              </h1>
              <button>
                login
              </button>
              <p className="text-gray-600">
                Calculate transportation costs based on {currentDomain} pricing
              </p>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg mb-2">
                <span className="font-medium">Map View:</span> {getCurrentCountryName()}
              </div>
              
              {domainData?.domain ? (
                <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                  <span className="font-medium">Active Domain:</span> {domainData.domain.domainName}
                  <div className="text-sm mt-1">
                    Using: {getCurrencySymbolById(domainData.pricing?.currency || 0)}
                    {domainData.pricing?.rentPerKm}/km • 
                    {getCurrencySymbolById(domainData.pricing?.currency || 0)}
                    {domainData.pricing?.rentPerMile}/mile
                  </div>
                </div>
              ) : domainData?.isDefault ? (
                <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
                  <span className="font-medium">Using Default Pricing</span>
                  <div className="text-sm mt-1">$1/km • $1.6/mile</div>
                </div>
              ) : null}
            </div>
          </div>
          
          {/* Debug info */}
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm">
            <div className="font-medium text-gray-700">Debug Information:</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
              <div>Current Domain: <span className="font-mono">{currentDomain}</span></div>
              <div>User Country: <span className="font-medium">{userCountry} ({getCurrentCountryName()})</span></div>
              <div>Domain Status: <span className={`font-medium ${domainData?.domain ? 'text-green-600' : 'text-yellow-600'}`}>
                {domainData?.domain ? 'FOUND' : 'DEFAULT'}
              </span></div>
              <div>Traffic Detected: <span className={`font-medium ${hasTraffic ? 'text-red-600' : 'text-green-600'}`}>
                {hasTraffic ? 'YES (+2%)' : 'NO'}
              </span></div>
              {domainData?.pricing && (
                <>
                  <div>Rate per KM: <span className="font-mono">{getCurrencySymbolById(domainData.pricing.currency)}{domainData.pricing.rentPerKm}</span></div>
                  <div>Rate per Mile: <span className="font-mono">{getCurrencySymbolById(domainData.pricing.currency)}{domainData.pricing.rentPerMile}</span></div>
                </>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              🔄 Refresh Page
            </button>
            <button
              onClick={async () => {
                const cleanedDomain = cleanDomain(currentDomain);
                console.log('🔄 Manually fetching domain data for:', cleanedDomain);
                setIsLoading(true);
                try {
                  const data = await fetchDomainPricing(cleanedDomain);
                  setDomainData(data);
                  console.log('📦 Manual fetch result:', data);
                  if (data?.domain) {
                    console.log('✅ Domain found:', data.domain.domainName);
                    console.log('💰 Pricing:', data.pricing);
                  } else {
                    console.log('❌ No domain found, using defaults');
                  }
                } catch (err) {
                  console.error('💥 Manual fetch error:', err);
                  setError('Failed to fetch domain data');
                } finally {
                  setIsLoading(false);
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
            >
              🧪 Test API Call
            </button>
            <button
              onClick={() => {
                console.log('📊 Current domain data:', domainData);
                console.log('💵 Current pricing:', domainData?.pricing);
                console.log('🌍 Current location:', domainData?.location);
                console.log('🚦 Traffic status:', hasTraffic);
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
            >
              📊 Log State
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Calculate Rent</h2>
              
              {/* Pickup Location */}
              <div className="space-y-2 relative">
                <label className="block text-sm font-medium text-gray-700">
                  Pickup Location
                </label>
                <div className="relative">
                  <input
                    ref={pickupInputRef}
                    type="text"
                    name="pickup"
                    value={formData.pickup}
                    onChange={handleInputChange}
                    onFocus={() => setShowPickupSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
                    placeholder={`Enter address in ${getCurrentCountryName()}...`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-black placeholder-gray-500"
                  />
                  <button
                    onClick={() => handleGeocode('pickup')}
                    disabled={isGeocoding || !formData.pickup.trim()}
                    className="absolute right-2 top-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isGeocoding ? '...' : '📍'}
                  </button>
                  
                  {/* Suggestions dropdown */}
                  {showPickupSuggestions && (pickupSuggestions.length > 0 || fetchingSuggestions) && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {fetchingSuggestions ? (
                        <div className="px-4 py-3 text-center text-gray-500">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto"></div>
                          <p className="mt-1 text-sm">Searching in {getCurrentCountryName()}...</p>
                        </div>
                      ) : pickupSuggestions.length === 0 ? (
                        <div className="px-4 py-3 text-center text-gray-500">
                          No locations found in {getCurrentCountryName()}
                        </div>
                      ) : (
                        pickupSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSuggestionSelect(suggestion, 'pickup');
                            }}
                          >
                            <div className="font-medium text-black flex items-center gap-2">
                              <span>📍</span>
                              {suggestion.display_name.split(',')[0]}
                            </div>
                            <div className="text-sm text-gray-600 truncate pl-6">
                              {suggestion.display_name}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Dropoff Location */}
              <div className="space-y-2 relative">
                <label className="block text-sm font-medium text-gray-700">
                  Dropoff Location
                </label>
                <div className="relative">
                  <input
                    ref={dropoffInputRef}
                    type="text"
                    name="dropoff"
                    value={formData.dropoff}
                    onChange={handleInputChange}
                    onFocus={() => setShowDropoffSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowDropoffSuggestions(false), 200)}
                    placeholder={`Enter address in ${getCurrentCountryName()}...`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-black placeholder-gray-500"
                  />
                  <button
                    onClick={() => handleGeocode('dropoff')}
                    disabled={isGeocoding || !formData.dropoff.trim()}
                    className="absolute right-2 top-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isGeocoding ? '...' : '🏁'}
                  </button>
                  
                  {/* Suggestions dropdown */}
                  {showDropoffSuggestions && (dropoffSuggestions.length > 0 || fetchingSuggestions) && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {fetchingSuggestions ? (
                        <div className="px-4 py-3 text-center text-gray-500">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto"></div>
                          <p className="mt-1 text-sm">Searching in {getCurrentCountryName()}...</p>
                        </div>
                      ) : dropoffSuggestions.length === 0 ? (
                        <div className="px-4 py-3 text-center text-gray-500">
                          No locations found in {getCurrentCountryName()}
                        </div>
                      ) : (
                        dropoffSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSuggestionSelect(suggestion, 'dropoff');
                            }}
                          >
                            <div className="font-medium text-black flex items-center gap-2">
                              <span>🏁</span>
                              {suggestion.display_name.split(',')[0]}
                            </div>
                            <div className="text-sm text-gray-600 truncate pl-6">
                              {suggestion.display_name}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Unit Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Distance Unit
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUnitChange('km')}
                    className={`flex-1 py-3 rounded-lg transition ${
                      formData.unit === 'km'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Kilometers (KM)
                  </button>
                  <button
                    onClick={() => handleUnitChange('mile')}
                    className={`flex-1 py-3 rounded-lg transition ${
                      formData.unit === 'mile'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Miles
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={calculateRentHandler}
                  disabled={isLoading || !pickupCoords || !dropoffCoords}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Calculating...
                    </>
                  ) : (
                    '🚗 Calculate Rent'
                  )}
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                >
                  🔄 Reset
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Results */}
            {(distance !== null || rent !== null) && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Rent Calculation</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Distance</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {distance?.toFixed(2)} {formData.unit}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Estimated Rent</p>
                    <p className="text-3xl font-bold text-green-600">
                      {getCurrencySymbolById(domainData?.pricing?.currency ?? 0)}{rent?.toFixed(2)}
                      {hasTraffic && (
                        <span className="text-sm text-red-600 ml-2">(+2% traffic)</span>
                      )}
                    </p>
                  </div>
                </div>
                
                {hasTraffic && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-600">⚠️</span>
                      <p className="text-yellow-700 text-sm">
                        Traffic detected on route! Additional 2% added to rent for delays.
                      </p>
                    </div>
                  </div>
                )}
                
                {domainData?.pricing && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-3">Pricing Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Rate per Kilometer</p>
                        <p className="font-semibold text-black">
                          {getCurrencySymbolById(domainData.pricing.currency)}{domainData.pricing.rentPerKm.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Rate per Mile</p>
                        <p className="font-semibold text-black">
                          {getCurrencySymbolById(domainData.pricing.currency)}{domainData.pricing.rentPerMile.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 text-sm">
                      <p className="text-gray-600">Currency</p>
                      <p className="font-medium text-black">
                        {getCurrentCurrency().name} ({getCurrentCurrency().code})
                      </p>
                    </div>
                    {domainData.pricing.conversionRate !== 1 && (
                      <p className="text-sm text-gray-500 mt-2">
                        Conversion rate: {domainData.pricing.conversionRate}
                      </p>
                    )}
                  </div>
                )}

                {routeInstructions.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-3">Route Instructions</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {routeInstructions.slice(0, 5).map((instruction, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <div>
                            <p className="text-gray-800">{instruction.instruction}</p>
                            <p className="text-gray-500 text-xs">
                              {(instruction.distance / 1000).toFixed(1)} km
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Domain Information commented out - removed broken code */}
          </div>

          {/* Map */}
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
                  {distance && (
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
                {distance 
                  ? `Route distance: ${distance?.toFixed(2)} ${formData.unit}${hasTraffic ? ' • Traffic detected (+2%)' : ''}`
                  : `Viewing ${getCurrentCountryName()}. Click on the map to set locations or type addresses above.`}
                {domainData?.location?.city && !distance && ` Service area: ${domainData.location.city}`}
              </p>
            </div>
            
            <div className="h-[500px] w-full" style={{ minHeight: '500px' }}>
              <TomTomMap
                center={mapCenter}
                zoom={mapZoom}
                onLocationSelect={(lat: number, lng: number) => {
                  // Handle map click for setting pickup/dropoff
                  const activeElement = document.activeElement as HTMLInputElement;
                  const isPickup = activeElement?.name === 'pickup';
                  const isDropoff = activeElement?.name === 'dropoff';
                  
                  // If called from "Center on my location" button or no input focused, set pickup
                  if (isPickup || (!isPickup && !isDropoff)) {
                    setPickupCoords({ lat, lng });
                    setFormData(prev => ({ ...prev, pickup: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}` }));
                    addMarker(lat, lng, 'Pickup', '#3B82F6', '📍');
                  } else if (isDropoff) {
                    setDropoffCoords({ lat, lng });
                    setFormData(prev => ({ ...prev, dropoff: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}` }));
                    addMarker(lat, lng, 'Dropoff', '#EF4444', '🏁');
                  }
                }}
                markers={mapMarkers}
                route={mapRoute}
                apiKey={process.env.NEXT_PUBLIC_TOMTOM_API_KEY || "YxbLh0enMQBXkiLMbuUc78T2ZLTaW6b6"}
                showTraffic={true}
                countryCode={userCountry}
                onZoomChange={(zoom: number) => setMapZoom(zoom)}
                onCenterChange={(center: any) => setMapCenter(center)}
              />
            </div>
            
            {/* Map Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <button
                onClick={() => {
                  if (pickupCoords && dropoffCoords) {
                    const bounds = calculateBounds(pickupCoords, dropoffCoords);
                    setMapCenter({
                      lat: (bounds.minLat + bounds.maxLat) / 2,
                      lng: (bounds.minLng + bounds.maxLng) / 2
                    });
                    setMapZoom(calculateZoomLevel(bounds));
                  }
                }}
                className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition"
                title="Fit route to view"
              >
                🎯
              </button>
              <button
                onClick={() => {
                  const countryDefault = COUNTRY_DEFAULTS[userCountry] || COUNTRY_DEFAULTS['default'];
                  setMapCenter(countryDefault);
                  setMapZoom(countryDefault.zoom);
                }}
                className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition"
                title="Reset to country view"
              >
                🌍
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Use</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-blue-600 font-bold text-lg mb-2">1</div>
              <p className="font-medium text-black mb-1">Select Locations</p>
              <p className="text-sm text-gray-600">Type addresses to see country-specific suggestions or click on the map</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-green-600 font-bold text-lg mb-2">2</div>
              <p className="font-medium text-black mb-1">Calculate</p>
              <p className="text-sm text-gray-600">Click "Calculate Rent" to see distance, route, and cost with traffic adjustments</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-purple-600 font-bold text-lg mb-2">3</div>
              <p className="font-medium text-black mb-1">View Details</p>
              <p className="text-sm text-gray-600">See route line on map with distance label and traffic alerts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles for map markers */}
      <style jsx global>{`
        .leaflet-container {
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        .custom-marker {
          background: transparent;
          border: none;
        }
        .leaflet-popup-content {
          margin: 13px 19px;
        }
        .leaflet-popup-content p {
          margin: 0;
        }
        .distance-label {
          background: transparent !important;
          border: none !important;
        }
        input {
          color: black !important;
        }
        input::placeholder {
          color: #6b7280 !important;
        }
        .traffic-icon {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}