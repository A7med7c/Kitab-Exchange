import { TestBed } from '@angular/core/testing';
import { provideRouter, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  it('allows authenticated users', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: { isAuthenticated: () => true } }]
    });

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, { url: '/requests' } as never));

    expect(result).toBe(true);
  });

  it('redirects guests to login with returnUrl', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: { isAuthenticated: () => false } }]
    });

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/requests' } as never)
    ) as UrlTree;

    expect(result.toString()).toBe('/login?returnUrl=%2Frequests');
  });
});
