// components/RentCalculatingForm.tsx
'use client';

import { useState, useCallback, useRef } from 'react';
import {
  MapPin,
  Navigation,
  RefreshCw,
  Car,
  Info,
  Settings,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Search,
  Calendar,
  Clock,
  Locate,
  ArrowUpDown
} from 'lucide-react';
import {
  calculateRent,
  geocodeAddress,
  getCurrencySymbolById,
  searchLocationSuggestions,
  debounce,
  getCurrencyById,
  reverseGeocode
} from '@/lib/db.utils';

export interface RentCalculatingFormProps {
  // Form state
  formData: {
    pickup: string;
    dropoff: string;
    unit: 'km' | 'mile';
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
    isReturnJourney: boolean;
  };
  pickupCoords: { lat: number; lng: number } | null;
  dropoffCoords: { lat: number; lng: number } | null;
  distance: number | null;
  rent: number | null;
  error: string | null;
  hasTraffic: boolean;
  routeInstructions: Array<{
    instruction: string;
    distance: number;
  }>;
  onToggleMap?: () => void;
  isMapVisible?: boolean;

  // Data
  domainData: any;
  userCountry: string;

  // State setters
  onFormDataChange: (field: string, value: any) => void;
  onPickupCoordsChange: (coords: { lat: number; lng: number } | null) => void;
  onDropoffCoordsChange: (coords: { lat: number; lng: number } | null) => void;
  onDistanceChange: (distance: number | null) => void;
  onRentChange: (rent: number | null) => void;
  onErrorChange: (error: string | null) => void;
  onHasTrafficChange: (hasTraffic: boolean) => void;
  onRouteInstructionsChange: (instructions: Array<{ instruction: string; distance: number }>) => void;
  onMapRouteChange: (route: any) => void;
  onMapCenterChange: (center: { lat: number; lng: number }) => void;
  onMapZoomChange: (zoom: number) => void;

  // Actions
  onSuggestionSelect: (suggestion: any, type: 'pickup' | 'dropoff') => void;
  onCalculateRent: (drawRouteLine: () => Promise<void>) => Promise<void>;
  onResetForm: () => void;
  onUnitChange: (unit: 'km' | 'mile') => Promise<void>;
  onAddMarker: (lat: number, lng: number, title: string, color: string, icon?: string) => void;
  onSwapLocations: () => void;

  // Other
  isLoading: boolean;
  getCurrentCountryName: () => string;
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    country_code?: string;
  };
}

export default function RentCalculatingForm({
  formData,
  pickupCoords,
  dropoffCoords,
  distance,
  rent,
  error,
  hasTraffic,
  routeInstructions,
  domainData,
  userCountry,
  onFormDataChange,
  onPickupCoordsChange,
  onDropoffCoordsChange,
  onDistanceChange,
  onRentChange,
  onErrorChange,
  onHasTrafficChange,
  onRouteInstructionsChange,
  onMapRouteChange,
  onMapCenterChange,
  onMapZoomChange,
  onSuggestionSelect,
  onCalculateRent,
  onResetForm,
  onUnitChange,
  onAddMarker,
  onSwapLocations,
  isLoading,
  getCurrentCountryName
}: RentCalculatingFormProps) {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState<LocationSuggestion[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<LocationSuggestion[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);
  const [calculatingRoute, setCalculatingRoute] = useState(false);

  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropoffInputRef = useRef<HTMLInputElement>(null);

  // Debounced search for suggestions
  const debouncedSearch = useCallback(
    debounce(async (query: string, type: 'pickup' | 'dropoff') => {
      if (query.length < 2) {
        if (type === 'pickup') setPickupSuggestions([]);
        else setDropoffSuggestions([]);
        return;
      }

      setFetchingSuggestions(true);
      try {
        const countryFilter = domainData?.location?.country_code || userCountry;
        const suggestions = await searchLocationSuggestions(query, countryFilter);

        const filteredSuggestions = suggestions.filter((suggestion: any) => {
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

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    // Handle checkbox specifically
    const finalValue = type === 'checkbox' ? checked : value;

    onFormDataChange(name as any, finalValue);

    if (name === 'pickup') {
      onPickupCoordsChange(null);
      setShowPickupSuggestions(true);
      debouncedSearch(value, 'pickup');
    } else if (name === 'dropoff') {
      onDropoffCoordsChange(null);
      setShowDropoffSuggestions(true);
      debouncedSearch(value, 'dropoff');
    }
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion, type: 'pickup' | 'dropoff') => {
    onSuggestionSelect(suggestion, type);
    if (type === 'pickup') {
      setPickupSuggestions([]);
      setShowPickupSuggestions(false);
    } else {
      setDropoffSuggestions([]);
      setShowDropoffSuggestions(false);
    }
  };

  const handleGeocode = async (type: 'pickup' | 'dropoff') => {
    const address = type === 'pickup' ? formData.pickup : formData.dropoff;
    if (!address.trim()) {
      onErrorChange(`Please enter ${type} address`);
      return;
    }

    setIsGeocoding(true);
    onErrorChange(null);

    try {
      const countryFilter = domainData?.location?.country_code || userCountry;
      const result = await geocodeAddress(address, countryFilter);
      if (result) {
        const coords = { lat: result.lat, lng: result.lng };
        if (type === 'pickup') {
          onPickupCoordsChange(coords);
          onAddMarker(coords.lat, coords.lng, 'Pickup', '#3B82F6', '📍');
        } else {
          onDropoffCoordsChange(coords);
          onAddMarker(coords.lat, coords.lng, 'Dropoff', '#EF4444', '🏁');
        }
        onFormDataChange(type, result.address);
      } else {
        onErrorChange(`Could not find location for ${type} address`);
      }
    } catch (err) {
      onErrorChange('Geocoding service error. Please try again.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      onErrorChange('Geolocation is not supported by your browser');
      return;
    }

    setIsGeocoding(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const address = await reverseGeocode(latitude, longitude);

          if (address) {
            onPickupCoordsChange({ lat: latitude, lng: longitude });
            onAddMarker(latitude, longitude, 'Pickup', '#3B82F6', '📍');
            onFormDataChange('pickup', address);
          } else {
            // Fallback if reverse geocoding fails but we have coords
            const coordsText = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
            onPickupCoordsChange({ lat: latitude, lng: longitude });
            onAddMarker(latitude, longitude, 'Pickup', '#3B82F6', '📍');
            onFormDataChange('pickup', coordsText);
          }
        } catch (error) {
          console.error('Error getting location:', error);
          onErrorChange('Failed to get your location details');
        } finally {
          setIsGeocoding(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Failed to get your location';
        if (error.code === 1) errorMessage = 'Location permission denied';
        if (error.code === 2) errorMessage = 'Location unavailable';
        if (error.code === 3) errorMessage = 'Location request timed out';
        onErrorChange(errorMessage);
        setIsGeocoding(false);
      }
    );
  };

  // Draw route line function - this is passed to onCalculateRent
  const drawRouteLine = async () => {
    if (!pickupCoords || !dropoffCoords) return;

    setCalculatingRoute(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY || "YxbLh0enMQBXkiLMbuUc78T2ZLTaW6b6";
      if (!apiKey || apiKey === "YOUR_TOMTOM_API_KEY") {
        throw new Error('TomTom API key is missing or invalid');
      }

      const response = await fetch(
        `https://api.tomtom.com/routing/1/calculateRoute/${pickupCoords.lat},${pickupCoords.lng}:${dropoffCoords.lat},${dropoffCoords.lng}/json?key=${apiKey}&routeType=fastest&traffic=true&travelMode=car&routeRepresentation=polyline&computeBestOrder=false&instructionsType=tagged&language=en-US&vehicleMaxSpeed=120&vehicleWeight=2000&departAt=now`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Route API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const legs = route.legs[0];

        let waypoints: { lat: number; lng: number }[] = [];

        if (legs.points && legs.points.length > 0) {
          waypoints = legs.points.map((point: any) => ({
            lat: point.latitude,
            lng: point.longitude
          }));
        }

        const instructions = [];
        if (route.guidance && route.guidance.instructions) {
          for (const inst of route.guidance.instructions) {
            if (instructions.length < 10) {
              instructions.push({
                instruction: inst.message,
                distance: inst.routeOffsetInMeters
              });
            }
          }
        }
        onRouteInstructionsChange(instructions);

        const hasTraffic = legs.summary?.trafficDelayInSeconds > 0;
        onHasTrafficChange(hasTraffic);

        const routeDistanceKm = legs.summary?.lengthInMeters / 1000;
        const displayDistance = formData.unit === 'km'
          ? routeDistanceKm
          : routeDistanceKm * 0.621371;

        onDistanceChange(displayDistance);

        onMapRouteChange({
          start: pickupCoords,
          end: dropoffCoords,
          waypoints: waypoints,
          hasTraffic: hasTraffic
        });

        const pricing = domainData?.pricing || {
          rentPerKm: 1,
          rentPerMile: 1.6,
          currency: 0,
          conversionRate: 1
        };

        const trafficMultiplier = hasTraffic ? 1.02 : 1.0;
        const baseRent = calculateRent(displayDistance, pricing, formData.unit);
        const calculatedRent = baseRent * trafficMultiplier;
        onRentChange(calculatedRent);

      } else {
        throw new Error('No road route found between locations');
      }
    } catch (error) {
      console.error('Error fetching road route:', error);
      onErrorChange('Could not calculate road route. Please check locations and try again.');
      setTimeout(() => onErrorChange(null), 5000);
      onMapRouteChange(null);
    } finally {
      setCalculatingRoute(false);
    }
  };

  const calculateRentHandler = async () => {
    await onCalculateRent(drawRouteLine);
  };

  const handleUnitClick = async (unit: 'km' | 'mile') => {
    await onUnitChange(unit);
    // Redraw route with new unit
    if (pickupCoords && dropoffCoords) {
      await drawRouteLine();
    }
  };

  const resetForm = () => {
    onResetForm();
    setPickupSuggestions([]);
    setDropoffSuggestions([]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {/* Pickup Location */}
        <div className="space-y-1.5 relative group">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-300">
            <MapPin className="w-3.5 h-3.5 text-pink-400" />
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
              placeholder={`Enter pickup in ${getCurrentCountryName()}...`}
              className="w-full pl-9 pr-10 py-3 bg-white/5 border border-white/10 text-white text-sm placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all backdrop-blur-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-pink-400 transition-colors" />
            <div className="flex gap-2 absolute right-2 top-1/2 -translate-y-1/2">
              <button
                onClick={handleLocateMe}
                disabled={isGeocoding}
                className="p-1.5 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed group/locate"
                title="Use my current location"
              >
                {isGeocoding ? (
                  <div className="animate-spin w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <Locate className="w-3.5 h-3.5 transform group-hover/locate:scale-110 transition-transform" />
                )}
              </button>
              <button
                onClick={() => handleGeocode('pickup')}
                disabled={isGeocoding || !formData.pickup.trim()}
                className="p-1.5 bg-pink-500/20 text-pink-400 rounded-md hover:bg-pink-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Locate coordinates"
              >
                {isGeocoding ? <div className="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full" /> : <MapPin className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Suggestions dropdown */}
            {showPickupSuggestions && (pickupSuggestions.length > 0 || fetchingSuggestions) && (
              <div className="absolute z-20 w-full mt-1 bg-[#1a1c2e] border border-white/10 rounded-lg shadow-xl overflow-hidden backdrop-blur-xl">
                {fetchingSuggestions ? (
                  <div className="px-3 py-2 text-center text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-pink-500 border-t-transparent mx-auto mb-1"></div>
                    <p className="text-[10px]">Searching...</p>
                  </div>
                ) : pickupSuggestions.length === 0 ? (
                  <div className="px-3 py-2 text-center text-gray-400 text-xs">
                    No locations found
                  </div>
                ) : (
                  pickupSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-b-0 transition flex items-center gap-2 group/item"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSuggestionClick(suggestion, 'pickup');
                      }}
                    >
                      <div className="p-1.5 rounded-full bg-white/5 group-hover/item:bg-pink-500/20 transition-colors">
                        <MapPin className="w-3 h-3 text-gray-400 group-hover/item:text-pink-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-200 text-xs truncate">
                          {suggestion.display_name.split(',')[0]}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">
                          {suggestion.display_name}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Swap Button - Absolute positioned in the middle, or relative between */}
        <div className="relative h-2 flex items-right justify-center z-10">
          <button
            onClick={onSwapLocations}
            className="absolute p-1.5 rounded-full bg-gray-800 border border-white/10 text-gray-400 hover:text-pink-400 hover:border-pink-500/50 hover:bg-gray-700 transition-all shadow-lg transform hover:scale-110 hover:rotate-180 duration-300"
            title="Swap locations"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dropoff Location */}
        <div className="space-y-1.5 relative group">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-300">
            <Navigation className="w-3.5 h-3.5 text-pink-400" />
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
              placeholder={`Enter destination...`}
              className="w-full pl-9 pr-10 py-3 bg-white/5 border border-white/10 text-white text-sm placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all backdrop-blur-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-pink-400 transition-colors" />
            <button
              onClick={() => handleGeocode('dropoff')}
              disabled={isGeocoding || !formData.dropoff.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-pink-500/20 text-pink-400 rounded-md hover:bg-pink-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Locate coordinates"
            >
              {isGeocoding ? <div className="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full" /> : <Navigation className="w-3.5 h-3.5" />}
            </button>

            {/* Suggestions dropdown */}
            {showDropoffSuggestions && (dropoffSuggestions.length > 0 || fetchingSuggestions) && (
              <div className="absolute z-20 w-full mt-1 bg-[#1a1c2e] border border-white/10 rounded-lg shadow-xl overflow-hidden backdrop-blur-xl">
                {fetchingSuggestions ? (
                  <div className="px-3 py-2 text-center text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-pink-500 border-t-transparent mx-auto mb-1"></div>
                    <p className="text-[10px]">Searching...</p>
                  </div>
                ) : dropoffSuggestions.length === 0 ? (
                  <div className="px-3 py-2 text-center text-gray-400 text-xs">
                    No locations found
                  </div>
                ) : (
                  dropoffSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-b-0 transition flex items-center gap-2 group/item"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSuggestionClick(suggestion, 'dropoff');
                      }}
                    >
                      <div className="p-1.5 rounded-full bg-white/5 group-hover/item:bg-pink-500/20 transition-colors">
                        <Navigation className="w-3 h-3 text-gray-400 group-hover/item:text-pink-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-200 text-xs truncate">
                          {suggestion.display_name.split(',')[0]}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">
                          {suggestion.display_name}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Date and Time Group */}
        <div className="grid grid-cols-2 gap-3">
          {/* Pickup Date */}
          <div className="space-y-1.5 relative group">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-300">
              <Calendar className="w-3.5 h-3.5 text-pink-400" />
              Pickup Date
            </label>
            <input
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleInputChange}
              className="w-full px-3 py-3 bg-white/5 border border-white/10 text-white text-sm placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all backdrop-blur-sm [color-scheme:dark]"
            />
          </div>

          {/* Pickup Time */}
          <div className="space-y-1.5 relative group">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-300">
              <Clock className="w-3.5 h-3.5 text-pink-400" />
              Time
            </label>
            <input
              type="time"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleInputChange}
              className="w-full px-3 py-3 bg-white/5 border border-white/10 text-white text-sm placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all backdrop-blur-sm [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Return Journey Toggle */}
        <div className="flex items-center gap-3 py-1">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isReturnJourney"
              checked={formData.isReturnJourney}
              onChange={handleInputChange}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-500"></div>
            <span className="ml-2 text-xs font-medium text-gray-300">Return Journey?</span>
          </label>
        </div>

        {/* Return Date and Time Group */}
        {formData.isReturnJourney && (
          <div className="grid grid-cols-2 gap-3 animate-fade-in">
            {/* Return Date */}
            <div className="space-y-1.5 relative group">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-300">
                <Calendar className="w-3.5 h-3.5 text-pink-400" />
                Return Date
              </label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleInputChange}
                className="w-full px-3 py-3 bg-white/5 border border-white/10 text-white text-sm placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all backdrop-blur-sm [color-scheme:dark]"
              />
            </div>

            {/* Return Time */}
            <div className="space-y-1.5 relative group">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-300">
                <Clock className="w-3.5 h-3.5 text-pink-400" />
                Time
              </label>
              <input
                type="time"
                name="returnTime"
                value={formData.returnTime}
                onChange={handleInputChange}
                className="w-full px-3 py-3 bg-white/5 border border-white/10 text-white text-sm placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all backdrop-blur-sm [color-scheme:dark]"
              />
            </div>
          </div>
        )}

        {/* Unit Selection */}
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => handleUnitClick('km')}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${formData.unit === 'km'
              ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            Kilometers
          </button>
          <button
            onClick={() => handleUnitClick('mile')}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${formData.unit === 'mile'
              ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            Miles
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={calculateRentHandler}
            disabled={isLoading || calculatingRoute || !pickupCoords || !dropoffCoords}
            className="flex-[2] bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-[0.98] text-sm"
          >
            {calculatingRoute || isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Car className="w-4 h-4" />
                <span>Calculate Price</span>
              </>
            )}
          </button>
          <button
            onClick={resetForm}
            className="flex-1 px-3 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 hover:border-white/30 transition flex items-center justify-center gap-2 font-medium"
            title="Reset Form"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-200">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <p className="text-xs">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
