export interface SessionUser {
  id?: string;
  email?: string | null;
  role?: string | null;
  isActive?: boolean;
}

export interface LocationData {
  country: string;
  province: string;
  city: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface RentalPricing {
  rentPerMile: number;
  rentPerKm: number;
  currency: number; // CHANGED FROM string TO number
  conversionRate: number;
}

export interface DomainData {
  domainName: string;
  status: 'active' | 'inactive' | 'pending';
  expiryDate?: string;
  themeId?: string; // ADDED: Theme for specific domain
}

export interface DashboardData {
  location: LocationData;
  pricing: RentalPricing;
  domains: DomainData[];
  defaultTheme?: string; // ADDED: Global default theme
  lastUpdated: Date;
}

export interface Currency {
  id: number; // ADDED: This is needed now
  code: string;
  name: string;
  symbol: string;
}