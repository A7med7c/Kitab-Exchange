import { Component, inject, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, finalize, of } from 'rxjs';

import { CategoriesService } from '../../../core/services/categories.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-category-list',
  imports: [EmptyStateComponent, MatListModule, PageHeaderComponent, SkeletonLoaderComponent, TranslateModule],
  template: `
    <app-page-header
      [title]="'categories.title' | translate"
      [description]="'categories.description' | translate"
      icon="category"
    />
    @if (loading()) {
      <app-skeleton-loader [count]="2" />
    } @else {
      @let categories = categoriesService.categories();
      @if (categories.length) {
        <mat-list class="surface">
          @for (category of categories; track category.id) {
            <mat-list-item>
              <span matListItemTitle>{{ category.name }}</span>
              <span matListItemLine>{{ category.description }}</span>
            </mat-list-item>
          }
        </mat-list>
      } @else {
        <app-empty-state
          [title]="'categories.emptyTitle' | translate"
          [message]="'categories.emptyMessage' | translate"
          icon="category"
        />
      }
    }
  `
})
export class CategoryListComponent {
  protected readonly categoriesService = inject(CategoriesService);
  protected readonly loading = signal(true);

  constructor() {
    this.categoriesService
      .loadCategories()
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loading.set(false))
      )
      .subscribe();
  }
}
