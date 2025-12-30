
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

export interface SiteContent {
  websiteName: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  workingHours: string;
}

export interface BlogPost {
  _id?: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  slug: string;
  domainName: string;
}

export interface DomainData {
  domainName: string;
  status: 'active' | 'inactive' | 'pending';
  expiryDate?: string;
  themeId?: string; // ADDED: Theme for specific domain
  pricing?: RentalPricing; // ADDED: Pricing specific to this domain
  siteContent?: SiteContent; // ADDED: Site content specific to this domain
}

export interface DashboardData {
  location: LocationData;
  pricing: RentalPricing;
  siteContent?: SiteContent; // ADDED: Global default site content
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