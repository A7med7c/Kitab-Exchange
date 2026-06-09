import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, debounceTime, distinctUntilChanged, finalize, of, startWith, switchMap } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { LISTING_CONDITIONS, LISTING_TYPES, Listing, ListingSearchParams } from '../../../shared/models/api.models';

@Component({
  selector: 'app-browse',
  imports: [
    CurrencyPipe,
    EmptyStateComponent,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    PageHeaderComponent,
    ReactiveFormsModule,
    RouterLink,
    SkeletonLoaderComponent,
    TranslateModule
  ],
  template: `
    <app-page-header
      [eyebrow]="'books.eyebrow' | translate"
      [title]="'books.title' | translate"
      [description]="'books.description' | translate"
      icon="auto_stories"
    />

    <form class="filters surface" [formGroup]="filtersForm" (ngSubmit)="applyFilters()">
      <mat-form-field>
        <mat-label>{{ 'books.filters.search' | translate }}</mat-label>
        <input matInput formControlName="term" />
        <mat-icon matSuffix aria-hidden="true">search</mat-icon>
      </mat-form-field>

      <mat-form-field>
        <mat-label>{{ 'books.filters.condition' | translate }}</mat-label>
        <mat-select formControlName="condition">
          <mat-option value="">{{ 'books.filters.any' | translate }}</mat-option>
          @for (condition of conditions; track condition) {
            <mat-option [value]="condition">{{ condition }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field>
        <mat-label>{{ 'books.filters.type' | translate }}</mat-label>
        <mat-select formControlName="listingType">
          <mat-option value="">{{ 'books.filters.any' | translate }}</mat-option>
          @for (type of listingTypes; track type) {
            <mat-option [value]="type">{{ type }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field>
        <mat-label>{{ 'books.filters.minPrice' | translate }}</mat-label>
        <input matInput type="number" formControlName="minPrice" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>{{ 'books.filters.maxPrice' | translate }}</mat-label>
        <input matInput type="number" formControlName="maxPrice" />
      </mat-form-field>

      <button mat-stroked-button type="button" (click)="resetFilters()">
        {{ 'books.filters.reset' | translate }}
      </button>
    </form>

    @if (loading()) {
      <app-skeleton-loader />
    } @else if (pagedListings().length) {
      <section class="book-grid">
        @for (listing of pagedListings(); track listing.id) {
          <mat-card class="book-card" appearance="outlined">
            <mat-card-header>
              <mat-card-title>{{ listing.title }}</mat-card-title>
              <mat-card-subtitle>{{ listing.author }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>{{ listing.description }}</p>
              <mat-chip-set aria-label="Listing tags">
                <mat-chip>{{ listing.category }}</mat-chip>
                <mat-chip>{{ listing.condition }}</mat-chip>
                <mat-chip>{{ listing.listingType }}</mat-chip>
              </mat-chip-set>
            </mat-card-content>
            <mat-card-actions align="end">
              @if (listing.price) {
                <span class="price">{{ listing.price | currency }}</span>
              }
              <a mat-button [routerLink]="['/books', listing.id]">
                <mat-icon aria-hidden="true">visibility</mat-icon>
                <span>{{ 'common.view' | translate }}</span>
              </a>
            </mat-card-actions>
          </mat-card>
        }
      </section>

      <mat-paginator
        [length]="listings().length"
        [pageSize]="pageSize()"
        [pageIndex]="pageIndex()"
        [pageSizeOptions]="[6, 12, 24]"
        (page)="onPage($event)"
        [attr.aria-label]="'books.pagination' | translate"
      />
    } @else {
      <app-empty-state
        [title]="'books.emptyTitle' | translate"
        [message]="'books.emptyMessage' | translate"
        icon="menu_book"
      />
    }
  `,
  styles: `
    .filters {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      margin-bottom: 20px;
      padding: 16px;
    }

    .book-grid {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      margin-bottom: 16px;
    }

    .book-card {
      border-radius: var(--kitab-radius);
    }

    mat-card-content p {
      color: var(--kitab-muted);
      min-height: 3lh;
    }

    mat-card-actions {
      align-items: center;
      gap: 8px;
    }

    .price {
      color: var(--kitab-accent);
      font-weight: 700;
      margin-inline-end: auto;
    }
  `
})
export class BrowseComponent {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  protected readonly conditions = LISTING_CONDITIONS;
  protected readonly listingTypes = LISTING_TYPES;
  protected readonly loading = signal(true);
  protected readonly listings = signal<Listing[]>([]);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(6);

  protected readonly filtersForm = this.fb.nonNullable.group({
    term: [''],
    condition: [''],
    listingType: [''],
    minPrice: [''],
    maxPrice: ['']
  });

  protected readonly pagedListings = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.listings().slice(start, start + this.pageSize());
  });

  constructor() {
    this.filtersForm.valueChanges
      .pipe(
        startWith(this.filtersForm.getRawValue()),
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        switchMap((values) => {
          this.loading.set(true);
          this.pageIndex.set(0);
          const params = this.toSearchParams(values);
          const request$ = this.hasFilters(params) ? this.api.searchListings(params) : this.api.getListings();
          return request$.pipe(
            catchError(() => of([])),
            finalize(() => this.loading.set(false))
          );
        })
      )
      .subscribe((listings) => this.listings.set(listings));
  }

  protected applyFilters(): void {
    this.filtersForm.updateValueAndValidity({ emitEvent: true });
  }

  protected resetFilters(): void {
    this.filtersForm.reset({
      term: '',
      condition: '',
      listingType: '',
      minPrice: '',
      maxPrice: ''
    });
  }

  protected onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  private hasFilters(params: ListingSearchParams): boolean {
    return !!(params.term || params.condition || params.listingType || params.minPrice || params.maxPrice);
  }

  private toSearchParams(values: typeof this.filtersForm.value): ListingSearchParams {
    return {
      term: values.term || undefined,
      condition: (values.condition as ListingSearchParams['condition']) || undefined,
      listingType: (values.listingType as ListingSearchParams['listingType']) || undefined,
      minPrice: values.minPrice ? Number(values.minPrice) : undefined,
      maxPrice: values.maxPrice ? Number(values.maxPrice) : undefined
    };
  }
}
