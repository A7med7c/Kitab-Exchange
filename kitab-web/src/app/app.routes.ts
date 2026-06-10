import { Routes } from '@angular/router';

import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent)
      },
      {
        path: 'books',
        loadComponent: () => import('./features/books/browse/browse.component').then((m) => m.BrowseComponent)
      },
      {
        path: 'books/new',
        canActivate: [authGuard],
        loadComponent: () => import('./features/books/editor/editor.component').then((m) => m.EditorComponent)
      },
      {
        path: 'books/:id/edit',
        canActivate: [authGuard],
        loadComponent: () => import('./features/books/editor/editor.component').then((m) => m.EditorComponent)
      },
      {
        path: 'books/:id',
        loadComponent: () => import('./features/books/detail/detail.component').then((m) => m.DetailComponent)
      },
      {
        path: 'my-listings',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/books/my-listings/my-listings.component').then((m) => m.MyListingsComponent)
      },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/categories/category-list/category-list.component').then((m) => m.CategoryListComponent)
      },
      {
        path: 'requests',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/requests/request-list/request-list.component').then((m) => m.RequestListComponent)
      },
      {
        path: 'wishlist',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/wishlist/wishlist-page/wishlist-page.component').then((m) => m.WishlistPageComponent)
      },
      {
        path: 'notifications',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/notifications/notification-center/notification-center.component').then(
            (m) => m.NotificationCenterComponent
          )
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'admin/categories',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/category-admin/category-admin.component').then((m) => m.CategoryAdminComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact.component').then((m) => m.ContactComponent)
      },
      {
        path: 'faq',
        loadComponent: () => import('./features/faq/faq.component').then((m) => m.FaqComponent)
      },
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent)
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent)
  }
];
