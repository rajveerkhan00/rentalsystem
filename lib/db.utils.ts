// Remove MongoDB imports from here since this will be used client-side
// Only keep pure calculation and geocoding functions

// Calculate distance between two coordinates
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: 'km' | 'mile' = 'km'
): number {
  const R = unit === 'km' ? 6371 : 3956; // Radius in km or miles
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
    rent = distance * (pricing?.rentPerKm || 1); // Default $1 per km
  } else {
    rent = distance * (pricing?.rentPerMile || 1.6); // Default $1.6 per mile
  }
  
  // Apply currency conversion if needed
  if (pricing?.conversionRate && pricing.conversionRate !== 1) {
    rent *= pricing.conversionRate;
  }
  
  return parseFloat(rent.toFixed(2));
}

// Geocode address to coordinates (using Nominatim - OpenStreetMap)
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

// Get currency symbol based on currency code
export function getCurrencySymbol(currencyCode: number): string {
  const currencies: { [key: number]: string } = {
    0: '$', // USD
    1: '€', // EUR
    2: '£', // GBP
    3: '₹', // INR
    4: '₨', // PKR
    5: '¥', // JPY
    6: '₣', // CHF
    7: 'CA$', // CAD
    8: 'A$', // AUD
    9: 'R$', // BRL
    10: '元' // CNY
  };
  return currencies[currencyCode] || '$';
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