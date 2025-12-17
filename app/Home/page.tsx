'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  calculateDistance, 
  calculateRent, 
  geocodeAddress,
  getCurrencySymbol,
  fetchDomainPricing
} from '@/lib/db.utils';

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
}

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
  const [domainData, setDomainData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // New states for suggestions
  const [pickupSuggestions, setPickupSuggestions] = useState<LocationSuggestion[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<LocationSuggestion[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routeLineRef = useRef<any>(null);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropoffInputRef = useRef<HTMLInputElement>(null);
  
  // Get current domain
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

  // Debounced search for location suggestions
  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Search for location suggestions
  const searchLocationSuggestions = async (query: string, type: 'pickup' | 'dropoff') => {
    if (query.length < 3) {
      if (type === 'pickup') setPickupSuggestions([]);
      else setDropoffSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'RentCalculator/1.0'
          }
        }
      );
      
      const data = await response.json();
      
      if (type === 'pickup') {
        setPickupSuggestions(data || []);
      } else {
        setDropoffSuggestions(data || []);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Debounced version of search function
  const debouncedSearch = useCallback(
    debounce(searchLocationSuggestions, 300),
    []
  );

  // Handle input change with suggestions
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
      addMarker(coords.lat, coords.lng, 'Pickup', '#3B82F6');
    } else {
      setFormData(prev => ({ ...prev, dropoff: suggestion.display_name }));
      setDropoffCoords(coords);
      setDropoffSuggestions([]);
      setShowDropoffSuggestions(false);
      addMarker(coords.lat, coords.lng, 'Dropoff', '#EF4444');
    }

    // Focus on other input
    if (type === 'pickup' && dropoffInputRef.current) {
      dropoffInputRef.current.focus();
    } else if (type === 'dropoff' && pickupInputRef.current) {
      pickupInputRef.current.focus();
    }
  };

  // Load domain data on component mount
  useEffect(() => {
    async function loadDomainData() {
      setIsLoading(true);
      try {
        const data = await fetchDomainPricing(currentDomain);
        if (data) {
          setDomainData(data);
          if (data.location?.coordinates) {
            initializeMap(data.location.coordinates);
          } else {
            initializeMap({ lat: 31.5656822, lng: 74.3141829 });
          }
        }
      } catch (err) {
        console.error('Error loading domain data:', err);
        setError('Failed to load domain pricing information');
        initializeMap({ lat: 31.5656822, lng: 74.3141829 });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDomainData();
  }, [currentDomain]);

  // Initialize OpenStreetMap
  const initializeMap = (center: Coordinates) => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Check if Leaflet is already loaded
    if ((window as any).L) {
      createMap(center);
      return;
    }

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.crossOrigin = '';
    script.onload = () => {
      createMap(center);
    };
    script.onerror = () => {
      console.error('Failed to load Leaflet');
      setError('Failed to load map. Please refresh the page.');
    };
    
    document.body.appendChild(script);
  };

  const createMap = (center: Coordinates) => {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;
    
    try {
      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current).setView([center.lat, center.lng], 13);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
      
      // Add click event to map
      mapInstanceRef.current.on('click', async (e: any) => {
        const { lat, lng } = e.latlng;
        
        // Determine which location to set based on which field was last focused
        const activeElement = document.activeElement as HTMLInputElement;
        const isPickup = activeElement?.name === 'pickup';
        const isDropoff = activeElement?.name === 'dropoff';
        
        if (!isPickup && !isDropoff) return;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            { headers: { 'User-Agent': 'RentCalculator/1.0' } }
          );
          const data = await response.json();
          const address = data.display_name || `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
          
          if (isPickup) {
            setPickupCoords({ lat, lng });
            setFormData(prev => ({ ...prev, pickup: address }));
            addMarker(lat, lng, 'Pickup', '#3B82F6');
          } else if (isDropoff) {
            setDropoffCoords({ lat, lng });
            setFormData(prev => ({ ...prev, dropoff: address }));
            addMarker(lat, lng, 'Dropoff', '#EF4444');
          }
        } catch (error) {
          console.error('Reverse geocoding failed:', error);
          const address = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
          
          if (isPickup) {
            setPickupCoords({ lat, lng });
            setFormData(prev => ({ ...prev, pickup: address }));
            addMarker(lat, lng, 'Pickup', '#3B82F6');
          } else if (isDropoff) {
            setDropoffCoords({ lat, lng });
            setFormData(prev => ({ ...prev, dropoff: address }));
            addMarker(lat, lng, 'Dropoff', '#EF4444');
          }
        }
      });
      
      setMapLoaded(true);
      
      // Add domain area bounds if available and not default
      if (domainData && !domainData.isDefault && domainData.location?.coordinates) {
        const { lat, lng } = domainData.location.coordinates;
        
        // Add a circle to show the service area
        L.circle([lat, lng], {
          color: '#10B981',
          fillColor: '#10B981',
          fillOpacity: 0.1,
          radius: 5000 // 5km radius
        }).addTo(mapInstanceRef.current);
        
        // Set view to the service area
        mapInstanceRef.current.setView([lat, lng], 13);
      }
    } catch (error) {
      console.error('Error creating map:', error);
      setError('Failed to initialize map');
    }
  };

  // Add marker to map
  const addMarker = (lat: number, lng: number, title: string, color: string) => {
    if (!mapInstanceRef.current) return;
    
    const L = (window as any).L;
    if (!L) return;
    
    try {
      // Clear previous markers of the same type
      if (title === 'Pickup') {
        markersRef.current = markersRef.current.filter(marker => 
          marker.options.title !== 'Pickup'
        );
      } else if (title === 'Dropoff') {
        markersRef.current = markersRef.current.filter(marker => 
          marker.options.title !== 'Dropoff'
        );
      }
      
      // Clear existing markers from map
      markersRef.current.forEach(marker => {
        mapInstanceRef.current.removeLayer(marker);
      });
      
      // Add new marker
      const marker = L.marker([lat, lng], { title })
        .addTo(mapInstanceRef.current)
        .bindPopup(`<b>${title}</b><br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`);
      
      // Create custom icon for better visibility
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      
      marker.setIcon(icon);
      markersRef.current.push(marker);
      
      // Fit map bounds to show all markers
      if (markersRef.current.length > 0) {
        const bounds = L.latLngBounds(markersRef.current.map(m => m.getLatLng()));
        mapInstanceRef.current.fitBounds(bounds.pad(0.1));
      }
    } catch (error) {
      console.error('Error adding marker:', error);
    }
  };

  // Draw route line between pickup and dropoff
  const drawRouteLine = () => {
    if (!mapInstanceRef.current || !pickupCoords || !dropoffCoords) return;
    
    const L = (window as any).L;
    if (!L) return;
    
    // Remove existing route line
    if (routeLineRef.current) {
      mapInstanceRef.current.removeLayer(routeLineRef.current);
    }
    
    // Create a polyline between the two points
    const routeLine = L.polyline(
      [[pickupCoords.lat, pickupCoords.lng], [dropoffCoords.lat, dropoffCoords.lng]],
      {
        color: '#8B5CF6', // Purple color
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10',
        lineJoin: 'round'
      }
    ).addTo(mapInstanceRef.current);
    
    // Add distance label in the middle of the line
    const midpoint = {
      lat: (pickupCoords.lat + dropoffCoords.lat) / 2,
      lng: (pickupCoords.lng + dropoffCoords.lng) / 2
    };
    
    L.marker([midpoint.lat, midpoint.lng], {
      icon: L.divIcon({
        className: 'distance-label',
        html: `<div style="background: white; padding: 4px 8px; border-radius: 12px; border: 2px solid #8B5CF6; font-weight: bold; color: #374151;">${distance} ${formData.unit}</div>`,
        iconSize: [100, 30],
        iconAnchor: [50, 15]
      })
    }).addTo(mapInstanceRef.current);
    
    routeLineRef.current = routeLine;
    
    // Fit map to show both markers and the route
    const bounds = L.latLngBounds([
      [pickupCoords.lat, pickupCoords.lng],
      [dropoffCoords.lat, dropoffCoords.lng]
    ]);
    mapInstanceRef.current.fitBounds(bounds.pad(0.2));
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
      const result = await geocodeAddress(address);
      if (result) {
        const coords = { lat: result.lat, lng: result.lng };
        if (type === 'pickup') {
          setPickupCoords(coords);
          addMarker(coords.lat, coords.lng, 'Pickup', '#3B82F6');
        } else {
          setDropoffCoords(coords);
          addMarker(coords.lat, coords.lng, 'Dropoff', '#EF4444');
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

  // Calculate rent
  const calculateRentHandler = () => {
    if (!pickupCoords || !dropoffCoords) {
      setError('Please select both pickup and dropoff locations');
      return;
    }

    const calculatedDistance = calculateDistance(
      pickupCoords.lat,
      pickupCoords.lng,
      dropoffCoords.lat,
      dropoffCoords.lng,
      formData.unit
    );
    
    setDistance(calculatedDistance);
    setError(null);

    // Calculate rent based on domain pricing or default
    const pricing = domainData?.pricing || { rentPerKm: 1, rentPerMile: 1.6 };
    const calculatedRent = calculateRent(calculatedDistance, pricing, formData.unit);
    setRent(calculatedRent);

    // Draw route line on map
    drawRouteLine();
  };

  // Handle unit change
  const handleUnitChange = (unit: 'km' | 'mile') => {
    setFormData(prev => ({
      ...prev,
      unit
    }));
    
    // Recalculate rent if distance exists
    if (distance && domainData?.pricing) {
      const newRent = calculateRent(distance, domainData.pricing, unit);
      setRent(newRent);
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
    
    // Clear markers and route line
    if (mapInstanceRef.current) {
      // Clear markers
      markersRef.current.forEach(marker => {
        mapInstanceRef.current.removeLayer(marker);
      });
      markersRef.current = [];
      
      // Clear route line
      if (routeLineRef.current) {
        mapInstanceRef.current.removeLayer(routeLineRef.current);
        routeLineRef.current = null;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Rent Calculator
          </h1>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-gray-600">
              Calculate transportation costs based on {currentDomain} pricing
            </p>
            
            {domainData?.domain && (
              <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
                <span className="font-medium">Active Domain:</span> {domainData.domain.domainName}
              </div>
            )}
            {domainData?.isDefault && (
              <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
                <span className="font-medium">Using Default Pricing</span>
              </div>
            )}
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
                    placeholder="Start typing address..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-black placeholder-gray-500"
                  />
                  <button
                    onClick={() => handleGeocode('pickup')}
                    disabled={isGeocoding || !formData.pickup.trim()}
                    className="absolute right-2 top-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isGeocoding ? '...' : 'Locate'}
                  </button>
                  
                  {/* Suggestions dropdown */}
                  {showPickupSuggestions && pickupSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {pickupSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onMouseDown={() => handleSuggestionSelect(suggestion, 'pickup')}
                        >
                          <div className="font-medium text-black">{suggestion.display_name.split(',')[0]}</div>
                          <div className="text-sm text-gray-600 truncate">
                            {suggestion.display_name}
                          </div>
                        </div>
                      ))}
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
                    placeholder="Start typing address..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-black placeholder-gray-500"
                  />
                  <button
                    onClick={() => handleGeocode('dropoff')}
                    disabled={isGeocoding || !formData.dropoff.trim()}
                    className="absolute right-2 top-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isGeocoding ? '...' : 'Locate'}
                  </button>
                  
                  {/* Suggestions dropdown */}
                  {showDropoffSuggestions && dropoffSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {dropoffSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onMouseDown={() => handleSuggestionSelect(suggestion, 'dropoff')}
                        >
                          <div className="font-medium text-black">{suggestion.display_name.split(',')[0]}</div>
                          <div className="text-sm text-gray-600 truncate">
                            {suggestion.display_name}
                          </div>
                        </div>
                      ))}
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
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Calculating...' : 'Calculate Rent'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Reset
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
                      {distance} {formData.unit}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Estimated Rent</p>
                    <p className="text-3xl font-bold text-green-600">
                      {getCurrencySymbol(domainData?.pricing?.currency || 0)}{rent}
                    </p>
                  </div>
                </div>
                
                {domainData?.pricing && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-3">Pricing Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Rate per Kilometer</p>
                        <p className="font-semibold text-black">
                          {getCurrencySymbol(domainData.pricing.currency)}{domainData.pricing.rentPerKm}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Rate per Mile</p>
                        <p className="font-semibold text-black">
                          {getCurrencySymbol(domainData.pricing.currency)}{domainData.pricing.rentPerMile}
                        </p>
                      </div>
                    </div>
                    {domainData.pricing.conversionRate !== 1 && (
                      <p className="text-sm text-gray-500 mt-2">
                        Conversion rate: {domainData.pricing.conversionRate}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Domain Information */}
            {domainData && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {domainData.isDefault ? 'Default Pricing' : 'Domain Information'}
                </h3>
                
                {domainData.domain ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Domain Name</p>
                      <p className="font-medium text-black">{domainData.domain.domainName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium text-black capitalize">{domainData.domain.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Service Location</p>
                      <p className="font-medium text-black">
                        {domainData.location.city}, {domainData.location.country}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Pricing Type</p>
                      <p className="font-medium text-black">Default System Pricing</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rate per Kilometer</p>
                      <p className="font-medium text-black">$1.00</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rate per Mile</p>
                      <p className="font-medium text-black">$1.60</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Map */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">OpenStreetMap</h3>
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
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {distance 
                  ? `Route distance: ${distance} ${formData.unit}`
                  : 'Click on the map to set locations or type addresses above.'}
                {domainData?.location?.city && !distance && ` Service area: ${domainData.location.city}`}
              </p>
            </div>
            
            <div 
              ref={mapRef} 
              className="h-[500px] w-full"
              style={{ minHeight: '500px' }}
            />
            
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading map...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Use</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-blue-600 font-bold text-lg mb-2">1</div>
              <p className="font-medium text-black mb-1">Select Locations</p>
              <p className="text-sm text-gray-600">Type addresses to see suggestions or click on the map</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-green-600 font-bold text-lg mb-2">2</div>
              <p className="font-medium text-black mb-1">Calculate</p>
              <p className="text-sm text-gray-600">Click "Calculate Rent" to see distance, route, and cost</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-purple-600 font-bold text-lg mb-2">3</div>
              <p className="font-medium text-black mb-1">View Details</p>
              <p className="text-sm text-gray-600">See route line on map with distance label in the middle</p>
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
      `}</style>
    </div>
  );
}