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
  currency: string;
  conversionRate: number;
}

export interface DomainData {
  domainName: string;
  status: 'active' | 'inactive' | 'pending';
  expiryDate?: string;
}

export interface DashboardData {
  location: LocationData;
  pricing: RentalPricing;
  domains: DomainData[];
  lastUpdated: Date;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}