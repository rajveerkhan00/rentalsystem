// Remove the currency array from here and import from currency-mapping
import { currencies, getCurrencyById, getCurrencySymbolById } from './currency-mapping';

// Re-export currency functions
export { currencies, getCurrencyById, getCurrencySymbolById };

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
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
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

// Geocode address to coordinates
export async function geocodeAddress(address: string) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'User-Agent': 'RentCalculator/1.0'
        }
      }
    );
    
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

// Reverse geocode coordinates to address
export async function reverseGeocode(lat: number, lng: number) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'RentCalculator/1.0'
        }
      }
    );
    
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

// Search for location suggestions
export async function searchLocationSuggestions(query: string) {
  if (query.length < 3) return [];
  
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
    return data || [];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
}

// Fetch domain data from API route
export async function fetchDomainPricing(domainName: string) {
  try {
    const response = await fetch(`/api/domain-pricing?domain=${encodeURIComponent(domainName)}`);
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