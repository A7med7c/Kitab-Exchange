import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, finalize, forkJoin, of } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { ContactRequest, ContactRequestStatus } from '../../../shared/models/api.models';

@Component({
  selector: 'app-request-list',
  imports: [
    DatePipe,
    EmptyStateComponent,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatTabsModule,
    PageHeaderComponent,
    RouterLink,
    SkeletonLoaderComponent,
    TranslateModule
  ],
  template: `
    <app-page-header
      [title]="'requests.title' | translate"
      [description]="'requests.description' | translate"
      icon="forum"
    />

    <mat-tab-group (selectedTabChange)="onTabChange($event)">
      <mat-tab [label]="'requests.incoming' | translate" />
      <mat-tab [label]="'requests.outgoing' | translate" />
    </mat-tab-group>

    @if (loading()) {
      <app-skeleton-loader [count]="3" />
    } @else if (activeRequests().length) {
      <section class="request-list">
        @for (request of activeRequests(); track request.id) {
          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-card-title>{{ request.listingTitle }}</mat-card-title>
              <mat-card-subtitle>By {{ request.listingAuthor }} &bull; {{ request.createdAt | date: 'medium' }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>
                <strong>{{ activeTab() === 0 ? 'From:' : 'To:' }}</strong> 
                {{ activeTab() === 0 ? request.requesterName : request.ownerName }}
              </p>
              @if (request.requestType === 'Exchange' && request.offeredListingTitle) {
                <p><strong>Offered:</strong> {{ request.offeredListingTitle }}</p>
              }
              <mat-chip-set>
                <mat-chip [class]="getStatusClass(request.status)">{{ request.status }}</mat-chip>
              </mat-chip-set>
              @if (request.message) {
                <p><em>"{{ request.message }}"</em></p>
              }
            </mat-card-content>
            <mat-card-actions align="end">
              <a mat-button [routerLink]="['/books', request.listingId]">
                <mat-icon aria-hidden="true">menu_book</mat-icon>
                <span>{{ 'common.view' | translate }}</span>
              </a>
              @if (activeTab() === 0 && request.status === 'Pending') {
                <button mat-flat-button type="button" (click)="accept(request)">
                  <mat-icon aria-hidden="true">check</mat-icon>
                  <span>{{ 'requests.accept' | translate }}</span>
                </button>
                <button mat-stroked-button type="button" (click)="reject(request)">
                  <mat-icon aria-hidden="true">close</mat-icon>
                  <span>{{ 'requests.reject' | translate }}</span>
                </button>
              }
            </mat-card-actions>
          </mat-card>
        }
      </section>
    } @else {
      <app-empty-state
        [title]="'requests.emptyTitle' | translate"
        [message]="'requests.emptyMessage' | translate"
        icon="forum"
      />
    }
  `,
  styles: `
    mat-tab-group {
      margin-bottom: 16px;
    }

    .request-list {
      display: grid;
      gap: 16px;
    }

    mat-card-content p {
      color: var(--kitab-muted);
      margin: 12px 0 0;
    }

    .status-pending {
      background-color: #ffd54f !important;
      color: #000 !important;
    }

    .status-accepted {
      background-color: #81c784 !important;
      color: #000 !important;
    }

    .status-rejected {
      background-color: #e57373 !important;
      color: #000 !important;
    }
  `
})
export class RequestListComponent {
  private readonly api = inject(ApiService);
  private readonly notifications = inject(NotificationService);

  protected readonly loading = signal(true);
  protected readonly activeTab = signal(0);
  protected readonly incoming = signal<ContactRequest[]>([]);
  protected readonly outgoing = signal<ContactRequest[]>([]);
  protected readonly activeRequests = signal<ContactRequest[]>([]);

  constructor() {
    this.loadRequests();
  }

  protected getStatusClass(status: ContactRequestStatus): string {
    if (status === 'Pending' || status === 0) return 'status-pending';
    if (status === 'Accepted' || status === 1) return 'status-accepted';
    if (status === 'Rejected' || status === 2) return 'status-rejected';
    return '';
  }

  protected onTabChange(event: MatTabChangeEvent): void {
    this.activeTab.set(event.index);
    this.activeRequests.set(event.index === 0 ? this.incoming() : this.outgoing());
  }

  protected accept(request: ContactRequest): void {
    this.api.acceptContactRequest(request.id).subscribe({
      next: () => {
        this.notifications.success('Request accepted successfully');
        this.loadRequests();
      }
    });
  }

  protected reject(request: ContactRequest): void {
    this.api.rejectContactRequest(request.id).subscribe({
      next: () => {
        this.notifications.success('Request rejected successfully');
        this.loadRequests();
      }
    });
  }

  private loadRequests(): void {
    this.loading.set(true);
    forkJoin({
      incoming: this.api.getIncomingContactRequests().pipe(catchError(() => of([]))),
      outgoing: this.api.getOutgoingContactRequests().pipe(catchError(() => of([])))
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(({ incoming, outgoing }) => {
        this.incoming.set(incoming);
        this.outgoing.set(outgoing);
        this.activeRequests.set(this.activeTab() === 0 ? incoming : outgoing);
      });
  }
}
