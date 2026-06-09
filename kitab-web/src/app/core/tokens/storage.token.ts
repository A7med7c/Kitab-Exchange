import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';

export const LOCAL_STORAGE = new InjectionToken<Storage | null>('Browser local storage', {
  providedIn: 'root',
  factory: () => inject(DOCUMENT).defaultView?.localStorage ?? null
});
