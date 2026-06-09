---
story_key: e0-2-scaffold-angular-frontend
epic: 0
status: review
baseline_commit: NO_VCS
---

# Story E0-2: Scaffold Angular Frontend

## Story

As a **developer**, I need the Kitab Angular 20 frontend scaffolded with standalone components, feature-based architecture, core services, guards, interceptors, Material, Bootstrap, ngx-translate, and RTL support, so that all UI features share a consistent foundation.

## Acceptance Criteria

- [x] Angular 20 standalone app under `kitab-web/` with TypeScript and SCSS
- [x] Angular Material theme and Bootstrap 5 integrated globally
- [x] Feature-based lazy routes with `authGuard`, `adminGuard`, and `guestGuard`
- [x] HTTP interceptors for JWT auth and API error feedback
- [x] Core services (`AuthService`, `ApiService`, `TranslationService`) using Signals
- [x] Responsive shell layout with mobile sidenav and desktop toolbar navigation
- [x] ngx-translate configured with English and Arabic assets and RTL `dir` switching
- [x] Environment files for development and production API base URLs
- [x] Shared components (`PageHeader`, `EmptyState`, `LoadingSpinner`) and 404 page
- [x] Project builds and unit tests pass

## Tasks / Subtasks

- [x] Create Angular project structure with standalone bootstrap (`main.ts`, `app.config.ts`)
- [x] Configure routing with lazy-loaded feature routes and guards
- [x] Add environment configuration (`environment.ts`, `environment.development.ts`, `environment.prod.ts`)
- [x] Implement core services, tokens, guards, and interceptors
- [x] Build responsive shell layout with Material sidenav/toolbar
- [x] Configure ngx-translate with `public/assets/i18n/en.json` and `ar.json`
- [x] Configure Angular Material theme in `styles.scss`
- [x] Integrate Bootstrap CSS/JS via `angular.json`
- [x] Add shared components and not-found route
- [x] Add unit tests for app shell, auth guard, auth interceptor, and translation service
- [x] Verify `npm run build` and `npm test`

## Dev Notes

- Stack: Angular 20, RxJS, Signals, Angular Material, Bootstrap 5, ngx-translate
- Routes use `/books` as browse entry (maps to architecture `/browse` intent)
- Do NOT implement full feature business logic in this story (Epics 1–7)
- SSR/SSG/Angular Universal explicitly excluded per architecture

## Dev Agent Record

### Implementation Plan

- Scaffold `kitab-web` as standalone Angular 20 CSR app with feature folders under `src/app/features/`
- Wire `provideHttpClient` with functional interceptors and `TranslateModule.forRoot` + HTTP loader
- Implement signal-based `AuthService` and `TranslationService` with RTL document updates
- Add responsive `ShellComponent` using Material sidenav + toolbar and Bootstrap-friendly global styles
- Add Vitest specs for guards, interceptor, translation, and root component

### Completion Notes

- ✅ `npm run build` succeeds; production bundle generated under `dist/kitab-web`
- ✅ 7 unit tests pass across app shell, auth guard, auth interceptor, and translation service
- ✅ Environment file replacements configured for development and production builds
- ✅ RTL support via `TranslationService` setting `html[lang]` and `body[dir]`, plus `_rtl.scss` helpers

## File List

- kitab-web/package.json
- kitab-web/package-lock.json
- kitab-web/angular.json
- kitab-web/tsconfig.json
- kitab-web/tsconfig.app.json
- kitab-web/tsconfig.spec.json
- kitab-web/src/main.ts
- kitab-web/src/index.html
- kitab-web/src/styles.scss
- kitab-web/src/styles/_rtl.scss
- kitab-web/src/environments/environment.ts
- kitab-web/src/environments/environment.development.ts
- kitab-web/src/environments/environment.prod.ts
- kitab-web/public/assets/i18n/en.json
- kitab-web/public/assets/i18n/ar.json
- kitab-web/src/app/app.ts
- kitab-web/src/app/app.html
- kitab-web/src/app/app.scss
- kitab-web/src/app/app.config.ts
- kitab-web/src/app/app.routes.ts
- kitab-web/src/app/app.spec.ts
- kitab-web/src/app/core/index.ts
- kitab-web/src/app/core/guards/auth.guard.ts
- kitab-web/src/app/core/guards/auth.guard.spec.ts
- kitab-web/src/app/core/guards/admin.guard.ts
- kitab-web/src/app/core/guards/guest.guard.ts
- kitab-web/src/app/core/interceptors/auth.interceptor.ts
- kitab-web/src/app/core/interceptors/auth.interceptor.spec.ts
- kitab-web/src/app/core/interceptors/error.interceptor.ts
- kitab-web/src/app/core/services/api.service.ts
- kitab-web/src/app/core/services/api-auth.client.ts
- kitab-web/src/app/core/services/auth.service.ts
- kitab-web/src/app/core/services/translation.service.ts
- kitab-web/src/app/core/services/translation.service.spec.ts
- kitab-web/src/app/core/tokens/storage.token.ts
- kitab-web/src/app/layouts/shell/shell.component.ts
- kitab-web/src/app/layouts/shell/shell.component.html
- kitab-web/src/app/layouts/shell/shell.component.scss
- kitab-web/src/app/shared/index.ts
- kitab-web/src/app/shared/models/api.models.ts
- kitab-web/src/app/shared/components/page-header/page-header.component.ts
- kitab-web/src/app/shared/components/empty-state/empty-state.component.ts
- kitab-web/src/app/shared/components/loading-spinner/loading-spinner.component.ts
- kitab-web/src/app/features/not-found/not-found.component.ts
- kitab-web/src/app/features/books/browse/browse.component.ts
- kitab-web/src/app/features/books/detail/detail.component.ts
- kitab-web/src/app/features/books/editor/editor.component.ts
- kitab-web/src/app/features/auth/login/login.component.ts
- kitab-web/src/app/features/auth/register/register.component.ts
- kitab-web/src/app/features/categories/category-list/category-list.component.ts
- kitab-web/src/app/features/requests/request-list/request-list.component.ts
- kitab-web/src/app/features/wishlist/wishlist-page/wishlist-page.component.ts
- kitab-web/src/app/features/notifications/notification-center/notification-center.component.ts
- kitab-web/src/app/features/admin/dashboard/dashboard.component.ts

## Change Log

- 2026-06-10: Scaffolded Angular 20 frontend with core, shared, layout, feature routes, i18n, Material, Bootstrap, guards, interceptors, and tests
