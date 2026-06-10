import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { FooterComponent } from '../footer/footer.component';

interface NavItem {
  labelKey: string;
  icon: string;
  route: string;
  requiresAuth?: boolean;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-shell',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    TranslateModule,
    FooterComponent
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  protected readonly auth = inject(AuthService);
  protected readonly translation = inject(TranslationService);

  protected readonly primaryNavItems: NavItem[] = [
    { labelKey: 'nav.home', icon: 'home', route: '/' },
    { labelKey: 'nav.books', icon: 'menu_book', route: '/books' },
    { labelKey: 'nav.dashboard', icon: 'dashboard', route: '/dashboard', requiresAuth: true },
    { labelKey: 'nav.myListings', icon: 'library_books', route: '/my-listings', requiresAuth: true },
    { labelKey: 'nav.requests', icon: 'forum', route: '/requests', requiresAuth: true }
  ];

  protected readonly navItems: NavItem[] = [
    ...this.primaryNavItems,
    { labelKey: 'nav.categories', icon: 'category', route: '/categories' },
    { labelKey: 'nav.admin', icon: 'admin_panel_settings', route: '/admin', adminOnly: true }
  ];

  protected canShow(item: NavItem): boolean {
    if (item.adminOnly) {
      return this.auth.isAdmin();
    }

    return !item.requiresAuth || this.auth.isAuthenticated();
  }

  protected isExact(route: string): boolean {
    return route === '/';
  }
}
