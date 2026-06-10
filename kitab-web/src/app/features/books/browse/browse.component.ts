import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    DatePipe,
    EmptyStateComponent,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTooltipModule,
    PageHeaderComponent,
    ReactiveFormsModule,
    RouterLink,
    SkeletonLoaderComponent,
    TranslateModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header
      [eyebrow]="'books.eyebrow' | translate"
      [title]="'books.title' | translate"
      [description]="'books.description' | translate"
      icon="auto_stories"
    />

    <div class="marketplace-layout">
      <!-- Sidebar Filters -->
      <aside class="sidebar">
        <form class="filters surface" [formGroup]="filtersForm" (ngSubmit)="applyFilters()">
          <h3>{{ 'books.filters.title' | translate | default:'Filters' }}</h3>
          
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>{{ 'books.filters.search' | translate }}</mat-label>
            <input matInput formControlName="term" />
            <mat-icon matSuffix aria-hidden="true">search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-100">
            <mat-label>{{ 'books.filters.condition' | translate }}</mat-label>
            <mat-select formControlName="condition">
              <mat-option value="">{{ 'books.filters.any' | translate }}</mat-option>
              @for (condition of conditions; track condition) {
                <mat-option [value]="condition">{{ condition }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-100">
            <mat-label>{{ 'books.filters.type' | translate }}</mat-label>
            <mat-select formControlName="listingType">
              <mat-option value="">{{ 'books.filters.any' | translate }}</mat-option>
              @for (type of listingTypes; track type) {
                <mat-option [value]="type">{{ type }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <div class="price-range">
            <mat-form-field appearance="outline" class="flex-1">
              <mat-label>{{ 'books.filters.minPrice' | translate }}</mat-label>
              <input matInput type="number" formControlName="minPrice" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="flex-1">
              <mat-label>{{ 'books.filters.maxPrice' | translate }}</mat-label>
              <input matInput type="number" formControlName="maxPrice" />
            </mat-form-field>
          </div>

          <button mat-stroked-button color="warn" type="button" class="w-100" (click)="resetFilters()">
            {{ 'books.filters.reset' | translate }}
          </button>
        </form>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Toolbar -->
        <div class="toolbar surface">
          <div class="results-count">
            @if (!loading()) {
              <span><strong>{{ listings().length }}</strong> {{ 'books.resultsFound' | translate | default:'books found' }}</span>
            }
          </div>
          
          <mat-form-field appearance="outline" class="sort-field">
            <mat-label>{{ 'books.filters.sortBy' | translate | default:'Sort By' }}</mat-label>
            <mat-select [formControl]="sortControl">
              <mat-option value="newest">{{ 'books.sort.newest' | translate | default:'Newest' }}</mat-option>
              <mat-option value="oldest">{{ 'books.sort.oldest' | translate | default:'Oldest' }}</mat-option>
              <mat-option value="priceAsc">{{ 'books.sort.priceAsc' | translate | default:'Price: Low to High' }}</mat-option>
              <mat-option value="priceDesc">{{ 'books.sort.priceDesc' | translate | default:'Price: High to Low' }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        @if (loading()) {
          <app-skeleton-loader />
        } @else if (pagedListings().length) {
          <section class="book-grid">
            @for (listing of pagedListings(); track listing.id) {
              <mat-card class="book-card modern-card" appearance="outlined">
                <div class="card-image-container">
                  @if (listing.imageUrls?.length) {
                    <img [src]="api.resolveAssetUrl(listing.imageUrls![0])" [alt]="listing.title" class="book-cover" loading="lazy" />
                  } @else {
                    <div class="book-cover placeholder-cover">
                      <mat-icon>auto_stories</mat-icon>
                    </div>
                  }
                  <div class="card-badges">
                    <span class="badge type-badge" [class.type-sale]="listing.listingType === 'ForSale'">
                      {{ listing.listingType === 'ForSale' ? ('home.forSale' | translate) : ('home.forExchange' | translate) }}
                    </span>
                    <span class="badge condition-badge">{{ listing.condition }}</span>
                  </div>
                  <button mat-icon-button class="wishlist-btn" matTooltip="Add to Wishlist">
                    <mat-icon>favorite_border</mat-icon>
                  </button>
                </div>

                <mat-card-content class="card-content">
                  <div class="card-header">
                    <h3 class="book-title" [title]="listing.title">{{ listing.title }}</h3>
                    <p class="book-author">by {{ listing.author }}</p>
                  </div>
                  
                  <div class="card-details">
                    <span class="category-text">{{ listing.category }}</span>
                    <span class="date-text">{{ listing.createdAt | date:'mediumDate' }}</span>
                  </div>
                </mat-card-content>

                <mat-card-actions class="card-actions">
                  <div class="price-container">
                    @if (listing.price) {
                      <span class="price-amount">{{ listing.price | currency }}</span>
                    } @else {
                      <span class="exchange-label">{{ 'home.forExchange' | translate }}</span>
                    }
                  </div>
                  <a mat-flat-button color="primary" [routerLink]="['/books', listing.id]">
                    {{ 'common.view' | translate }}
                  </a>
                </mat-card-actions>
              </mat-card>
            }
          </section>

          <mat-paginator
            class="surface pagination-bar"
            [length]="listings().length"
            [pageSize]="pageSize()"
            [pageIndex]="pageIndex()"
            [pageSizeOptions]="[8, 16, 24, 32]"
            (page)="onPage($event)"
            [attr.aria-label]="'books.pagination' | translate"
          />
        } @else {
          <div class="empty-container surface">
            <app-empty-state
              [title]="'books.emptyTitle' | translate"
              [message]="'books.emptyMessage' | translate"
              icon="search_off"
            />
            <div class="empty-illustration">
              <mat-icon class="huge-icon">menu_book</mat-icon>
            </div>
            <p class="empty-hint">{{ 'books.emptyHint' | translate | default:'Try changing your filters or add a new listing.' }}</p>
          </div>
        }
      </main>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .w-100 { width: 100%; }
    .flex-1 { flex: 1; }

    .marketplace-layout {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-top: 24px;
    }

    /* Sidebar Styles */
    .sidebar {
      width: 100%;
    }

    .filters {
      padding: 24px;
      border-radius: var(--kitab-radius);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .filters h3 {
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .price-range {
      display: flex;
      gap: 12px;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      min-width: 0;
    }

    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 24px;
      border-radius: var(--kitab-radius);
      margin-bottom: 24px;
    }

    .sort-field {
      width: 200px;
      margin-bottom: -1.34375em; /* Remove extra padding below mat-form-field */
    }

    /* Book Grid */
    .book-grid {
      display: grid;
      gap: 24px;
      grid-template-columns: repeat(1, 1fr);
      margin-bottom: 24px;
    }

    /* Modern Card Styles */
    .modern-card {
      border-radius: var(--kitab-radius);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 0;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      animation: fadeInUp 0.5s ease-out forwards;
      opacity: 0;
    }

    .modern-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.1);
    }

    .card-image-container {
      position: relative;
      width: 100%;
      padding-top: 130%; /* Aspect ratio approx 3:4 */
      background: var(--kitab-background);
      overflow: hidden;
    }

    .book-cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .modern-card:hover .book-cover {
      transform: scale(1.05);
    }

    .placeholder-cover {
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      color: #7b8a97;
    }

    .placeholder-cover mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
    }

    .card-badges {
      position: absolute;
      top: 12px;
      left: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .badge {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.95);
      color: #333;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      backdrop-filter: blur(4px);
    }

    .type-sale {
      background: var(--kitab-accent);
      color: white;
    }

    .wishlist-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(255,255,255,0.8);
      color: #666;
      transition: all 0.2s ease;
    }

    .wishlist-btn:hover {
      background: white;
      color: var(--kitab-accent);
      transform: scale(1.1);
    }

    .card-content {
      padding: 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .card-header {
      margin-bottom: 12px;
    }

    .book-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin: 0 0 4px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .book-author {
      font-size: 0.9rem;
      color: var(--kitab-muted);
      margin: 0;
    }

    .card-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      font-size: 0.8rem;
      color: var(--kitab-muted);
    }

    .category-text {
      background: rgba(0,0,0,0.05);
      padding: 2px 8px;
      border-radius: 4px;
    }

    .card-actions {
      padding: 16px;
      border-top: 1px solid var(--kitab-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price-amount {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--kitab-accent);
    }

    .exchange-label {
      font-size: 1rem;
      font-weight: 700;
      color: #4caf50;
    }

    .pagination-bar {
      border-radius: var(--kitab-radius);
    }

    /* Empty State */
    .empty-container {
      padding: 64px 24px;
      text-align: center;
      border-radius: var(--kitab-radius);
    }

    .empty-illustration {
      margin: 32px 0;
      opacity: 0.3;
    }
    .huge-icon {
      font-size: 120px;
      width: 120px;
      height: 120px;
    }

    .empty-hint {
      color: var(--kitab-muted);
      font-size: 1.1rem;
    }

    /* Animations */
    @keyframes fadeInUp {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive Grid */
    @media (min-width: 768px) {
      .marketplace-layout {
        flex-direction: row;
      }
      .sidebar {
        width: 280px;
        flex-shrink: 0;
        position: sticky;
        top: 80px;
        height: fit-content;
      }
      .book-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .book-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (min-width: 1280px) {
      .book-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  `
})
export class BrowseComponent {
  protected readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  protected readonly conditions = LISTING_CONDITIONS;
  protected readonly listingTypes = LISTING_TYPES;
  protected readonly loading = signal(true);
  protected readonly listings = signal<Listing[]>([]);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(8); // Updated to 8 for better grid fit (4 cols * 2 rows)

  protected readonly sortControl = new FormControl<string>('newest', { nonNullable: true });
  private readonly sortValue = toSignal(this.sortControl.valueChanges, { initialValue: 'newest' });

  protected readonly filtersForm = this.fb.nonNullable.group({
    term: [''],
    condition: [''],
    listingType: [''],
    minPrice: [''],
    maxPrice: ['']
  });

  protected readonly pagedListings = computed(() => {
    // 1. Sort the listings
    const sorted = [...this.listings()].sort((a, b) => {
      const sortType = this.sortValue();
      if (sortType === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortType === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortType === 'priceAsc') {
        return (a.price || 0) - (b.price || 0);
      } else if (sortType === 'priceDesc') {
        return (b.price || 0) - (a.price || 0);
      }
      return 0;
    });

    // 2. Paginate the sorted listings
    const start = this.pageIndex() * this.pageSize();
    return sorted.slice(start, start + this.pageSize());
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
