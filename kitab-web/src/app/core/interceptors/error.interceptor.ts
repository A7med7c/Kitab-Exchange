import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const notifications = inject(NotificationService);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status >= 500) {
          notifications.error('errors.server');
        } else if (error.status === 400 || error.status === 401 || error.status === 403) {
          const detail = typeof error.error?.detail === 'string' ? error.error.detail : null;
          if (detail) {
            notifications.message(detail);
          } else if (error.status === 401 && !request.url.includes('/Auth/')) {
            notifications.error('errors.unauthorized');
          }
        }
      }

      return throwError(() => error);
    })
  );
};
