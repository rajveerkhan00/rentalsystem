// This file will be used by both admin and rent calculator
// Maps currency codes to numeric IDs

export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
}

export const currencies: Currency[] = [
  { id: 0, code: 'USD', name: 'United States Dollar', symbol: '$' },
  { id: 1, code: 'EUR', name: 'Euro', symbol: '€' },
  { id: 2, code: 'GBP', name: 'British Pound Sterling', symbol: '£' },
  { id: 3, code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { id: 4, code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { id: 5, code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { id: 6, code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { id: 7, code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { id: 8, code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { id: 9, code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' },
  { id: 10, code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { id: 11, code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { id: 12, code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { id: 13, code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { id: 14, code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { id: 15, code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { id: 16, code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { id: 17, code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  { id: 18, code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
  { id: 19, code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs' },
  { id: 20, code: 'NPR', name: 'Nepalese Rupee', symbol: '₨' },
  { id: 21, code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { id: 22, code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { id: 23, code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { id: 24, code: 'QAR', name: 'Qatari Riyal', symbol: '﷼' },
  { id: 25, code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك' },
  { id: 26, code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب' },
  { id: 27, code: 'OMR', name: 'Omani Rial', symbol: '﷼' },
  { id: 28, code: 'ILS', name: 'Israeli New Shekel', symbol: '₪' },
  { id: 29, code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { id: 30, code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { id: 31, code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { id: 32, code: 'EGP', name: 'Egyptian Pound', symbol: '£' },
  { id: 33, code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { id: 34, code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵' },
  { id: 35, code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.' },
  { id: 36, code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت' },
  { id: 37, code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { id: 38, code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { id: 39, code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { id: 40, code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { id: 41, code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
  { id: 42, code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
  { id: 43, code: 'RON', name: 'Romanian Leu', symbol: 'lei' },
  { id: 44, code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв' },
  { id: 45, code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { id: 46, code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴' },
  { id: 47, code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { id: 48, code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { id: 49, code: 'ARS', name: 'Argentine Peso', symbol: '$' },
  { id: 50, code: 'CLP', name: 'Chilean Peso', symbol: '$' },
  { id: 51, code: 'COP', name: 'Colombian Peso', symbol: '$' },
  { id: 52, code: 'PEN', name: 'Peruvian Sol', symbol: 'S/' },
  { id: 53, code: 'UYU', name: 'Uruguayan Peso', symbol: '$U' },
  { id: 54, code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs.' },
  { id: 55, code: 'IRR', name: 'Iranian Rial', symbol: '﷼' },
  { id: 56, code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د' },
  { id: 57, code: 'AFN', name: 'Afghan Afghani', symbol: '؋' },
  { id: 58, code: 'MMK', name: 'Myanmar Kyat', symbol: 'Ks' },
  { id: 59, code: 'KHR', name: 'Cambodian Riel', symbol: '៛' },
  { id: 60, code: 'LAK', name: 'Lao Kip', symbol: '₭' },
  { id: 61, code: 'MNT', name: 'Mongolian Tugrik', symbol: '₮' },
];

// Helper functions
export function getCurrencyById(id: number): Currency {
  return currencies.find(c => c.id === id) || currencies[0]; // Default to USD if not found
}

export function getCurrencyByCode(code: string): Currency | undefined {
  return currencies.find(c => c.code === code);
}

export function getCurrencyIdByCode(code: string): number {
  const currency = getCurrencyByCode(code);
  return currency ? currency.id : 0; // Default to USD (0) if not found
}

export function getCurrencyCodeById(id: number): string {
  const currency = getCurrencyById(id);
  return currency.code;
}

export function getCurrencySymbolById(id: number): string {
  const currency = getCurrencyById(id);
  return currency.symbol;
}