import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, of } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    PageHeaderComponent,
    RouterLink,
    SkeletonLoaderComponent,
    TranslateModule
  ],
  template: `
    <app-page-header
      [title]="'admin.title' | translate"
      [description]="'admin.description' | translate"
      icon="admin_panel_settings"
    />

    @if (loading()) {
      <app-skeleton-loader [count]="5" />
    } @else {
      <section class="admin-grid">
        @for (card of cards(); track card.labelKey) {
          <mat-card appearance="outlined">
            <mat-card-content>
              <mat-icon aria-hidden="true">{{ card.icon }}</mat-icon>
              <h2>{{ card.value }}</h2>
              <p>{{ card.labelKey | translate }}</p>
            </mat-card-content>
          </mat-card>
        }
      </section>
    }

    <div class="admin-actions">
      <a mat-flat-button routerLink="/admin/categories">
        <mat-icon aria-hidden="true">category</mat-icon>
        <span>{{ 'admin.manageCategories' | translate }}</span>
      </a>
      <a mat-stroked-button routerLink="/books">
        <mat-icon aria-hidden="true">menu_book</mat-icon>
        <span>{{ 'nav.books' | translate }}</span>
      </a>
    </div>
  `,
  styles: `
    .admin-grid {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      margin-bottom: 24px;
    }

    mat-card {
      border-radius: var(--kitab-radius);
    }

    mat-card-content {
      display: grid;
      gap: 4px;
    }

    mat-icon {
      color: var(--kitab-accent);
    }

    h2,
    p {
      margin: 0;
    }

    .admin-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
  `
})
export class DashboardComponent {
  private readonly api = inject(ApiService);

  protected readonly loading = signal(true);
  protected readonly cards = signal([
    { icon: 'group', value: '0', labelKey: 'admin.cards.users' },
    { icon: 'menu_book', value: '0', labelKey: 'admin.cards.listings' },
    { icon: 'category', value: '0', labelKey: 'admin.cards.categories' },
    { icon: 'forum', value: '0', labelKey: 'admin.cards.requests' },
    { icon: 'check_circle', value: '0', labelKey: 'admin.cards.activeListings' }
  ]);

  constructor() {
    this.api.getAdminDashboard().pipe(catchError(() => of(null))).subscribe((dashboard) => {
      if (dashboard) {
        this.cards.set([
          { icon: 'group', value: String(dashboard.totalUsers), labelKey: 'admin.cards.users' },
          { icon: 'menu_book', value: String(dashboard.totalListings), labelKey: 'admin.cards.listings' },
          { icon: 'category', value: String(dashboard.totalCategories), labelKey: 'admin.cards.categories' },
          { icon: 'forum', value: String(dashboard.totalRequests), labelKey: 'admin.cards.requests' },
          {
            icon: 'check_circle',
            value: String(dashboard.activeListings),
            labelKey: 'admin.cards.activeListings'
          }
        ]);
      }

      this.loading.set(false);
    });
  }
}
