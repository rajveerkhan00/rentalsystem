'use client';

import { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import the TomTom map
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

// Import your components
import Header from '@/app/components/admin/Header';
import MessageAlert from '@/app/components/admin/MessageAlert';
import LoadingSpinner from '@/app/components/admin/LoadingSpinner';
import LocationManagement from '@/app/components/admin/LocationManagement';
import RentalPricing from '@/app/components/admin/RentalPricing';
import DomainManagement from '@/app/components/admin/DomainManagement';
import InfoPanel from '@/app/components/admin/InfoPanel';
import BlogManagement from '@/app/components/admin/BlogManagement';
import SiteContentManagement from '@/app/components/admin/SiteContentManagement';

// Import the shared currency mapping
import { currencies, getCurrencyById, getCurrencyCodeById } from '@/lib/currency-mapping';
import { useTheme } from '../components/ThemeProvider';
import { SiteContent } from '@/app/components/admin/types'; // Import SiteContent

// Type definitions
interface SessionUser {
  id?: string;
  email?: string | null;
  role?: string | null;
  isActive?: boolean;
}

interface LocationData {
  country: string;
  province: string;
  city: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface RentalPricing {
  rentPerMile: number;
  rentPerKm: number;
  currency: number;
  conversionRate: number;
}

interface DomainData {
  domainName: string;
  status: 'active' | 'inactive' | 'pending';
  expiryDate?: string;
  themeId?: string;
  pricing?: RentalPricing;
  siteContent?: SiteContent; // ADDED
}

interface DashboardData {
  location: LocationData;
  pricing: RentalPricing;
  siteContent?: SiteContent; // ADDED
  domains: DomainData[];
  defaultTheme?: string;
  lastUpdated: Date;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { setTheme } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [domainError, setDomainError] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'location' | 'pricing' | 'site' | 'domain' | 'blog'>('location');

  // State for selecting which domain's pricing to edit (-1 means Global/Default)
  const [selectedPricingDomainIndex, setSelectedPricingDomainIndex] = useState<number>(-1);
  // State for selecting which domain's content to edit
  const [selectedContentDomainIndex, setSelectedContentDomainIndex] = useState<number>(-1);

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    location: {
      country: '',
      province: '',
      city: '',
      address: '',
      coordinates: { lat: 30.67, lng: 69.36 }
    },
    pricing: {
      rentPerMile: 1.6,
      rentPerKm: 1.0,
      currency: 0,
      conversionRate: 1
    },
    siteContent: {
      websiteName: 'Mr Transfers',
      heroTitle: 'Ride with',
      heroSubtitle: 'No.1 UK Airport Transfers',
      contactEmail: 'info@mrtransfers.co.uk',
      contactPhone: '+44 123 456 789',
      workingHours: 'Mon - Sun: 24/7'
    },
    domains: [],
    lastUpdated: new Date()
  });

  // New domain state
  const [newDomain, setNewDomain] = useState<string>('');

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === 'loading') return; // Don't do anything while loading

    if (status === 'unauthenticated') {
      console.log('User not authenticated, redirecting to login');
      router.push('/AdminLogin');
      return;
    }

    if (status === 'authenticated') {
      const user = session?.user as SessionUser;
      if (user?.role !== 'admin') {
        console.log('User not admin, redirecting to super login');
        router.push('/SuperLogin');
        return;
      }
    }
  }, [status, session, router]);

  // Load existing data
  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated' && (session?.user as SessionUser)?.role === 'admin') {
        // Check if we've already initialized to prevent repeated fetching
        if (!isInitialized) {
          try {
            setLoading(true);
            const response = await fetch('/api/admin/dashboard-data');

            if (response.ok) {
              const data = await response.json();

              // Convert currency from string to number if needed (for backward compatibility)
              const pricingData = data.pricing || {};
              let currencyValue = pricingData.currency || 0;

              // If currency is a string (from old data), convert it to number ID
              if (typeof currencyValue === 'string') {
                const currencyObj = currencies.find(c => c.code === currencyValue);
                currencyValue = currencyObj ? currencyObj.id : 0;
              }

              // Also ensure domain specific currency data is correct if present
              const processedDomains = (data.domains || []).map((d: any) => {
                let dPricing = d.pricing;
                if (dPricing) {
                  let dCurrency = dPricing.currency || 0;
                  if (typeof dCurrency === 'string') {
                    const dCurrencyObj = currencies.find(c => c.code === dCurrency);
                    dCurrency = dCurrencyObj ? dCurrencyObj.id : 0;
                  }
                  dPricing = {
                    ...dPricing,
                    currency: dCurrency
                  };
                }
                return {
                  ...d,
                  pricing: dPricing,
                  siteContent: d.siteContent // Ensure siteContent is passed through
                };
              });

              setDashboardData({
                location: data.location || {
                  country: '',
                  province: '',
                  city: '',
                  address: '',
                  coordinates: { lat: 30.67, lng: 69.36 }
                },
                pricing: {
                  rentPerMile: pricingData.rentPerMile || 1.6,
                  rentPerKm: pricingData.rentPerKm || 1.0,
                  currency: currencyValue,
                  conversionRate: pricingData.conversionRate || 1
                },
                siteContent: data.siteContent || {
                  websiteName: 'Mr Transfers',
                  heroTitle: 'Ride with',
                  heroSubtitle: 'No.1 UK Airport Transfers',
                  contactEmail: 'info@mrtransfers.co.uk',
                  contactPhone: '+44 123 456 789',
                  workingHours: 'Mon - Sun: 24/7'
                },
                domains: processedDomains,
                defaultTheme: data.defaultTheme || 'default',
                lastUpdated: new Date(data.lastUpdated || new Date())
              });

              if (data.defaultTheme) {
                setTheme(data.defaultTheme);
              }
            }
            setIsInitialized(true); // Mark as initialized
          } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError('Failed to load dashboard data');
          } finally {
            setLoading(false);
          }
        }
      }
    };

    fetchData();
  }, [status, session, isInitialized]);

  const handleLocationSearch = async (): Promise<void> => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      // Use OpenStreetMap Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );

      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const address = result.display_name;

        // Parse address components
        const addressParts = address.split(', ');
        const country = addressParts[addressParts.length - 1] || '';
        const province = addressParts[addressParts.length - 2] || '';
        const city = addressParts[0] || '';

        setDashboardData(prev => ({
          ...prev,
          location: {
            country,
            province,
            city,
            address,
            coordinates: {
              lat: parseFloat(result.lat),
              lng: parseFloat(result.lon)
            }
          }
        }));

        setSuccess('Location found!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Location not found. Please try another search.');
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      setError('Failed to search location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePricingChange = (field: keyof RentalPricing, value: string | number): void => {
    let processedValue: any = value;

    // Handle currency field specifically
    if (field === 'currency') {
      processedValue = typeof value === 'string' ? parseInt(value) || 0 : value;
    } else {
      processedValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    }

    if (selectedPricingDomainIndex === -1) {
      // Global/Default Pricing Update
      setDashboardData(prev => {
        const newPricing = {
          ...prev.pricing,
          [field]: processedValue
        };

        // Auto-calculate conversion between mile and km based on current relationship 
        if (field === 'rentPerMile') {
          const kmValue = processedValue / 1.6;
          newPricing.rentPerKm = parseFloat(kmValue.toFixed(2));
        } else if (field === 'rentPerKm') {
          const mileValue = processedValue * 1.6;
          newPricing.rentPerMile = parseFloat(mileValue.toFixed(2));
        }

        return {
          ...prev,
          pricing: newPricing
        };
      });
    } else {
      // Specific Domain Pricing Update
      setDashboardData(prev => {
        const updatedDomains = [...prev.domains];
        const domain = updatedDomains[selectedPricingDomainIndex];

        // Take existing domain pricing OR fallback to global/prev pricing to start with
        const currentDomainPricing = domain.pricing ? { ...domain.pricing } : { ...prev.pricing };

        const newPricing = {
          ...currentDomainPricing,
          [field]: processedValue
        };

        // Keep the sync logic
        if (field === 'rentPerMile') {
          const kmValue = processedValue / 1.6;
          newPricing.rentPerKm = parseFloat(kmValue.toFixed(2));
        } else if (field === 'rentPerKm') {
          const mileValue = processedValue * 1.6;
          newPricing.rentPerMile = parseFloat(mileValue.toFixed(2));
        }

        updatedDomains[selectedPricingDomainIndex] = {
          ...domain,
          pricing: newPricing
        };

        return {
          ...prev,
          domains: updatedDomains
        };
      });
    }
  };

  const handleContentChange = (field: keyof SiteContent, value: string): void => {
    if (selectedContentDomainIndex === -1) {
      // Global Update
      setDashboardData(prev => ({
        ...prev,
        siteContent: {
          ...prev.siteContent!,
          [field]: value
        }
      }));
    } else {
      // Domain Update
      setDashboardData(prev => {
        const updatedDomains = [...prev.domains];
        const domain = updatedDomains[selectedContentDomainIndex];

        // Ensure siteContent exists or fallback to global/default
        const currentContent = domain.siteContent ? { ...domain.siteContent } : { ...prev.siteContent! };

        const newContent = {
          ...currentContent,
          [field]: value
        };

        updatedDomains[selectedContentDomainIndex] = {
          ...domain,
          siteContent: newContent
        };

        return {
          ...prev,
          domains: updatedDomains
        };
      });
    }
  };

  const handleLocationChange = (field: keyof Omit<LocationData, 'coordinates'>, value: string): void => {
    setDashboardData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handleMapClick = (lat: number, lng: number): void => {
    setDashboardData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: { lat, lng }
      }
    }));
  };

  const handleAddDomain = async (): Promise<boolean> => {
    if (!newDomain.trim()) {
      setDomainError('Please enter a domain name');
      return false;
    }

    // Basic domain validation
    const domainPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
    if (!domainPattern.test(newDomain.trim())) {
      setDomainError('Please enter a valid domain name (e.g., example.com)');
      return false;
    }

    // Check if domain already exists in local state (case insensitive)
    const domainExistsLocal = dashboardData.domains.some(domain =>
      domain.domainName.toLowerCase() === newDomain.trim().toLowerCase()
    );

    if (domainExistsLocal) {
      setDomainError('This domain already exists in your list');
      return false;
    }

    // Check if domain exists in the database (for any user)
    try {
      setLoading(true);
      const response = await fetch('/api/admin/check-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainName: newDomain.trim() })
      });

      const data = await response.json();

      if (data.exists) {
        setDomainError(`Domain "${newDomain.trim()}" is already registered by another user`);
        return false;
      }

      // Clear any errors
      setDomainError('');
      setError('');

      // Add the domain
      const domainData: DomainData = {
        domainName: newDomain.trim(),
        status: 'pending',
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      };

      setDashboardData(prev => ({
        ...prev,
        domains: [...prev.domains, domainData]
      }));

      setNewDomain('');
      return true;

    } catch (err) {
      console.error('Error checking domain:', err);
      setDomainError('Failed to verify domain availability. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDomain = (index: number): void => {
    setDashboardData(prev => ({
      ...prev,
      domains: prev.domains.filter((_, i) => i !== index)
    }));
    // If we removed the currently selected domain, reset selection to Global
    if (selectedPricingDomainIndex === index) {
      setSelectedPricingDomainIndex(-1);
    } else if (selectedPricingDomainIndex > index) {
      setSelectedPricingDomainIndex(prev => prev - 1);
    }
    // Same for content
    if (selectedContentDomainIndex === index) {
      setSelectedContentDomainIndex(-1);
    } else if (selectedContentDomainIndex > index) {
      setSelectedContentDomainIndex(prev => prev - 1);
    }
  };

  const handleSaveData = async (): Promise<void> => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      setDomainError('');

      // Prepare data for saving
      const dataToSave = {
        ...dashboardData,
        lastUpdated: new Date()
      };

      const response = await fetch('/api/admin/dashboard-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save data');
      }

      setSuccess('Dashboard data saved successfully!');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    await signOut({ redirect: false });
    router.push('/AdminLogin');
  };

  const handleKeyPress = async (e: KeyboardEvent<HTMLInputElement>): Promise<void> => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await handleAddDomain();
    }
  };

  const handleClearDomainError = () => {
    setDomainError('');
  };

  const handleUpdateDomainTheme = (index: number, themeId: string) => {
    const updatedDomains = [...dashboardData.domains];
    updatedDomains[index] = { ...updatedDomains[index], themeId };
    setDashboardData(prev => ({ ...prev, domains: updatedDomains }));
    setSuccess('Theme updated for domain. Remember to save changes.');
  };

  const handleDefaultThemeChange = (themeId: string) => {
    setDashboardData(prev => ({ ...prev, defaultTheme: themeId }));
    setTheme(themeId); // UPDATE THEME IN REAL-TIME
    setSuccess('Global default theme updated. Remember to save changes.');
  };

  // Prevent infinite re-renders by checking session status
  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  const user = session?.user as SessionUser;

  // Check if user is authenticated and is admin
  if (status === 'unauthenticated' || !session || user?.role !== 'admin') {
    // Return null while redirect happens
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[rgb(var(--primary))]/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_15%_50%,rgba(var(--primary),0.1),transparent_25%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_85%_30%,rgba(var(--secondary),0.1),transparent_25%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10">
        <Header
          user={user}
          dashboardData={dashboardData}
          saving={saving}
          onSave={handleSaveData}
          onLogout={handleLogout}
          onDefaultThemeChange={handleDefaultThemeChange}
        />

        <main className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {(error || success) && (
            <div className={`mb-8 p-4 rounded-2xl backdrop-blur-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500 ${error
              ? 'bg-red-500/10 border-red-500/20 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
              }`}>
              <div className={`p-2 rounded-lg ${error ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
                {error ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="font-medium">{error || success}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-4 mb-8 p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md w-full overflow-x-auto">
            {[
              { id: 'location', label: 'Location Control', icon: '📍' },
              { id: 'pricing', label: 'Pricing Matrix', icon: '💰' },
              { id: 'site', label: 'Site Control', icon: '⚡' },
              { id: 'blog', label: 'Blog Manager', icon: '📝' },
              { id: 'domain', label: 'Domain Network', icon: '🌐' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white shadow-lg shadow-[rgb(var(--primary))]/20 scale-[1.02]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="transition-all duration-500 ease-in-out">
            {activeTab === 'location' && (
              <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <LocationManagement
                  location={dashboardData.location}
                  searchQuery={searchQuery}
                  loading={loading}
                  onSearchQueryChange={setSearchQuery}
                  onSearch={handleLocationSearch}
                  onLocationChange={handleLocationChange}
                  onMapClick={handleMapClick}
                  apiKey="YxbLh0enMQBXkiLMbuUc78T2ZLTaW6b6"
                />
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <RentalPricing
                  pricing={selectedPricingDomainIndex === -1
                    ? dashboardData.pricing
                    : (dashboardData.domains[selectedPricingDomainIndex]?.pricing || dashboardData.pricing)}
                  currencies={currencies}
                  onPricingChange={handlePricingChange}
                  domains={dashboardData.domains}
                  selectedDomainIndex={selectedPricingDomainIndex}
                  onDomainSelect={setSelectedPricingDomainIndex}
                />
                <InfoPanel
                  pricing={selectedPricingDomainIndex === -1
                    ? dashboardData.pricing
                    : (dashboardData.domains[selectedPricingDomainIndex]?.pricing || dashboardData.pricing)}
                  currencies={currencies}
                />
              </div>
            )}

            {activeTab === 'site' && (
              <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <SiteContentManagement
                  siteContent={selectedContentDomainIndex === -1
                    ? dashboardData.siteContent!
                    : (dashboardData.domains[selectedContentDomainIndex]?.siteContent || dashboardData.siteContent!)}
                  domains={dashboardData.domains}
                  selectedDomainIndex={selectedContentDomainIndex}
                  onDomainSelect={setSelectedContentDomainIndex}
                  onContentChange={handleContentChange}
                />
              </div>
            )}

            {activeTab === 'blog' && (
              <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <BlogManagement domains={dashboardData.domains} />
              </div>
            )}

            {activeTab === 'domain' && (
              <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <DomainManagement
                  domains={dashboardData.domains}
                  newDomain={newDomain}
                  onNewDomainChange={setNewDomain}
                  onAddDomain={handleAddDomain}
                  onRemoveDomain={handleRemoveDomain}
                  onUpdateDomainTheme={handleUpdateDomainTheme}
                  onKeyPress={handleKeyPress}
                  domainError={domainError}
                  onClearDomainError={handleClearDomainError}
                  checkingDomain={loading}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}