export type ListingCondition = 'New' | 'Good' | 'Acceptable' | 'Poor' | number;
export type ListingType = 'ForSale' | 'ForExchange' | number;
export type ListingStatus = 'Available' | 'Sold' | 'Exchanged' | 'Unavailable' | number;
export type ContactRequestStatus = 'Pending' | 'Accepted' | 'Rejected' | number;

export interface AuthResponse {
  userId: string;
  email: string;
  displayName: string;
  roles: string[];
  accessToken: string;
  expiresAt: string;
  refreshToken?: string | null;
}

export interface CurrentUser {
  userId: string;
  email: string;
  displayName: string;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface RefreshTokenRequest {
  userId: string;
  refreshToken: string;
}

export interface Listing {
  id: string;
  ownerId: string;
  title: string;
  author: string;
  category: string;
  condition: ListingCondition;
  description: string;
  listingType: ListingType;
  status: ListingStatus;
  price?: number | null;
  imageUrls?: string[];
  createdAt: string;
  updatedAt?: string | null;
}

export interface ListingSearchParams {
  term?: string;
  condition?: ListingCondition;
  listingType?: ListingType;
  minPrice?: number;
  maxPrice?: number;
}

export interface ListingFormRequest {
  title: string;
  author: string;
  category: string;
  condition: ListingCondition;
  description: string;
  listingType: ListingType;
  status: ListingStatus;
  price?: number | null;
  imageUrls?: string[];
}

export interface UploadImageResponse {
  url: string;
}

export interface AdminDashboard {
  totalUsers: number;
  totalListings: number;
  totalCategories: number;
  totalRequests: number;
  activeListings: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string | null;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string | null;
}

export interface ContactRequest {
  id: string;
  listingId: string;
  requesterId: string;
  ownerId: string;
  status: ContactRequestStatus;
  message?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface SendContactRequest {
  listingId: string;
  message?: string | null;
}

export const LISTING_CONDITIONS: ListingCondition[] = ['New', 'Good', 'Acceptable', 'Poor'];
export const LISTING_TYPES: ListingType[] = ['ForSale', 'ForExchange'];
export const LISTING_STATUSES: ListingStatus[] = ['Available', 'Sold', 'Exchanged', 'Unavailable'];
