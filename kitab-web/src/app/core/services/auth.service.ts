import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, Observable, tap, throwError } from 'rxjs';

import { AuthResponse, CurrentUser, LoginRequest, RegisterRequest } from '../../shared/models/api.models';
import { LOCAL_STORAGE } from '../tokens/storage.token';
import { ApiAuthClient } from './api-auth.client';

const TOKEN_KEY = 'kitab.accessToken';
const REFRESH_TOKEN_KEY = 'kitab.refreshToken';
const USER_KEY = 'kitab.currentUser';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(LOCAL_STORAGE);
  private readonly authClient = inject(ApiAuthClient);
  private readonly router = inject(Router);
  private readonly userState = signal<CurrentUser | null>(this.readUser());
  private readonly tokenState = signal<string | null>(this.storage?.getItem(TOKEN_KEY) ?? null);

  readonly currentUser = this.userState.asReadonly();
  readonly accessToken = this.tokenState.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenState());
  readonly isAdmin = computed(() => this.userState()?.roles.includes('Admin') ?? false);

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.authClient.login(request).pipe(tap((response) => this.persistSession(response)));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.authClient.register(request).pipe(tap((response) => this.persistSession(response)));
  }

  loadCurrentUser(): Observable<CurrentUser> {
    return this.authClient.me().pipe(
      tap((user) => this.persistUser(user)),
      catchError((error: unknown) => {
        this.clearSession();
        return throwError(() => error);
      })
    );
  }

  refreshSession(): Observable<AuthResponse> {
    const userId = this.userState()?.userId;
    const refreshToken = this.storage?.getItem(REFRESH_TOKEN_KEY);

    if (!userId || !refreshToken) {
      return throwError(() => new Error('No refresh token available.'));
    }

    return this.authClient.refresh({ userId, refreshToken }).pipe(tap((response) => this.persistSession(response)));
  }

  initSession(): Promise<void> {
    if (!this.tokenState()) {
      return Promise.resolve();
    }

    return firstValueFrom(this.loadCurrentUser())
      .then(() => undefined)
      .catch(() => undefined);
  }

  logout(): void {
    this.clearSession();
    void this.router.navigate(['/login']);
  }

  private persistSession(response: AuthResponse): void {
    const user: CurrentUser = {
      userId: response.userId,
      email: response.email,
      displayName: response.displayName,
      roles: response.roles
    };

    this.storage?.setItem(TOKEN_KEY, response.accessToken);
    if (response.refreshToken) {
      this.storage?.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    }

    this.tokenState.set(response.accessToken);
    this.persistUser(user);
  }

  private persistUser(user: CurrentUser): void {
    this.storage?.setItem(USER_KEY, JSON.stringify(user));
    this.userState.set(user);
  }

  private clearSession(): void {
    this.storage?.removeItem(TOKEN_KEY);
    this.storage?.removeItem(REFRESH_TOKEN_KEY);
    this.storage?.removeItem(USER_KEY);
    this.tokenState.set(null);
    this.userState.set(null);
  }

  private readUser(): CurrentUser | null {
    const rawUser = this.storage?.getItem(USER_KEY);
    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as CurrentUser;
    } catch {
      return null;
    }
  }
}
