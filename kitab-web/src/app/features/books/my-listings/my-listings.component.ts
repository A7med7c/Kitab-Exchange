import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, finalize, of } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { Listing } from '../../../shared/models/api.models';

@Component({
  selector: 'app-my-listings',
  imports: [
    CurrencyPipe,
    DatePipe,
    EmptyStateComponent,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    PageHeaderComponent,
    RouterLink,
    SkeletonLoaderComponent,
    TranslateModule
  ],
  template: `
    <app-page-header
      [title]="'myListings.title' | translate"
      [description]="'myListings.description' | translate"
      icon="library_books"
    />

    <div class="actions">
      <a mat-flat-button routerLink="/books/new">
        <mat-icon aria-hidden="true">add_circle</mat-icon>
        <span>{{ 'books.newTitle' | translate }}</span>
      </a>
    </div>

    @if (loading()) {
      <app-skeleton-loader [count]="3" />
    } @else if (listings().length) {
      <section class="book-grid">
        @for (listing of listings(); track listing.id) {
          <mat-card class="book-card" appearance="outlined">
            <mat-card-header>
              <mat-card-title>{{ listing.title }}</mat-card-title>
              <mat-card-subtitle>{{ listing.author }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <mat-chip-set>
                <mat-chip>{{ listing.status }}</mat-chip>
                <mat-chip>{{ listing.listingType }}</mat-chip>
              </mat-chip-set>
              @if (listing.price) {
                <p class="price">{{ listing.price | currency }}</p>
              }
              <p class="meta">{{ listing.createdAt | date: 'medium' }}</p>
            </mat-card-content>
            <mat-card-actions align="end">
              <a mat-button [routerLink]="['/books', listing.id, 'edit']">
                <mat-icon aria-hidden="true">edit</mat-icon>
                <span>{{ 'common.edit' | translate }}</span>
              </a>
              <button mat-button type="button" (click)="deleteListing(listing)">
                <mat-icon aria-hidden="true">delete</mat-icon>
                <span>{{ 'common.delete' | translate }}</span>
              </button>
            </mat-card-actions>
          </mat-card>
        }
      </section>
    } @else {
      <app-empty-state
        [title]="'myListings.emptyTitle' | translate"
        [message]="'myListings.emptyMessage' | translate"
        icon="library_books"
      />
    }
  `,
  styles: `
    .actions {
      margin-bottom: 16px;
    }

    .book-grid {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    .price {
      color: var(--kitab-accent);
      font-weight: 700;
      margin: 8px 0 0;
    }

    .meta {
      color: var(--kitab-muted);
      font-size: 0.875rem;
      margin: 4px 0 0;
    }
  `
})
export class MyListingsComponent {
  private readonly api = inject(ApiService);
  private readonly notifications = inject(NotificationService);

  protected readonly loading = signal(true);
  protected readonly listings = signal<Listing[]>([]);

  constructor() {
    this.loadListings();
  }

  protected deleteListing(listing: Listing): void {
    if (!confirm(`Delete "${listing.title}"?`)) {
      return;
    }

    this.api.deleteListing(listing.id).subscribe({
      next: () => {
        this.notifications.success('myListings.deleted');
        this.loadListings();
      }
    });
  }

  private loadListings(): void {
    this.loading.set(true);
    this.api
      .getMyListings()
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loading.set(false))
      )
      .subscribe((listings) => this.listings.set(listings));
  }
}
