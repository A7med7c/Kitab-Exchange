import { HttpClient, HttpEvent, HttpEventType, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  AdminDashboard,
  Category,
  ContactRequest,
  CreateCategoryRequest,
  Listing,
  ListingFormRequest,
  ListingSearchParams,
  SendContactRequest,
  UpdateCategoryRequest,
  UploadImageResponse
} from '../../shared/models/api.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.baseUrl}/Listings`).pipe(
      map(listings => listings.map(this.mapListingToClient))
    );
  }

  getMyListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.baseUrl}/Listings/mine`).pipe(
      map(listings => listings.map(this.mapListingToClient))
    );
  }

  searchListings(params: ListingSearchParams): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.baseUrl}/Listings/search`, {
      params: this.toParams(params)
    }).pipe(
      map(listings => listings.map(this.mapListingToClient))
    );
  }

  getListing(id: string): Observable<Listing> {
    return this.http.get<Listing>(`${this.baseUrl}/Listings/${id}`).pipe(
      map(this.mapListingToClient)
    );
  }

  createListing(request: ListingFormRequest): Observable<Listing> {
    return this.http.post<Listing>(`${this.baseUrl}/Listings`, this.mapListingToServer(request)).pipe(
      map(this.mapListingToClient)
    );
  }

  updateListing(id: string, request: ListingFormRequest): Observable<Listing> {
    return this.http.put<Listing>(`${this.baseUrl}/Listings/${id}`, { ...this.mapListingToServer(request), id }).pipe(
      map(this.mapListingToClient)
    );
  }

  deleteListing(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Listings/${id}`);
  }

  uploadListingImage(file: File): Observable<HttpEvent<UploadImageResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UploadImageResponse>(`${this.baseUrl}/Listings/upload-image`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/Categories`);
  }

  createCategory(request: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/Categories`, request);
  }

  updateCategory(id: string, request: UpdateCategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/Categories/${id}`, { ...request, id });
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Categories/${id}`);
  }

  getAdminDashboard(): Observable<AdminDashboard> {
    return this.http.get<AdminDashboard>(`${this.baseUrl}/Admin/dashboard`);
  }

  getIncomingContactRequests(): Observable<ContactRequest[]> {
    return this.http.get<ContactRequest[]>(`${this.baseUrl}/ContactRequests/incoming`).pipe(
      map(requests => requests.map(this.mapContactRequestToClient))
    );
  }

  getOutgoingContactRequests(): Observable<ContactRequest[]> {
    return this.http.get<ContactRequest[]>(`${this.baseUrl}/ContactRequests/outgoing`).pipe(
      map(requests => requests.map(this.mapContactRequestToClient))
    );
  }

  sendContactRequest(request: SendContactRequest): Observable<ContactRequest> {
    return this.http.post<ContactRequest>(`${this.baseUrl}/ContactRequests`, request).pipe(
      map(this.mapContactRequestToClient)
    );
  }

  acceptContactRequest(id: string): Observable<ContactRequest> {
    return this.http.post<ContactRequest>(`${this.baseUrl}/ContactRequests/${id}/accept`, {}).pipe(
      map(this.mapContactRequestToClient)
    );
  }

  rejectContactRequest(id: string): Observable<ContactRequest> {
    return this.http.post<ContactRequest>(`${this.baseUrl}/ContactRequests/${id}/reject`, {}).pipe(
      map(this.mapContactRequestToClient)
    );
  }

  resolveAssetUrl(url: string): string {
    if (!url) {
      return url;
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    return `${environment.assetsBaseUrl}${url.startsWith('/') ? url : `/${url}`}`;
  }

  private mapListingToClient = (listing: any): Listing => {
    const conditionMap: Record<number, string> = { 1: 'New', 2: 'Good', 3: 'Acceptable', 4: 'Poor' };
    const typeMap: Record<number, string> = { 1: 'ForSale', 2: 'ForExchange' };
    const statusMap: Record<number, string> = { 1: 'Available', 2: 'Sold', 3: 'Exchanged', 4: 'Unavailable' };

    return {
      ...listing,
      condition: typeof listing.condition === 'number' ? (conditionMap[listing.condition] || 'Good') : listing.condition,
      listingType: typeof listing.listingType === 'number' ? (typeMap[listing.listingType] || 'ForExchange') : listing.listingType,
      status: typeof listing.status === 'number' ? (statusMap[listing.status] || 'Available') : listing.status,
    } as Listing;
  };

  private mapContactRequestToClient = (request: any): ContactRequest => {
    const statusMap: Record<number, string> = { 1: 'Pending', 2: 'Accepted', 3: 'Rejected' };
    const typeMap: Record<number, string> = { 1: 'Contact', 2: 'Exchange' };
    return {
      ...request,
      status: typeof request.status === 'number' ? (statusMap[request.status] || 'Pending') : request.status,
      requestType: typeof request.requestType === 'number' ? (typeMap[request.requestType] || 'Contact') : request.requestType
    } as ContactRequest;
  };

  private mapListingToServer = (request: ListingFormRequest): any => {
    const conditionMap: Record<string, number> = { 'New': 1, 'Good': 2, 'Acceptable': 3, 'Poor': 4 };
    const typeMap: Record<string, number> = { 'ForSale': 1, 'ForExchange': 2 };
    const statusMap: Record<string, number> = { 'Available': 1, 'Sold': 2, 'Exchanged': 3, 'Unavailable': 4 };

    return {
      ...request,
      condition: typeof request.condition === 'string' ? (conditionMap[request.condition] || 2) : request.condition,
      listingType: typeof request.listingType === 'string' ? (typeMap[request.listingType] || 2) : request.listingType,
      status: typeof request.status === 'string' ? (statusMap[request.status] || 1) : request.status,
    };
  };

  private toParams(params: ListingSearchParams): HttpParams {
    const conditionMap: Record<string, number> = { 'New': 1, 'Good': 2, 'Acceptable': 3, 'Poor': 4 };
    const typeMap: Record<string, number> = { 'ForSale': 1, 'ForExchange': 2 };

    return Object.entries(params).reduce((httpParams, [key, value]) => {
      if (value === undefined || value === null || value === '') {
        return httpParams;
      }

      let finalValue = value;
      if (key === 'condition' && typeof value === 'string') {
        finalValue = conditionMap[value] || 2;
      }
      if (key === 'listingType' && typeof value === 'string') {
        finalValue = typeMap[value] || 2;
      }

      return httpParams.set(key, String(finalValue));
    }, new HttpParams());
  }
}
