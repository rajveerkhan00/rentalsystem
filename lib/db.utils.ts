// Currency mapping based on your provided list with IDs
export const currencies = [
  // USD = 0
  { id: 0, code: 'USD', name: 'United States Dollar', symbol: '$' },
  // EUR = 1
  { id: 1, code: 'EUR', name: 'Euro', symbol: '€' },
  // GBP = 2
  { id: 2, code: 'GBP', name: 'British Pound Sterling', symbol: '£' },
  // JPY = 3
  { id: 3, code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  // CHF = 4
  { id: 4, code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  // CAD = 5
  { id: 5, code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  // AUD = 6
  { id: 6, code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  // NZD = 7
  { id: 7, code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  // INR = 8
  { id: 8, code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  // PKR = 9
  { id: 9, code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' },
  // CNY = 10
  { id: 10, code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  // HKD = 11
  { id: 11, code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  // SGD = 12
  { id: 12, code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  // KRW = 13
  { id: 13, code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  // IDR = 14
  { id: 14, code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  // MYR = 15
  { id: 15, code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  // THB = 16
  { id: 16, code: 'THB', name: 'Thai Baht', symbol: '฿' },
  // VND = 17
  { id: 17, code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  // BDT = 18
  { id: 18, code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
  // LKR = 19
  { id: 19, code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs' },
  // NPR = 20
  { id: 20, code: 'NPR', name: 'Nepalese Rupee', symbol: '₨' },
  // PHP = 21
  { id: 21, code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  // AED = 22
  { id: 22, code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  // SAR = 23
  { id: 23, code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  // QAR = 24
  { id: 24, code: 'QAR', name: 'Qatari Riyal', symbol: '﷼' },
  // KWD = 25
  { id: 25, code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك' },
  // BHD = 26
  { id: 26, code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب' },
  // OMR = 27
  { id: 27, code: 'OMR', name: 'Omani Rial', symbol: '﷼' },
  // ILS = 28
  { id: 28, code: 'ILS', name: 'Israeli New Shekel', symbol: '₪' },
  // TRY = 29
  { id: 29, code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  // ZAR = 30
  { id: 30, code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  // NGN = 31
  { id: 31, code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  // EGP = 32
  { id: 32, code: 'EGP', name: 'Egyptian Pound', symbol: '£' },
  // KES = 33
  { id: 33, code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  // GHS = 34
  { id: 34, code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵' },
  // MAD = 35
  { id: 35, code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.' },
  // TND = 36
  { id: 36, code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت' },
  // SEK = 37
  { id: 37, code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  // NOK = 38
  { id: 38, code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  // DKK = 39
  { id: 39, code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  // PLN = 40
  { id: 40, code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  // CZK = 41
  { id: 41, code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
  // HUF = 42
  { id: 42, code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
  // RON = 43
  { id: 43, code: 'RON', name: 'Romanian Leu', symbol: 'lei' },
  // BGN = 44
  { id: 44, code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв' },
  // RUB = 45
  { id: 45, code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  // UAH = 46
  { id: 46, code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴' },
  // MXN = 47
  { id: 47, code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  // BRL = 48
  { id: 48, code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  // ARS = 49
  { id: 49, code: 'ARS', name: 'Argentine Peso', symbol: '$' },
  // CLP = 50
  { id: 50, code: 'CLP', name: 'Chilean Peso', symbol: '$' },
  // COP = 51
  { id: 51, code: 'COP', name: 'Colombian Peso', symbol: '$' },
  // PEN = 52
  { id: 52, code: 'PEN', name: 'Peruvian Sol', symbol: 'S/' },
  // UYU = 53
  { id: 53, code: 'UYU', name: 'Uruguayan Peso', symbol: '$U' },
  // BOB = 54
  { id: 54, code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs.' },
  // IRR = 55
  { id: 55, code: 'IRR', name: 'Iranian Rial', symbol: '﷼' },
  // IQD = 56
  { id: 56, code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د' },
  // AFN = 57
  { id: 57, code: 'AFN', name: 'Afghan Afghani', symbol: '؋' },
  // MMK = 58
  { id: 58, code: 'MMK', name: 'Myanmar Kyat', symbol: 'Ks' },
  // KHR = 59
  { id: 59, code: 'KHR', name: 'Cambodian Riel', symbol: '៛' },
  // LAK = 60
  { id: 60, code: 'LAK', name: 'Lao Kip', symbol: '₭' },
  // MNT = 61
  { id: 61, code: 'MNT', name: 'MongoTugrik', symbol: '₮' },
];

// Get currency symbol by ID (for database currency field)
export function getCurrencySymbolById(currencyId: number): string {
  const currency = currencies.find(c => c.id === currencyId);
  return currency ? currency.symbol : '$';
}

// Get full currency info by ID
export function getCurrencyById(currencyId: number) {
  return currencies.find(c => c.id === currencyId) || currencies[0];
}

// Get currency by code
export function getCurrencyByCode(code: string) {
  return currencies.find(c => c.code === code) || currencies[0];
}

// Universal currency symbol getter
export function getCurrencySymbol(currencyIdentifier: number | string): string {
  if (typeof currencyIdentifier === 'number') {
    return getCurrencySymbolById(currencyIdentifier);
  } else {
    return getCurrencyByCode(currencyIdentifier).symbol;
  }
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