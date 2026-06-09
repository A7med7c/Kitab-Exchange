import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';

import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../shared/models/api.models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly api = inject(ApiService);
  private readonly categoriesState = signal<Category[]>([]);
  private loaded = false;

  readonly categories = this.categoriesState.asReadonly();

  loadCategories(): Observable<Category[]> {
    if (this.loaded && this.categoriesState().length) {
      return of(this.categoriesState());
    }

    return this.api.getCategories().pipe(
      tap((categories) => {
        this.categoriesState.set(categories);
        this.loaded = true;
      }),
      catchError(() => {
        this.categoriesState.set([]);
        return of([]);
      })
    );
  }

  createCategory(request: CreateCategoryRequest): Observable<Category> {
    return this.api.createCategory(request).pipe(
      tap((category) => {
        this.categoriesState.update((items) => [...items, category].sort((a, b) => a.name.localeCompare(b.name)));
      })
    );
  }

  updateCategory(id: string, request: UpdateCategoryRequest): Observable<Category> {
    return this.api.updateCategory(id, request).pipe(
      tap((category) => {
        this.categoriesState.update((items) =>
          items.map((item) => (item.id === id ? category : item)).sort((a, b) => a.name.localeCompare(b.name))
        );
      })
    );
  }

  deleteCategory(id: string): Observable<void> {
    return this.api.deleteCategory(id).pipe(
      tap(() => {
        this.categoriesState.update((items) => items.filter((item) => item.id !== id));
      })
    );
  }

  invalidate(): void {
    this.loaded = false;
    this.categoriesState.set([]);
  }
}
