// components/RentCalculatingForm.tsx
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  calculateRent, 
  geocodeAddress,
  getCurrencySymbolById,
  searchLocationSuggestions,
  debounce,
  getCurrencyById
} from '@/lib/db.utils';

interface RentCalculatingFormProps {
  // Form state
  formData: {
    pickup: string;
    dropoff: string;
    unit: 'km' | 'mile';
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
  
  // Data
  domainData: any;
  userCountry: string;
  
  // State setters
  onFormDataChange: (field: 'pickup' | 'dropoff' | 'unit', value: string | 'km' | 'mile') => void;
  onPickupCoordsChange: (coords: { lat: number; lng: number } | null) => void;
  onDropoffCoordsChange: (coords: { lat: number; lng: number } | null) => void;
  onDistanceChange: (distance: number | null) => void;
  onRentChange: (rent: number | null) => void;
  onErrorChange: (error: string | null) => void;
  onHasTrafficChange: (hasTraffic: boolean) => void;
  onRouteInstructionsChange: (instructions: Array<{instruction: string; distance: number}>) => void;
  onMapRouteChange: (route: any) => void;
  onMapCenterChange: (center: { lat: number; lng: number }) => void;
  onMapZoomChange: (zoom: number) => void;
  
  // Actions
  onSuggestionSelect: (suggestion: any, type: 'pickup' | 'dropoff') => void;
  onCalculateRent: (drawRouteLine: () => Promise<void>) => Promise<void>;
  onResetForm: () => void;
  onUnitChange: (unit: 'km' | 'mile') => Promise<void>;
  onAddMarker: (lat: number, lng: number, title: string, color: string, icon?: string) => void;
  
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
    const { name, value } = e.target;
    onFormDataChange(name as 'pickup' | 'dropoff', value);

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
                        handleSuggestionClick(suggestion, 'pickup');
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
                        handleSuggestionClick(suggestion, 'dropoff');
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
              onClick={() => handleUnitClick('km')}
              className={`flex-1 py-3 rounded-lg transition ${
                formData.unit === 'km'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Kilometers (KM)
            </button>
            <button
              onClick={() => handleUnitClick('mile')}
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
            disabled={isLoading || calculatingRoute || !pickupCoords || !dropoffCoords}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {calculatingRoute || isLoading ? (
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
        </div>
      )}

      {/* Route Instructions */}
      {routeInstructions.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Route Instructions</h3>
          <div className="space-y-3">
            {routeInstructions.map((inst, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-500">{index + 1}.</span>
                <div>
                  <p className="text-gray-800">{inst.instruction}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {(inst.distance / 1000).toFixed(2)} km
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Domain Information */}
      {domainData && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Information</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Service Area</span>
              <span className="font-medium text-gray-800">
                {domainData.location?.city || 'N/A'}, {domainData.location?.country || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Rent Rate</span>
              <span className="font-medium text-gray-800">
                {getCurrencySymbolById(domainData.pricing?.currency ?? 0)}
                {formData.unit === 'km' 
                  ? domainData.pricing?.rentPerKm?.toFixed(2) || '1.00'
                  : domainData.pricing?.rentPerMile?.toFixed(2) || '1.60'} per {formData.unit}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Currency</span>
              <span className="font-medium text-gray-800">
                {getCurrencyById(domainData.pricing?.currency ?? 0)?.name || 'USD'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}