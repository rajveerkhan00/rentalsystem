// Remove the currency array from here and import from currency-mapping
import { currencies, getCurrencyById, getCurrencySymbolById } from './currency-mapping';

// Re-export currency functions
export { currencies, getCurrencyById, getCurrencySymbolById };

// Clean domain name utility
export function cleanDomain(domain: string): string {
  if (!domain) return '';

  let cleaned = domain.trim();

  // Remove protocol (http://, https://)
  cleaned = cleaned.replace(/^https?:\/\//i, '');

  // Remove www. prefix
  cleaned = cleaned.replace(/^www\./i, '');

  // Remove trailing slash
  cleaned = cleaned.replace(/\/$/, '');

  // Remove port if present
  cleaned = cleaned.split(':')[0];

  return cleaned.toLowerCase();
}

// Calculate distance between two coordinates
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: 'km' | 'mile' = 'km'
): number {
  const R = unit === 'km' ? 6371 : 3956;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return parseFloat(distance.toFixed(2));
}

function toRad(value: number): number {
  return value * Math.PI / 180;
}

// Calculate rent based on distance and pricing
export function calculateRent(
  distance: number,
  pricing: any,
  unit: 'km' | 'mile'
): number {
  let rent = 0;

  if (unit === 'km') {
    rent = distance * (pricing?.rentPerKm || 1);
  } else {
    rent = distance * (pricing?.rentPerMile || 1.6);
  }

  // Apply currency conversion if needed
  if (pricing?.conversionRate && pricing.conversionRate !== 1) {
    rent *= pricing.conversionRate;
  }

  return parseFloat(rent.toFixed(2));
}

// Geocode address to coordinates with country filtering
export async function geocodeAddress(address: string, countryCode?: string) {
  try {
    let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;

    if (countryCode) {
      url += `&countrycodes=${countryCode.toLowerCase()}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RentCalculator/1.0'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        address: data[0].display_name
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Get country code from user's IP address
export async function getCountryCodeFromIP(): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    // Method 1: Using ipapi.co (free tier)
    const response = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return data.country_code || 'PK';
    }

    // Method 2: Using ipinfo.io (free tier)
    const controller2 = new AbortController();
    const timeoutId2 = setTimeout(() => controller2.abort(), 5000);
    const response2 = await fetch('https://ipinfo.io/json', { signal: controller2.signal });
    clearTimeout(timeoutId2);

    if (response2.ok) {
      const data = await response2.json();
      return data.country || 'PK';
    }

    return 'PK';
  } catch (error) {
    console.error('Error detecting country:', error);
    return 'PK';
  }
}

// Reverse geocode coordinates to address
export async function reverseGeocode(lat: number, lng: number) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'RentCalculator/1.0'
        },
        signal: controller.signal
      }
    );
    clearTimeout(timeoutId);

    const data = await response.json();

    if (data && data.display_name) {
      return data.display_name;
    }
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

// Search for location suggestions with country filtering
export async function searchLocationSuggestions(query: string, countryCode?: string) {
  if (query.length < 2) return [];

  try {
    let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1`;

    if (countryCode) {
      url += `&countrycodes=${countryCode.toLowerCase()}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RentCalculator/1.0'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await response.json();
    return data.map((item: any) => ({
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon,
      address: item.address
    }));
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
}

// Fetch domain data from API route
export async function fetchDomainPricing(domainName: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`/api/domain-pricing?domain=${encodeURIComponent(domainName)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Failed to fetch domain pricing');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching domain pricing:', error);
    return null;
  }
}

// Debounce function for search
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Country-specific default coordinates
export const COUNTRY_DEFAULTS: Record<string, { lat: number; lng: number; zoom: number }> = {
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