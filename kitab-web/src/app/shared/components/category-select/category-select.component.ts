import { Component, inject, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

import { CategoriesService } from '../../../core/services/categories.service';

@Component({
  selector: 'app-category-select',
  imports: [MatFormFieldModule, MatProgressSpinnerModule, MatSelectModule, ReactiveFormsModule, TranslateModule],
  template: `
    <mat-form-field class="full-width">
      <mat-label>{{ labelKey() | translate }}</mat-label>
      <mat-select [formControl]="control()" [required]="required()">
        @if (loading()) {
          <mat-option disabled>
            <span class="loading-option">
              <mat-spinner diameter="18" />
              {{ 'common.loading' | translate }}
            </span>
          </mat-option>
        } @else if (!categoriesService.categories().length) {
          <mat-option disabled>{{ 'categories.emptyTitle' | translate }}</mat-option>
        } @else {
          @for (category of categoriesService.categories(); track category.id) {
            <mat-option [value]="category.name">{{ category.name }}</mat-option>
          }
        }
      </mat-select>
      @if (control().invalid && control().touched) {
        <mat-error>{{ 'books.form.categoryRequired' | translate }}</mat-error>
      }
    </mat-form-field>
  `,
  styles: `
    .full-width {
      width: 100%;
    }

    .loading-option {
      align-items: center;
      display: inline-flex;
      gap: 8px;
    }
  `
})
export class CategorySelectComponent {
  protected readonly categoriesService = inject(CategoriesService);

  readonly control = input.required<FormControl<string>>();
  readonly labelKey = input('books.form.category');
  readonly required = input(true);

  protected readonly loading = signal(true);

  constructor() {
    this.categoriesService.loadCategories().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false)
    });
  }
}
