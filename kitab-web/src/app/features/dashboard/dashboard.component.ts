import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '../../core/services/auth.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-dashboard',
  imports: [MatButtonModule, MatCardModule, MatIconModule, PageHeaderComponent, RouterLink, TranslateModule],
  template: `
    <app-page-header
      [title]="'dashboard.title' | translate"
      [description]="'dashboard.description' | translate"
      icon="dashboard"
    />

    @if (auth.currentUser(); as user) {
      <mat-card class="profile-card surface" appearance="outlined">
        <mat-card-header>
          <mat-card-title>{{ user.displayName }}</mat-card-title>
          <mat-card-subtitle>{{ user.email }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>{{ 'dashboard.roles' | translate }}: {{ user.roles.join(', ') }}</p>
        </mat-card-content>
      </mat-card>
    }

    <section class="quick-links">
      @for (link of links; track link.route) {
        <a mat-stroked-button [routerLink]="link.route">
          <mat-icon aria-hidden="true">{{ link.icon }}</mat-icon>
          <span>{{ link.labelKey | translate }}</span>
        </a>
      }
    </section>
  `,
  styles: `
    .profile-card {
      margin-bottom: 24px;
      max-width: 560px;
    }

    .quick-links {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
  `
})
export class DashboardComponent {
  protected readonly auth = inject(AuthService);

  protected readonly links = [
    { route: '/my-listings', icon: 'library_books', labelKey: 'nav.myListings' },
    { route: '/books/new', icon: 'add_circle', labelKey: 'books.newTitle' },
    { route: '/requests', icon: 'forum', labelKey: 'nav.requests' }
  ];
}
