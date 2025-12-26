// app/rent-calculator/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/mainwebsite/header';
import MapComponent from '../components/mainwebsite/MapComponent';
import { Hero } from '../components/mainwebsite/hero';
import { Footer } from '../components/mainwebsite/footer';
import { BlogSection } from '../components/mainwebsite/blog-section';
import { Testimonials } from '../components/mainwebsite/testimonials';
import AboutSection from '../components/mainwebsite/about-section';
import ExperienceSection from '../components/mainwebsite/experience-section';
import ServicesSection from '../components/mainwebsite/services-section';
import TaxiRates from '../components/mainwebsite/taxi-rates';
import WhyChooseUs from '../components/mainwebsite/why-choose-us';
import { useTheme } from '../components/ThemeProvider';
import { PageSkeleton } from '../components/mainwebsite/Skeleton';



import {
  fetchDomainPricing,
  getCountryCodeFromIP,
  cleanDomain,
  calculateDistance
} from '@/lib/db.utils';

// Country-specific default coordinates
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

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    country_code?: string;
  };
}

export default function RentCalculatorPage() {
  useTheme();
  // Shared state
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    unit: 'km' as 'km' | 'mile',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupTime: '12:00',
    returnDate: '',
    returnTime: '12:00',
    isReturnJourney: false
  });
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [rent, setRent] = useState<number | null>(null);
  const [mapMarkers, setMapMarkers] = useState<Array<{
    position: { lat: number; lng: number };
    title: string;
    color: string;
    icon?: string
  }>>([]);
  const [mapRoute, setMapRoute] = useState<{
    start: { lat: number; lng: number };
    end: { lat: number; lng: number };
    waypoints?: { lat: number; lng: number }[];
    hasTraffic?: boolean;
  } | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 31.5656822, lng: 74.3141829 });
  const [mapZoom, setMapZoom] = useState<number>(6);
  const [userCountry, setUserCountry] = useState<string>('PK');
  const [domainData, setDomainData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [minLoadingPassed, setMinLoadingPassed] = useState(false);
  const { isThemeLoading } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [hasTraffic, setHasTraffic] = useState<boolean>(false);
  const [showMap, setShowMap] = useState(false);
  const [routeInstructions, setRouteInstructions] = useState<Array<{
    instruction: string;
    distance: number;
  }>>([]);

  // Initialize user country and domain data
  useEffect(() => {
    // Start minimum loading timer
    const timer = setTimeout(() => {
      setMinLoadingPassed(true);
    }, 1000);

    const initializeData = async () => {
      // Get user country from IP
      try {
        const countryCode = await getCountryCodeFromIP();
        if (countryCode) {
          setUserCountry(countryCode.toUpperCase());
          const countryDefault = COUNTRY_DEFAULTS[countryCode.toUpperCase()] || COUNTRY_DEFAULTS['default'];
          setMapCenter(countryDefault);
          setMapZoom(countryDefault.zoom);
        }
      } catch (error) {
        console.error('Failed to detect country:', error);
        // Fallback logic
        if (typeof navigator !== 'undefined') {
          const language = navigator.language || 'en-US';
          let fallbackCountry = 'PK';
          if (language.includes('ur') || language.includes('PK')) fallbackCountry = 'PK';
          else if (language.includes('en-IN') || language.includes('hi')) fallbackCountry = 'IN';
          else if (language.includes('en-US') || language.includes('en-CA')) fallbackCountry = 'US';
          else if (language.includes('en-GB')) fallbackCountry = 'GB';

          const countryDefault = COUNTRY_DEFAULTS[fallbackCountry] || COUNTRY_DEFAULTS['default'];
          setMapCenter(countryDefault);
          setMapZoom(countryDefault.zoom);
          setUserCountry(fallbackCountry);
        }
      }

      // Load domain data
      const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      setIsLoading(true);
      try {
        const cleanedCurrentDomain = cleanDomain(currentDomain);
        const data = await fetchDomainPricing(cleanedCurrentDomain);
        if (data) {
          setDomainData(data);
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
        }
      } catch (err) {
        console.error('Error loading domain data:', err);
        setError('Failed to load domain pricing information');
        const countryDefault = COUNTRY_DEFAULTS[userCountry] || COUNTRY_DEFAULTS['default'];
        setMapCenter(countryDefault);
        setMapZoom(countryDefault.zoom);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
    return () => clearTimeout(timer);
  }, []);

  // Automatically draw route when both locations are selected
  useEffect(() => {
    if (pickupCoords && dropoffCoords) {
      setRouteInstructions([]);
    } else {
      setMapRoute(null);
      setRouteInstructions([]);
    }
  }, [pickupCoords, dropoffCoords]);

  // Helper function to get country name
  const getCurrentCountryName = useCallback(() => {
    const countryCodes: Record<string, string> = {
      'PK': 'Pakistan', 'IN': 'India', 'US': 'United States', 'GB': 'United Kingdom',
      'CA': 'Canada', 'AU': 'Australia', 'CN': 'China', 'BR': 'Brazil',
      'RU': 'Russia', 'ZA': 'South Africa', 'AE': 'United Arab Emirates',
      'DE': 'Germany'
    };
    return countryCodes[userCountry] || userCountry;
  }, [userCountry]);

  // Function to add markers to map
  const addMarker = useCallback((lat: number, lng: number, title: string, color: string, icon?: string) => {
    setMapMarkers(prev => {
      const filtered = prev.filter(marker => marker.title !== title);
      return [...filtered, { position: { lat, lng }, title, color, icon }];
    });
  }, []);

  // Handle map click for setting locations
  const handleMapLocationSelect = useCallback((lat: number, lng: number, isPickup: boolean) => {
    const locationText = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;

    if (isPickup) {
      setPickupCoords({ lat, lng });
      setFormData(prev => ({ ...prev, pickup: locationText }));
      addMarker(lat, lng, 'Pickup', 'rgb(var(--primary))', '📍');
    } else {
      setDropoffCoords({ lat, lng });
      setFormData(prev => ({ ...prev, dropoff: locationText }));
      addMarker(lat, lng, 'Dropoff', 'rgb(var(--secondary))', '🏁');
    }
  }, [addMarker]);

  // Handle form input changes from RentCalculatingForm
  const handleFormInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Handle suggestion selection from form
  const handleSuggestionSelect = useCallback((suggestion: LocationSuggestion, type: 'pickup' | 'dropoff') => {
    const coords = {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon)
    };

    if (type === 'pickup') {
      setFormData(prev => ({ ...prev, pickup: suggestion.display_name }));
      setPickupCoords(coords);
      addMarker(coords.lat, coords.lng, 'Pickup', 'rgb(var(--primary))', '📍');
    } else {
      setFormData(prev => ({ ...prev, dropoff: suggestion.display_name }));
      setDropoffCoords(coords);
      addMarker(coords.lat, coords.lng, 'Dropoff', 'rgb(var(--secondary))', '🏁');
    }
  }, [addMarker]);

  // Handle route calculation
  const handleCalculateRent = useCallback(async (drawRouteLine: () => Promise<void>) => {
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
  }, [pickupCoords, dropoffCoords, formData.unit]);

  // Handle reset form
  const handleResetForm = useCallback(() => {
    setFormData({
      pickup: '',
      dropoff: '',
      unit: 'km',
      pickupDate: new Date().toISOString().split('T')[0],
      pickupTime: '12:00',
      returnDate: '',
      returnTime: '12:00',
      isReturnJourney: false
    });
    setPickupCoords(null);
    setDropoffCoords(null);
    setDistance(null);
    setRent(null);
    setError(null);
    setMapMarkers([]);
    setMapRoute(null);
    setHasTraffic(false);
    setRouteInstructions([]);

    // Reset to country default view
    const countryDefault = COUNTRY_DEFAULTS[userCountry] || COUNTRY_DEFAULTS['default'];
    setMapCenter(countryDefault);
    setMapZoom(countryDefault.zoom);
  }, [userCountry]);

  // Handle unit change
  const handleUnitChange = useCallback(async (unit: 'km' | 'mile') => {
    setFormData(prev => ({
      ...prev,
      unit
    }));

    // Recalculate if distance exists
    if (distance && domainData?.pricing && pickupCoords && dropoffCoords) {
      // Update route will be handled by the form component
      const newDistance = calculateDistance(
        pickupCoords.lat,
        pickupCoords.lng,
        dropoffCoords.lat,
        dropoffCoords.lng,
        unit
      );
      setDistance(newDistance);
    }
  }, [distance, domainData, pickupCoords, dropoffCoords]);

  // Handle swap locations
  const handleSwapLocations = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      pickup: prev.dropoff,
      dropoff: prev.pickup
    }));

    const tempPickupCoords = pickupCoords;
    setPickupCoords(dropoffCoords);
    setDropoffCoords(tempPickupCoords);

    // Swap markers
    if (pickupCoords && dropoffCoords) {
      addMarker(dropoffCoords.lat, dropoffCoords.lng, 'Pickup', 'rgb(var(--primary))', '📍');
      addMarker(pickupCoords.lat, pickupCoords.lng, 'Dropoff', 'rgb(var(--secondary))', '🏁');
    } else if (pickupCoords) {
      addMarker(pickupCoords.lat, pickupCoords.lng, 'Dropoff', 'rgb(var(--secondary))', '🏁');
      // Remove pickup marker logic if strict marker management is needed, 
      // but addMarker filters by title so replacing is enough.
    } else if (dropoffCoords) {
      addMarker(dropoffCoords.lat, dropoffCoords.lng, 'Pickup', 'rgb(var(--primary))', '📍');
    }

    // Reset route validation or trigger recalculation if needed
    // The useEffect for mapRoute/routeInstructions triggers on coords change
  }, [pickupCoords, dropoffCoords, addMarker]);

  const handleToggleMap = useCallback(() => {
    setShowMap((prev) => {
      const newState = !prev;
      if (newState) {
        // Smooth scroll to map section with a slight delay if we are opening it
        setTimeout(() => {
          const mapSection = document.getElementById('map-section');
          if (mapSection) {
            mapSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
      return newState;
    });
  }, []);

  if ((isLoading || isThemeLoading || !minLoadingPassed) && !domainData) {
    return <PageSkeleton />;
  }

  return (
    <>
      <Header />
      <Hero
        formData={formData}
        onFormDataChange={handleFormInputChange}
        pickupCoords={pickupCoords}
        dropoffCoords={dropoffCoords}
        distance={distance}
        rent={rent}
        error={error}
        hasTraffic={hasTraffic}
        routeInstructions={routeInstructions}
        domainData={domainData}
        userCountry={userCountry}
        onPickupCoordsChange={setPickupCoords}
        onDropoffCoordsChange={setDropoffCoords}
        onDistanceChange={setDistance}
        onRentChange={setRent}
        onErrorChange={setError}
        onHasTrafficChange={setHasTraffic}
        onRouteInstructionsChange={setRouteInstructions}
        onMapRouteChange={setMapRoute}
        onMapCenterChange={setMapCenter}
        onMapZoomChange={setMapZoom}
        onSuggestionSelect={handleSuggestionSelect}
        onCalculateRent={handleCalculateRent}
        onResetForm={handleResetForm}
        onUnitChange={handleUnitChange}
        isLoading={isLoading}
        getCurrentCountryName={getCurrentCountryName}
        onAddMarker={addMarker}
        onSwapLocations={handleSwapLocations}
        onToggleMap={handleToggleMap}
        isMapVisible={showMap}
      />

      {showMap && (
        <section className="relative py-24 bg-black overflow-hidden animate-fade-in" id="map-section">
          {/* Background Effects - Exact Match to Hero */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div
              className="absolute inset-0 opacity-10 bg-cover bg-center bg-no-repeat transform scale-105 animate-subtle-zoom"
              style={{ backgroundImage: `url('/blogbg.jpg')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30" />
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_15%_50%,rgba(var(--primary),0.15),transparent_25%)]" />
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_85%_30%,rgba(var(--secondary),0.15),transparent_25%)]" />

            {/* Animated Particles */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                Live Coverage & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))]">Real-Time Traffic</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Explore our service areas and check live traffic conditions. We operate 24/7 across major airports and cities.
              </p>
            </div>

            {/* Map Wrapper */}
            <div className="relative">
              {/* Decorative Borders/Glows are handled inside MapComponent now, but we can add an outer glow too */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[rgb(var(--primary))]/10 via-[rgb(var(--secondary))]/10 to-[rgb(var(--primary))]/10 rounded-3xl blur-2xl -z-10" />

              <MapComponent
                center={mapCenter}
                zoom={mapZoom}
                markers={mapMarkers}
                route={mapRoute}
                userCountry={userCountry}
                pickupCoords={pickupCoords}
                dropoffCoords={dropoffCoords}
                distance={distance}
                unit={formData.unit}
                hasTraffic={hasTraffic}
                onLocationSelect={(lat: number, lng: number) => {
                  const activeElement = document.activeElement as HTMLInputElement;
                  const isPickup = activeElement?.name === 'pickup';
                  handleMapLocationSelect(lat, lng, isPickup || !activeElement?.name?.includes('dropoff'));
                }}
                onZoomChange={setMapZoom}
                onCenterChange={setMapCenter}
                onMapRouteChange={setMapRoute}
                getCurrentCountryName={getCurrentCountryName}
              />
            </div>
          </div>
        </section>
      )}

      <AboutSection />
      <ServicesSection />
      <ExperienceSection />
      <TaxiRates />
      <WhyChooseUs />

      <Testimonials />
      <BlogSection />
      <Footer />
    </>
  );
}