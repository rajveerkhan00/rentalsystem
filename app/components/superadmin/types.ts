export type Admin = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  createdBy?: string;
};

export type Domain = {
  _id: string;
  domainName: string;
  status: 'active' | 'inactive' | 'pending';
  expiryDate: string;
  adminId: string;
  adminEmail: string;
  adminName?: string; // Add admin name
  adminLocation?: {
    country: string;
    city: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type NewAdmin = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};