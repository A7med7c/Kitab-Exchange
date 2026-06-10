import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Injectable, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, debounceTime, distinctUntilChanged, finalize, of, startWith, switchMap } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { LISTING_CONDITIONS, LISTING_TYPES, Listing, ListingSearchParams } from '../../../shared/models/api.models';

@Injectable()
export class TranslatePaginatorIntl extends MatPaginatorIntl {
  private translate = inject(TranslateService);

  override itemsPerPageLabel = 'Items per page';
  override nextPageLabel = 'Next page';
  override previousPageLabel = 'Previous page';
  override firstPageLabel = 'First page';
  override lastPageLabel = 'Last page';

  constructor() {
    super();
    this.translate.onLangChange.subscribe(() => {
      this.getTranslations();
    });
    this.getTranslations();
  }

  private getTranslations() {
    this.translate.get([
      'books.paginator.itemsPerPage',
      'books.paginator.nextPage',
      'books.paginator.previousPage',
      'books.paginator.firstPage',
      'books.paginator.lastPage'
    ]).subscribe((translations: Record<string, string>) => {
      this.itemsPerPageLabel = translations['books.paginator.itemsPerPage'] || 'Items per page';
      this.nextPageLabel = translations['books.paginator.nextPage'] || 'Next page';
      this.previousPageLabel = translations['books.paginator.previousPage'] || 'Previous page';
      this.firstPageLabel = translations['books.paginator.firstPage'] || 'First page';
      this.lastPageLabel = translations['books.paginator.lastPage'] || 'Last page';
      this.changes.next();
    });
  }

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    // We could localize 'of' here but keeping it simple with slash which is universal
    return `${startIndex + 1} - ${endIndex} / ${length}`;
  };
}

@Component({
  selector: 'app-browse',
  imports: [
    CurrencyPipe,
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
    TranslateModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TranslatePaginatorIntl }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header
      [eyebrow]="'books.eyebrow' | translate"
      [title]="'books.title' | translate"
      [description]="'books.description' | translate"
      icon="auto_stories"
    />

    <div class="marketplace-container">
      <!-- Top Filters Toolbar -->
      <form class="filters-toolbar surface" [formGroup]="filtersForm" (ngSubmit)="applyFilters()">
        <div class="toolbar-primary">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>{{ 'books.filters.search' | translate }}</mat-label>
            <input matInput formControlName="term" />
            <mat-icon matSuffix aria-hidden="true">search</mat-icon>
          </mat-form-field>

          <div class="toolbar-actions">
            <button mat-stroked-button type="button" class="advanced-btn" (click)="toggleAdvancedFilters()">
              <mat-icon>{{ showAdvanced() ? 'expand_less' : 'tune' }}</mat-icon>
              {{ 'books.filters.advanced' | translate }}
            </button>
            <mat-form-field appearance="outline" class="sort-field">
              <mat-label>{{ 'books.filters.sortBy' | translate }}</mat-label>
              <mat-select [formControl]="sortControl">
                <mat-option value="newest">{{ 'books.sort.newest' | translate }}</mat-option>
                <mat-option value="oldest">{{ 'books.sort.oldest' | translate }}</mat-option>
                <mat-option value="priceAsc">{{ 'books.sort.priceAsc' | translate }}</mat-option>
                <mat-option value="priceDesc">{{ 'books.sort.priceDesc' | translate }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <!-- Collapsible Advanced Filters -->
        <div class="advanced-filters" [class.expanded]="showAdvanced()">
          <div class="advanced-filters-content">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'books.filters.condition' | translate }}</mat-label>
              <mat-select formControlName="condition">
                <mat-option value="">{{ 'books.filters.any' | translate }}</mat-option>
                @for (condition of conditions; track condition) {
                  <mat-option [value]="condition">{{ condition }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'books.filters.type' | translate }}</mat-label>
              <mat-select formControlName="listingType">
                <mat-option value="">{{ 'books.filters.any' | translate }}</mat-option>
                @for (type of listingTypes; track type) {
                  <mat-option [value]="type">{{ type }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'books.filters.minPrice' | translate }}</mat-label>
              <input matInput type="number" formControlName="minPrice" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'books.filters.maxPrice' | translate }}</mat-label>
              <input matInput type="number" formControlName="maxPrice" />
            </mat-form-field>

            <div class="filter-actions">
              <button mat-flat-button color="warn" type="button" (click)="resetFilters()">
                {{ 'books.filters.reset' | translate }}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div class="results-header">
        @if (!loading()) {
          <span class="results-count"><strong>{{ listings().length }}</strong> {{ 'books.resultsFound' | translate }}</span>
        }
      </div>

      <!-- Main Content -->
      <main class="main-content">
        @if (loading()) {
          <!-- Skeleton Cards -->
          <div class="book-grid">
             @for (i of [1,2,3,4,5,6,7,8]; track i) {
               <mat-card class="book-card modern-card skeleton-card" appearance="outlined">
                 <div class="card-image-container skeleton"></div>
                 <mat-card-content class="card-content">
                   <div class="skeleton-text skeleton-title"></div>
                   <div class="skeleton-text skeleton-author"></div>
                   <div class="skeleton-text skeleton-badge"></div>
                 </mat-card-content>
               </mat-card>
             }
          </div>
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
                    <p class="book-author">{{ 'home.by' | translate }} {{ listing.author }}</p>
                  </div>
                  
                  <div class="card-details">
                    <span class="category-text">{{ listing.category }}</span>
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
            <div class="empty-illustration">
              <mat-icon class="huge-icon">search_off</mat-icon>
            </div>
            <h2>{{ 'books.emptyTitle' | translate }}</h2>
            <p class="empty-message">{{ 'books.emptyMessage' | translate }}</p>
            <p class="empty-hint">{{ 'books.emptyHint' | translate }}</p>
            <div class="empty-actions">
              <button mat-stroked-button (click)="resetFilters()">{{ 'books.filters.reset' | translate }}</button>
            </div>
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

    .marketplace-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 24px;
    }

    /* Horizontal Filters Toolbar */
    .filters-toolbar {
      padding: 16px 24px;
      border-radius: var(--kitab-radius);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .toolbar-primary {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
      justify-content: space-between;
    }

    .search-field {
      flex: 1;
      min-width: 250px;
      margin-bottom: -1.34375em;
    }

    .toolbar-actions {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .sort-field {
      width: 200px;
      margin-bottom: -1.34375em;
    }

    .advanced-btn {
      height: 56px;
    }

    /* Collapsible Advanced Filters */
    .advanced-filters {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 0.3s ease-out;
      overflow: hidden;
    }

    .advanced-filters.expanded {
      grid-template-rows: 1fr;
    }

    .advanced-filters-content {
      min-height: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--kitab-border);
    }

    .advanced-filters-content mat-form-field {
      flex: 1;
      min-width: 150px;
      margin-bottom: -1.34375em;
    }

    .filter-actions {
      display: flex;
      align-items: center;
    }

    .filter-actions button {
      height: 56px;
    }

    .results-header {
      padding: 0 8px;
    }

    .results-count {
      color: var(--kitab-muted);
      font-size: 0.95rem;
    }

    /* Main Content */
    .main-content {
      width: 100%;
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
      border: 1px solid var(--kitab-border);
      box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
    }

    .modern-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 32px rgba(0,0,0,0.08) !important;
    }

    .card-image-container {
      position: relative;
      width: 100%;
      padding-top: 140%; /* Modern 5:7 ratio for book covers */
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
      transition: transform 0.6s ease;
    }

    .modern-card:hover .book-cover {
      transform: scale(1.05);
    }

    .placeholder-cover {
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      color: #adb5bd;
    }

    .placeholder-cover mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      opacity: 0.5;
    }

    /* Badges */
    .card-badges {
      position: absolute;
      top: 12px;
      inset-inline-start: 12px; /* RTL Safe */
      display: flex;
      flex-direction: column;
      gap: 6px;
      z-index: 2;
    }

    .badge {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 4px 10px;
      border-radius: 4px;
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
      inset-inline-end: 8px; /* RTL Safe */
      background: rgba(255,255,255,0.9);
      color: var(--kitab-muted);
      transition: all 0.2s ease;
      z-index: 2;
    }

    .wishlist-btn:hover {
      background: white;
      color: var(--kitab-accent);
      transform: scale(1.1);
    }

    /* Content Area */
    .card-content {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .card-header {
      margin-bottom: 12px;
    }

    .book-title {
      font-size: 1.15rem;
      font-weight: 700;
      margin: 0 0 6px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      color: var(--kitab-foreground);
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
    }

    .category-text {
      font-size: 0.8rem;
      color: var(--kitab-muted);
      background: var(--kitab-background);
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 500;
    }

    /* Footer Actions */
    .card-actions {
      padding: 16px 20px;
      border-top: 1px solid var(--kitab-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fafafa;
    }

    /* RTL specific fix for the footer background */
    [dir="rtl"] .card-actions {
      background: #fafafa;
    }

    .price-amount {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--kitab-accent);
    }

    .exchange-label {
      font-size: 1.05rem;
      font-weight: 700;
      color: #4caf50;
    }

    .pagination-bar {
      border-radius: var(--kitab-radius);
      margin-top: 24px;
    }

    /* Skeleton Loader Styles */
    .skeleton-card {
      pointer-events: none;
    }

    .skeleton {
      background: #e9ecef;
      animation: pulse 1.5s infinite ease-in-out;
    }

    .skeleton-text {
      background: #e9ecef;
      border-radius: 4px;
      height: 16px;
      margin-bottom: 12px;
      animation: pulse 1.5s infinite ease-in-out;
    }

    .skeleton-title {
      width: 80%;
      height: 24px;
    }

    .skeleton-author {
      width: 50%;
    }

    .skeleton-badge {
      width: 30%;
      margin-top: auto;
    }

    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    }

    /* Empty State */
    .empty-container {
      padding: 80px 24px;
      text-align: center;
      border-radius: var(--kitab-radius);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .empty-illustration {
      margin-bottom: 24px;
      color: var(--kitab-muted);
      opacity: 0.5;
    }
    
    .huge-icon {
      font-size: 96px;
      width: 96px;
      height: 96px;
    }

    .empty-container h2 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .empty-message {
      color: var(--kitab-muted);
      font-size: 1.1rem;
      margin-bottom: 8px;
    }

    .empty-hint {
      color: var(--kitab-muted);
      margin-bottom: 24px;
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
    @media (min-width: 600px) {
      .book-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 960px) {
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
  protected readonly pageSize = signal(12);

  protected readonly showAdvanced = signal(false);

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

  protected toggleAdvancedFilters(): void {
    this.showAdvanced.update(v => !v);
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
