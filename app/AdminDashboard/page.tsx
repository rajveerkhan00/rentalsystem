'use client';

import { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import the OSM map
const OSMMap = dynamic(() => import('@/app/components/OSMMap'), {
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
  currency: string;
  conversionRate: number;
}

interface DomainData {
  domainName: string;
  status: 'active' | 'inactive' | 'pending';
  expiryDate?: string;
}

interface DashboardData {
  location: LocationData;
  pricing: RentalPricing;
  domains: DomainData[];
  lastUpdated: Date;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [domainError, setDomainError] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
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
      currency: 'USD',
      conversionRate: 1
    },
    domains: [],
    lastUpdated: new Date()
  });
  
  // New domain state
  const [newDomain, setNewDomain] = useState<string>('');
  
  // Currency options
 const currencies: Currency[] = [
  { code: 'USD', name: 'United States Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound Sterling', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },

  // Asia
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs' },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: '₨' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },

  // Middle East
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: '﷼' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب' },
  { code: 'OMR', name: 'Omani Rial', symbol: '﷼' },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },

  // Africa
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.' },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت' },

  // Europe (non-euro)
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei' },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴' },

  // Americas
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/' },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U' },
  { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs.' },

  // Others
  { code: 'IRR', name: 'Iranian Rial', symbol: '﷼' },
  { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د' },
  { code: 'AFN', name: 'Afghan Afghani', symbol: '؋' },
  { code: 'MMK', name: 'Myanmar Kyat', symbol: 'Ks' },
  { code: 'KHR', name: 'Cambodian Riel', symbol: '៛' },
  { code: 'LAK', name: 'Lao Kip', symbol: '₭' },
  { code: 'MNT', name: 'Mongolian Tugrik', symbol: '₮' },
];


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
              setDashboardData({
                ...data,
                lastUpdated: new Date(data.lastUpdated)
              });
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
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    
    setDashboardData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: numValue
      }
    }));
    
    // Auto-calculate conversion between mile and km based on 1 km = $1, 1 mile = $1.6
    if (field === 'rentPerMile') {
      // Convert mile to km: 1 mile = 1.60934 km
      // If rent per mile is $1.6, then rent per km should be $1
      const kmValue = numValue / 1.6;
      setDashboardData(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          rentPerKm: parseFloat(kmValue.toFixed(2))
        }
      }));
    } else if (field === 'rentPerKm') {
      // Convert km to mile: 1 km = 0.621371 mile
      // If rent per km is $1, then rent per mile should be $1.6
      const mileValue = numValue * 1.6;
      setDashboardData(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          rentPerMile: parseFloat(mileValue.toFixed(2))
        }
      }));
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
  };

  const handleSaveData = async (): Promise<void> => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      setDomainError('');
      
      const response = await fetch('/api/admin/dashboard-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dashboardData,
          lastUpdated: new Date()
        })
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
      <Header
        user={user}
        dashboardData={dashboardData}
        saving={saving}
        onSave={handleSaveData}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(error || success) && (
          <div className={`mb-6 p-4 rounded-lg ${error ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
            <div className="flex items-center">
              {error ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{success}</span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LocationManagement
            location={dashboardData.location}
            searchQuery={searchQuery}
            loading={loading}
            onSearchQueryChange={setSearchQuery}
            onSearch={handleLocationSearch}
            onLocationChange={handleLocationChange}
            onMapClick={handleMapClick}
          />

          <RentalPricing
            pricing={dashboardData.pricing}
            currencies={currencies}
            onPricingChange={handlePricingChange}
          />

          <DomainManagement
            domains={dashboardData.domains}
            newDomain={newDomain}
            onNewDomainChange={setNewDomain}
            onAddDomain={handleAddDomain}
            onRemoveDomain={handleRemoveDomain}
            onKeyPress={handleKeyPress}
            domainError={domainError}
            onClearDomainError={handleClearDomainError}
            checkingDomain={loading}
          />
        </div>

        <InfoPanel pricing={dashboardData.pricing} />
      </main>
    </div>
  );
}