---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: architecture
project_name: Peer-to-Peer Book Exchange System
user_name: Ahmed Ragab
date: 2026-06-09
lastStep: 8
status: complete
completedAt: 2026-06-09
inputDocuments:
  - prds/prd-peer-to-peer-book-exchange-2026-06-09/prd.md
  - prds/prd-peer-to-peer-book-exchange-2026-06-09/addendum.md
  - ux-designs/ux-peer-to-peer-book-exchange-2026-06-09/DESIGN.md
  - ux-designs/ux-peer-to-peer-book-exchange-2026-06-09/EXPERIENCE.md
---

# Architecture Decision Document — Peer-to-Peer Book Exchange System (Kitab)

_This document is the single source of truth for technical decisions. AI agents and developers must follow it consistently._

**Related artifacts:**
- PRD: `prds/prd-peer-to-peer-book-exchange-2026-06-09/prd.md`
- UX: `ux-designs/ux-peer-to-peer-book-exchange-2026-06-09/`
- ERD: `erd-peer-to-peer-book-exchange.md`

---

## Project Context Analysis

### Requirements Overview

**Functional Requirements (55 FRs across 12 areas):**

| Area | FRs | Architectural implication |
|------|-----|---------------------------|
| Auth & RBAC | FR-1–5 | JWT + role claims; ASP.NET Identity or custom user store |
| Listings CRUD | FR-6–14 | Aggregate root `Listing`; file storage for photos; validation pipeline |
| Search & Filter | FR-15–18 | Query layer with EF Core + indexed columns; pagination |
| Requests | FR-19–27 | State machine `Pending → Accepted/Rejected`; no chat subsystem |
| Wishlist | FR-28–31 | Join table; optional background job for availability alerts |
| Transaction History | FR-32–34 | Event on accept; immutable audit records |
| Notifications | FR-35–38 | In-app notification table; poll or SignalR (defer real-time to post-MVP) |
| Admin | FR-39–52 | Separate authorization policy; analytics read models |
| i18n & UI | FR-53–55 | Frontend i18n; API returns locale-neutral data |

**Non-Functional Requirements:**

| NFR | Target | Architecture response |
|-----|--------|----------------------|
| NFR-1–3 | API ≤500ms p95; 50 concurrent users | EF indexes, pagination, no N+1; SQL Server on same host for demo |
| NFR-4–8 | JWT, hashed passwords, upload validation | ASP.NET Identity + FluentValidation + file type whitelist |
| NFR-9–11 | SQL Server, soft-delete, idempotent accept | EF migrations; unique constraint on request accept; transactions |
| NFR-12–14 | Clean Architecture, CQRS, Swagger | 4-project solution; MediatR pipeline behaviors |
| NFR-15–19 | WCAG A, i18n, RTL | Angular 20 CSR SPA with Angular Material, ngx-translate, and logical SCSS |

### Scale & Complexity

| Indicator | Assessment |
|-----------|------------|
| **Primary domain** | Full-stack web (ASP.NET API + Angular CSR SPA) |
| **Complexity** | Medium — bounded context, no payments/chat/real-time |
| **Multi-tenancy** | No — single marketplace |
| **Regulatory** | Minimal — no PCI; basic user data protection |
| **Estimated components** | 4 backend layers, 1 SPA, 1 database, local/blob file storage |

### Technical Constraints & Dependencies

- **Mandatory stack (hackathon):** ASP.NET Core Web API, Clean Architecture, CQRS, MediatR, EF Core, SQL Server, JWT, AutoMapper, Swagger
- **Frontend stack:** Angular 20 CSR SPA, standalone components, Angular Router, HttpClient, Signals, SCSS, Angular Material, ngx-translate, JWT auth, route guards, and HTTP interceptor
- **Explicit frontend exclusions:** Angular Universal, SSR, and SSG are not allowed
- **Explicit non-goals:** Chat, payments, shipping, native apps, OAuth (MVP)

### Cross-Cutting Concerns

1. **Authentication & authorization** — Guest (anonymous), User, Admin policies
2. **Validation** — FluentValidation in Application layer; never in controllers
3. **Mapping** — AutoMapper profiles in Application; DTOs at API boundary only
4. **Error handling** — Global exception middleware; consistent `ProblemDetails` responses
5. **Localization** — Frontend-only for MVP; API uses invariant culture for dates/numbers in JSON (ISO 8601)
6. **File uploads** — Listing photos via multipart; stored in `wwwroot/uploads` (dev) or Azure Blob (prod option)
7. **Notifications** — Created synchronously on domain events in MVP; no message broker

---

## Starter Template Evaluation

### Primary Technology Domain

Full-stack: **.NET 8 Web API backend** + **Angular 20 TypeScript CSR SPA frontend**.

### Starter Options Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Jason Taylor Clean Architecture template** | MediatR, EF, validation pre-wired | May include extras to trim | ✅ Backend base |
| **dotnet new webapi** | Minimal, full control | Manual Clean Architecture setup | Alternative |
| **Angular CLI standalone app** | Angular 20, Router, HttpClient, SCSS, lazy routes, Material-friendly | More framework structure than Vite | ✅ Frontend base |

### Selected Starters

#### Backend: Clean Architecture Solution (manual scaffold aligned with Jason Taylor pattern)

**Rationale:** Matches hackathon-required patterns (CQRS, MediatR, EF Core) without fighting template conventions.

**Initialization:**

```bash
dotnet new sln -n Kitab
dotnet new classlib -n Kitab.Domain -o src/Kitab.Domain
dotnet new classlib -n Kitab.Application -o src/Kitab.Application
dotnet new classlib -n Kitab.Infrastructure -o src/Kitab.Infrastructure
dotnet new webapi -n Kitab.API -o src/Kitab.API
dotnet sln add src/Kitab.Domain src/Kitab.Application src/Kitab.Infrastructure src/Kitab.API
```

**Key packages (Application):** `MediatR`, `FluentValidation`, `AutoMapper`  
**Key packages (Infrastructure):** `Microsoft.EntityFrameworkCore.SqlServer`, `Microsoft.AspNetCore.Identity.EntityFrameworkCore`  
**Key packages (API):** `Swashbuckle.AspNetCore`, `Microsoft.AspNetCore.Authentication.JwtBearer`

**Runtime:** .NET 8.0.27 SDK (LTS, per [Microsoft download](https://dotnet.microsoft.com/download/dotnet/8.0)); C# 12

#### Frontend: Angular 20 + TypeScript

```bash
npx @angular/cli@20 new kitab-web --standalone --routing --style=scss --ssr=false
cd kitab-web
ng add @angular/material
npm install @ngx-translate/core @ngx-translate/http-loader
```

**Rationale:** Angular 20 provides a strongly structured CSR frontend for the hackathon MVP: standalone components, lazy loaded routes, guards, interceptors, HttpClient, Signals, Angular Material accessibility primitives, SCSS theming, and clear feature boundaries. Angular Universal, SSR, and SSG remain excluded.

---

## Core Architectural Decisions

### Decision Priority Analysis

**Critical (block implementation):**
- SQL Server + EF Core Code First
- JWT authentication with role claims
- CQRS via MediatR (commands mutate, queries read)
- REST API with OpenAPI
- Angular CSR SPA as sole client

**Important (shape architecture):**
- Local filesystem image storage for MVP
- Soft-delete on Listing and User
- Polling for notifications (no WebSocket in MVP)
- Admin policy `RequireAdminRole`

**Deferred (post-MVP):**
- Azure Blob storage
- SignalR real-time notifications
- Email/SMS notifications
- Refresh tokens
- Elasticsearch relevance search

### Data Architecture

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database | SQL Server 2022 / LocalDB (dev) | Hackathon requirement |
| ORM | EF Core 8.x Code First | Migrations, LINQ, SQL Server provider |
| Modeling | Relational normalized schema | See ERD document |
| IDs | `Guid` for all PKs | Safe for distributed clients, no sequential leak |
| Timestamps | `DateTimeOffset` UTC | `CreatedAt`, `UpdatedAt` on auditable entities |
| Soft delete | `IsDeleted` flag on Listing, User | Admin audit; exclude from default queries |
| Caching | None in MVP | Simplicity; add Redis post-MVP if needed |
| Migrations | EF Core migrations in Infrastructure | `dotnet ef migrations add` |

**Indexing strategy:**
- `Listings`: index on `(Status, CreatedAt DESC)`, `(CategoryId)`, `(Title, Author)` for search
- `ContactRequests`: index on `(TargetListingId, Status)`, `(RequesterId)`
- `Notifications`: index on `(UserId, IsRead, CreatedAt DESC)`

### Authentication & Security

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth | JWT Bearer | Hackathon requirement |
| User store | ASP.NET Core Identity | Password hashing, role management built-in |
| Registration | Email or phone as username | FR-1; phone stored as normalized string (no SMS OTP in MVP) |
| Token expiry | Access token 60 minutes | Sufficient for demo; refresh token deferred |
| Roles | `User`, `Admin` | Guest = unauthenticated; no `Guest` role in DB |
| Admin provisioning | Seed on startup | FR-5; no public admin registration |
| Password policy | Min 8 chars, digit required | Balance security vs hackathon friction |
| Upload security | Whitelist JPEG/PNG/WebP; max 5MB/image; max 5 images | PRD NFR-7, assumption A-3 |
| HTTPS | Required in production | Development may use HTTP |
| CORS | Allow SPA origin only | Configured in API `Program.cs` |

**JWT claims:** `sub` (userId), `email`, `role`, `name`

### API & Communication Patterns

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API style | REST JSON | Hackathon, Swagger-friendly |
| Versioning | None in MVP | Single `/api` prefix |
| Response wrapper | Direct resource or `PagedResult<T>` | No generic `{ data, error }` wrapper |
| Errors | RFC 7807 `ProblemDetails` | `{ title, status, detail, errors? }` |
| Pagination | `?page=1&pageSize=20` | Response header `X-Total-Count` optional |
| Sort | `?sort=newest` or `relevance` | Relevance = simple LIKE score in MVP |
| Status codes | 200 OK, 201 Created, 204 No Content, 400, 401, 403, 404, 409 Conflict | 409 for double-accept, invalid exchange |
| Idempotency | Accept/Reject guarded by DB transaction + status check | NFR-11 |

**Contact request state machine:**

```
Pending ──accept──► Accepted (terminal)
        └──reject──► Rejected (terminal)
```

On `Accepted` (sale): create `TransactionHistory` for both parties; optionally notify.  
On `Accepted` (exchange): mark both listings `Exchanged`; create history for both users.

### Frontend Architecture

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Angular 20 + TypeScript | Required frontend stack; mature SPA structure |
| Rendering | Client-Side Rendering only | Angular Universal, SSR, and SSG are explicitly prohibited |
| Component model | Standalone components by default | Less NgModule ceremony; compatible with lazy standalone routes |
| Build | Angular CLI / esbuild application builder | Official Angular build pipeline |
| Styling | SCSS + Angular Material theming | Responsive, accessible UI primitives aligned to design tokens |
| Routing | Angular Router with lazy loaded standalone routes | S-01–S-24 routes per EXPERIENCE.md with small initial bundle |
| State | Angular Signals for local/UI state; lightweight services for shared feature state | Avoid NgRx overhead for MVP; keep state close to features |
| Forms | Angular Reactive Forms + typed validators | Listing, auth, request, admin forms |
| i18n | ngx-translate | Runtime Arabic/English switching |
| RTL | `Directionality`/CDK bidi + logical SCSS properties | Arabic RTL + English LTR without duplicated layouts |
| API client | Angular HttpClient + auth/error interceptors | Attach JWT, normalize ProblemDetails, redirect on 401 |
| Auth storage | `localStorage` access token | MVP simplicity; move to httpOnly cookies post-MVP if needed |

#### Updated Frontend Architecture

The frontend is a separate Angular 20 CSR application under `kitab-web/` that consumes the ASP.NET Core REST API. It must not include Angular Universal server entry points, prerender configuration, SSR providers, or SSG output targets.

Angular application composition:
- `main.ts` bootstraps `AppComponent` with `app.config.ts`
- `app.config.ts` registers router, HttpClient, interceptors, animations, Material providers, and ngx-translate
- Feature areas are loaded through `loadChildren` route files or `loadComponent` for small standalone pages
- Shared UI is split between Material-based shell components and domain-specific presentational components
- Cross-cutting browser concerns live in `core/`; reusable UI and pipes live in `shared/`; business features live in `features/`

#### Folder Structure

```text
kitab-web/
├── angular.json
├── package.json
├── src/
│   ├── main.ts
│   ├── index.html
│   ├── styles.scss
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── assets/
│   │   └── i18n/
│   │       ├── en.json
│   │       └── ar.json
│   └── app/
│       ├── app.component.ts
│       ├── app.config.ts
│       ├── app.routes.ts
│       ├── core/
│       │   ├── api/
│       │   │   ├── api-endpoints.ts
│       │   │   ├── api-error.model.ts
│       │   │   └── problem-details.model.ts
│       │   ├── auth/
│       │   │   ├── auth.guard.ts
│       │   │   ├── admin.guard.ts
│       │   │   ├── auth.interceptor.ts
│       │   │   ├── auth.service.ts
│       │   │   └── token-storage.service.ts
│       │   ├── i18n/
│       │   │   ├── language.service.ts
│       │   │   └── translate-loader.ts
│       │   └── layout/
│       │       ├── app-shell.component.ts
│       │       ├── top-nav.component.ts
│       │       └── mobile-nav.component.ts
│       ├── shared/
│       │   ├── components/
│       │   ├── pipes/
│       │   └── validators/
│       └── features/
│           ├── auth/
│           ├── listings/
│           ├── requests/
│           ├── wishlist/
│           ├── notifications/
│           ├── history/
│           └── admin/
```

#### Component Hierarchy

```text
AppComponent
└── AppShellComponent
    ├── TopNavComponent
    ├── MobileNavComponent
    ├── NotificationBellComponent
    └── RouterOutlet
        ├── BrowsePageComponent
        │   ├── SearchFiltersComponent
        │   └── ListingCardComponent[]
        ├── ListingDetailPageComponent
        │   ├── PhotoGalleryComponent
        │   └── ContactRequestPanelComponent
        ├── ListingEditorPageComponent
        │   └── ListingFormComponent
        ├── RequestsPageComponent
        │   ├── IncomingRequestsComponent
        │   └── OutgoingRequestsComponent
        ├── WishlistPageComponent
        ├── HistoryPageComponent
        ├── AuthPageComponent
        │   ├── LoginFormComponent
        │   └── RegisterFormComponent
        └── AdminShellComponent
            ├── AdminDashboardComponent
            ├── CategoryManagementComponent
            ├── ModerationQueueComponent
            └── UserManagementComponent
```

#### Routing Plan

| Route | Load strategy | Access | Primary component |
|-------|---------------|--------|-------------------|
| `/` | Redirect | Public | Redirect to `/browse` |
| `/browse` | Lazy standalone route | Public | `BrowsePageComponent` |
| `/listings/:id` | Lazy standalone route | Public | `ListingDetailPageComponent` |
| `/listings/new` | Lazy standalone route | User | `ListingEditorPageComponent` |
| `/listings/:id/edit` | Lazy standalone route | Owner checked by API | `ListingEditorPageComponent` |
| `/requests` | Lazy standalone route | User | `RequestsPageComponent` |
| `/wishlist` | Lazy standalone route | User | `WishlistPageComponent` |
| `/history` | Lazy standalone route | User | `HistoryPageComponent` |
| `/notifications` | Lazy standalone route | User | `NotificationsPageComponent` |
| `/auth/login` | Lazy standalone route | Public-only redirect if authenticated | `LoginPageComponent` |
| `/auth/register` | Lazy standalone route | Public-only redirect if authenticated | `RegisterPageComponent` |
| `/admin` | Lazy route group | Admin | `AdminShellComponent` |
| `/admin/categories` | Child lazy route | Admin | `CategoryManagementComponent` |
| `/admin/moderation` | Child lazy route | Admin | `ModerationQueueComponent` |
| `/admin/users` | Child lazy route | Admin | `UserManagementComponent` |
| `**` | Eager or lazy | Public | `NotFoundPageComponent` |

Route guards:
- `authGuard`: requires a valid JWT in `AuthService`
- `adminGuard`: requires `role=Admin`
- `publicOnlyGuard`: redirects authenticated users away from login/register

#### Service Architecture

| Service | Scope | Responsibility |
|---------|-------|----------------|
| `AuthService` | `core/auth` singleton | Login/register/logout, current user signal, role checks |
| `TokenStorageService` | `core/auth` singleton | Read/write/remove access token from `localStorage` |
| `LanguageService` | `core/i18n` singleton | Switch Arabic/English, update `html[lang]`, `html[dir]`, and Material direction |
| `ListingsApiService` | `features/listings/data-access` | Browse/search/get/create/update/delete listings |
| `RequestsApiService` | `features/requests/data-access` | Send/accept/reject contact requests |
| `WishlistApiService` | `features/wishlist/data-access` | Wishlist add/remove/list |
| `NotificationsApiService` | `features/notifications/data-access` | Poll unread notifications and mark read |
| `AdminApiService` | `features/admin/data-access` | Admin category, moderation, user, analytics endpoints |
| `ToastService` | `shared` or `core` | Display translated success/error feedback |

Interceptors:
- `authInterceptor`: appends `Authorization: Bearer <token>` for API-origin requests
- `apiErrorInterceptor`: maps RFC 7807 `ProblemDetails` into user-facing translated messages and redirects on 401

#### State Management Recommendation

Use Angular Signals and RxJS together, without NgRx for MVP:
- Signals hold current user, language, direction, filters, selected tabs, loading flags, and lightweight feature view state
- HttpClient calls return Observables; convert to signals with `toSignal` only at component/facade boundaries
- Feature facades may expose readonly signals for repeated views such as browse filters, request lists, notification counts, and admin dashboard summaries
- Avoid global mutable stores for server data; refresh server state through feature services after mutations
- Reconsider NgRx Signal Store post-MVP only if cross-feature state becomes complex

#### Authentication Flow

1. Login/register form posts credentials through `AuthService`.
2. API returns JWT and user profile/roles.
3. `TokenStorageService` persists the access token in `localStorage`.
4. `AuthService` decodes/loads current user and exposes `currentUser`, `isAuthenticated`, and `isAdmin` signals.
5. `authInterceptor` attaches the JWT to protected API calls.
6. `authGuard` protects user routes; `adminGuard` protects admin routes.
7. On 401, `apiErrorInterceptor` clears auth state and routes to `/auth/login` with a return URL.
8. Logout clears token, user signal, feature caches, and navigates to `/browse`.

#### API Integration Strategy

- Base URL comes from `environment.apiBaseUrl`.
- Angular models mirror API DTOs with camelCase properties.
- All API calls use HttpClient typed methods: `get<T>`, `post<T>`, `put<T>`, `delete<void>`.
- Query params use `HttpParams` for search/filter/pagination.
- File uploads use `FormData` for listing photos; do not manually set multipart boundaries.
- API errors follow `ProblemDetails`; the interceptor extracts `detail` and validation `errors`.
- Mutations refresh affected feature state: send request refreshes listing/request panels; accept/reject refreshes requests, listings, notifications, and history.
- Keep API-specific DTO mapping in data-access services; components consume view models or typed DTOs, never raw `HttpResponse` unless pagination headers are needed.

### Infrastructure & Deployment

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Dev environment | API on `:5000`, SPA on `:4200` | Angular CLI dev server + Kestrel |
| Database (dev) | SQL Server LocalDB or Docker | `docker-compose.yml` provided |
| File storage (dev) | `src/Kitab.API/wwwroot/uploads` | Zero cloud dependency |
| Deployment (demo) | Static Angular build + ASP.NET Core API + Azure SQL or SQL Server | CSR static assets are simple to host |
| CI/CD | GitHub Actions: build + test | Optional for hackathon |
| Logging | Serilog to console + file | Structured logs for admin actions |
| Secrets | `appsettings.Development.json` + User Secrets | JWT key never in repo |

#### Deployment Recommendations

- Build Angular with `ng build --configuration production`; output is static CSR assets only.
- Host Angular separately on Azure Static Web Apps, Azure Storage Static Website, Netlify, Vercel static hosting, or Nginx/IIS static hosting.
- Do not enable Angular Universal, prerender, SSR server bundles, or SSG output.
- Configure static host fallback rewrites so all non-file routes return `index.html` for Angular Router deep links.
- Host the ASP.NET Core API separately on Azure App Service, VM, container, or IIS/Kestrel.
- Configure API CORS to allow only the deployed Angular origin and local dev origin.
- Inject `apiBaseUrl` through Angular environment replacement at build time or a runtime `assets/config.json` if the same build must move across environments.
- Keep JWT signing keys and database connection strings in server-side secrets only.
- Use HTTPS for both frontend and API; reject mixed-content API calls.

### Decision Impact Analysis

**Implementation sequence:**
1. Solution scaffold + EF entities + migrations
2. Identity + JWT + auth endpoints
3. Listing CRUD + photo upload
4. Search/filter query
5. Contact requests + accept/reject
6. Notifications + transaction history
7. Admin endpoints
8. Angular CSR SPA core flows
9. i18n + RTL polish

**Cross-component dependencies:**
- Requests depend on Listings (valid status/type)
- Transaction history depends on request acceptance handler
- Notifications emitted from request/listing handlers
- Admin analytics = aggregate queries over existing tables

---

## Implementation Patterns & Consistency Rules

### Naming Patterns

**Database (EF Core):**
- Tables: PascalCase plural (`Listings`, `ContactRequests`, `WishlistItems`)
- Columns: PascalCase (`OwnerId`, `CreatedAt`)
- FK columns: `{NavigationProperty}Id` (`CategoryId`, `RequesterId`)
- Indexes: `IX_{Table}_{Columns}`

**API:**
- Routes: lowercase plural `/api/listings`, `/api/requests`
- Route params: `{id}` GUID
- Query params: camelCase (`pageSize`, `minPrice`)
- JSON properties: camelCase (ASP.NET default)

**C# code:**
- Commands: `{Verb}{Entity}Command` → `CreateListingCommand`
- Queries: `Get{Entity}Query` / `Search{Entity}Query`
- Handlers: `{Command}Handler`
- DTOs: `{Entity}Dto`, `Create{Entity}Request`
- Validators: `{Command}Validator`
- Controllers: `{Entity}Controller` — thin; delegate to MediatR only

**Angular/TypeScript:**
- Standalone components: kebab-case files with role suffix, e.g. `listing-card.component.ts`
- Services: `{feature}.api.service.ts`, `{feature}.facade.ts`, `auth.service.ts`
- Guards/interceptors: `{purpose}.guard.ts`, `{purpose}.interceptor.ts`
- Routes: `{feature}.routes.ts`
- Models: PascalCase interfaces matching API DTOs in `*.model.ts`

### Structure Patterns

**Backend feature folders in Application:**

```
Kitab.Application/
├── Common/           # Behaviors, interfaces, mappings, models
├── Listings/
│   ├── Commands/
│   ├── Queries/
│   └── EventHandlers/
├── Requests/
├── Auth/
├── Wishlist/
├── Notifications/
├── Transactions/
└── Admin/
```

**Angular feature folders:**

```
src/
├── app/
│   ├── core/          # singleton services, guards, interceptors, shell
│   ├── shared/        # reusable Material wrappers, components, pipes, validators
│   └── features/
│       ├── listings/
│       ├── requests/
│       ├── auth/
│       └── admin/
├── assets/i18n/       # en.json, ar.json
└── styles.scss
```

**Angular feature slice pattern:**

```
features/listings/
├── pages/
│   ├── browse-page.component.ts
│   ├── listing-detail-page.component.ts
│   └── listing-form.component.ts
├── data-access/
│   ├── listings.api.service.ts
│   ├── listings.facade.ts
│   └── listing.model.ts
├── ui/
│   ├── listing-card.component.ts
│   └── search-filters.component.ts
└── listings.routes.ts
```

**Tests:**
- Backend: `tests/Kitab.Application.Tests`, `tests/Kitab.API.IntegrationTests`
- Frontend: co-located `*.spec.ts` for critical components, services, guards, and interceptors

### Format Patterns

**API success — single resource:**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "title": "1984",
  "author": "George Orwell",
  "price": 85.00,
  "listingType": "ForSale",
  "condition": "Good",
  "status": "Available",
  "createdAt": "2026-06-09T10:00:00Z"
}
```

**API success — paged:**
```json
{
  "items": [ /* ListingSummaryDto[] */ ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 248
}
```

**API error (ProblemDetails):**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Validation failed",
  "status": 400,
  "errors": {
    "Price": ["Price is required for sale listings."]
  }
}
```

**Dates:** ISO 8601 UTC strings in JSON.  
**Enums:** string serialization (`"ForSale"`, `"ForExchange"`, `"Pending"`).

### Communication Patterns

**Domain events (in-process, MVP):**
- `ListingStatusChangedEvent` → wishlist notification handler
- `RequestAcceptedEvent` → transaction history + notification handlers

Use MediatR `INotification` for domain side-effects within same process — no external bus in MVP.

**Frontend server state:**
- Feature facades expose signals such as `listings`, `selectedListing`, `incomingRequests`, `unreadCount`, and `isLoading`
- Reload affected service data on mutation: accept request → refresh `requests` + `listings` + `transactions`

### Process Patterns

**Validation:** FluentValidation in Application pipeline behavior; runs before handler.

**Authorization:** `[Authorize]` on controllers; `[Authorize(Roles = "Admin")]` on admin routes; resource checks in handlers (e.g., `listing.OwnerId == currentUserId`).

**Loading states:** Feature-level Signals such as `isLoading` / `isSaving`; Material progress indicators and skeleton components per UX State Patterns.

**Error handling:** API global exception handler → ProblemDetails; SPA toast on mutation error with `detail` message.

**Accept/Reject concurrency:**
```csharp
// Pseudocode — handler must use transaction
var request = await repo.GetForUpdate(id);
if (request.Status != RequestStatus.Pending) throw new ConflictException();
request.Accept();
// side effects in same transaction
```

### Enforcement Guidelines

**All AI agents MUST:**
- Place business logic in Application handlers, not controllers
- Use MediatR for all reads/writes from API layer
- Never expose domain entities from API — DTOs only
- Follow ERD table/column names exactly
- Use camelCase JSON and ProblemDetails for errors
- Match EXPERIENCE.md surface IDs to Angular routes

**Anti-patterns:**
- ❌ Chat/messaging tables or endpoints
- ❌ Direct `DbContext` in controllers
- ❌ `left`/`right` CSS (use logical properties for RTL)
- ❌ Storing images as DB BLOBs
- ❌ Angular Universal, SSR, SSG, or prerender output

---

## Project Structure & Boundaries

### Complete Project Directory Structure

```
kitab/
├── README.md
├── docker-compose.yml              # SQL Server + optional API
├── .github/workflows/ci.yml
│
├── src/
│   ├── Kitab.Domain/
│   │   ├── Entities/
│   │   │   ├── User.cs
│   │   │   ├── Listing.cs
│   │   │   ├── ListingPhoto.cs
│   │   │   ├── Category.cs
│   │   │   ├── ContactRequest.cs
│   │   │   ├── WishlistItem.cs
│   │   │   ├── TransactionHistory.cs
│   │   │   ├── Notification.cs
│   │   │   ├── ListingReport.cs
│   │   │   └── PlatformSetting.cs
│   │   ├── Enums/
│   │   │   ├── ListingType.cs
│   │   │   ├── ListingCondition.cs
│   │   │   ├── ListingStatus.cs
│   │   │   ├── RequestStatus.cs
│   │   │   └── TransactionType.cs
│   │   └── Common/                 # BaseEntity, IAuditable
│   │
│   ├── Kitab.Application/
│   │   ├── Common/
│   │   │   ├── Behaviours/         # Validation, Logging
│   │   │   ├── Interfaces/         # IApplicationDbContext, IFileStorage
│   │   │   ├── Mappings/
│   │   │   └── Models/             # PagedResult, Result
│   │   ├── Listings/
│   │   ├── Requests/
│   │   ├── Auth/
│   │   ├── Wishlist/
│   │   ├── Notifications/
│   │   ├── Transactions/
│   │   └── Admin/
│   │
│   ├── Kitab.Infrastructure/
│   │   ├── Persistence/
│   │   │   ├── ApplicationDbContext.cs
│   │   │   ├── Configurations/     # Fluent API per entity
│   │   │   └── Migrations/
│   │   ├── Identity/
│   │   ├── Services/
│   │   │   ├── FileStorageService.cs
│   │   │   ├── JwtTokenService.cs
│   │   │   └── NotificationService.cs
│   │   └── DependencyInjection.cs
│   │
│   └── Kitab.API/
│       ├── Controllers/
│       │   ├── AuthController.cs
│       │   ├── ListingsController.cs
│       │   ├── RequestsController.cs
│       │   ├── WishlistController.cs
│       │   ├── NotificationsController.cs
│       │   ├── TransactionsController.cs
│       │   └── Admin/
│       ├── Middleware/
│       │   └── ExceptionHandlingMiddleware.cs
│       ├── appsettings.json
│       ├── Program.cs
│       └── wwwroot/uploads/
│
├── tests/
│   ├── Kitab.Application.Tests/
│   └── Kitab.API.IntegrationTests/
│
└── kitab-web/                      # Angular 20 CSR SPA
    ├── package.json
    ├── angular.json
    ├── src/
    │   ├── main.ts
    │   ├── styles.scss
    │   ├── app/
    │   │   ├── app.component.ts
    │   │   ├── app.config.ts
    │   │   ├── app.routes.ts
    │   │   ├── core/
    │   │   ├── shared/
    │   │   └── features/
    │   └── assets/i18n/
    └── public/
```

### Architectural Boundaries

```
┌─────────────────┐     HTTPS/JSON      ┌─────────────────┐
│   kitab-web     │ ◄─────────────────► │   Kitab.API     │
│ (Angular CSR SPA)│    JWT Bearer      │   (Controllers) │
└─────────────────┘                     └────────┬────────┘
                                                 │ MediatR
                                        ┌────────▼────────┐
                                        │ Kitab.Application│
                                        │ (Handlers)       │
                                        └────────┬────────┘
                                                 │
                        ┌────────────────────────┼────────────────────────┐
                        │                        │                        │
               ┌────────▼────────┐    ┌─────────▼─────────┐    ┌─────────▼─────────┐
               │ Kitab.Domain    │    │ Kitab.Infrastructure│    │ File System / Blob │
               │ (Entities)      │    │ (EF Core, Identity) │    │ (Listing photos)   │
               └─────────────────┘    └─────────┬─────────┘    └────────────────────┘
                                                │
                                       ┌────────▼────────┐
                                       │   SQL Server    │
                                       └─────────────────┘
```

**Layer rules:**
- Domain → no dependencies
- Application → Domain only
- Infrastructure → Application + Domain
- API → Application (+ Infrastructure DI registration)

### Requirements to Structure Mapping

| FR Category | Backend location | Frontend location |
|-------------|------------------|-------------------|
| Auth FR-1–5 | `Application/Auth`, `API/AuthController` | `features/auth/` |
| Listings FR-6–14 | `Application/Listings` | `features/listings/` |
| Search FR-15–18 | `Application/Listings/Queries/SearchListingsQuery` | `features/listings/BrowsePage` |
| Requests FR-19–27 | `Application/Requests` | `features/requests/` |
| Wishlist FR-28–31 | `Application/Wishlist` | `features/wishlist/` |
| History FR-32–34 | `Application/Transactions` | `features/history/` |
| Notifications FR-35–38 | `Application/Notifications` | `components/NotificationBell` |
| Admin FR-39–52 | `Application/Admin`, `API/Admin/*` | `features/admin/` |
| i18n FR-53–55 | N/A (API invariant) | `assets/i18n/`, `LanguageService`, Angular CDK bidi |

### Data Flow — Accept Exchange Request

```
Client POST /api/requests/{id}/accept
  → RequestsController
  → AcceptRequestCommand
  → AcceptRequestHandler (transaction)
      → Validate Pending + valid offered listing
      → Update ContactRequest.Status = Accepted
      → Update both Listings.Status = Exchanged
      → Insert 2× TransactionHistory
      → Insert 2× Notification
  → 200 OK + RequestDto
```

---

## Architecture Validation Results

### Coherence Validation ✅

- .NET 8 + EF Core 8 + SQL Server: compatible, LTS-aligned
- CQRS via MediatR fits Clean Architecture layer boundaries
- Angular CSR SPA + REST + JWT: standard, no conflicting paradigms
- No chat subsystem — request model matches PRD non-goals
- Patterns (camelCase JSON, PascalCase DB) consistent with ASP.NET defaults

### Requirements Coverage Validation ✅

| FR range | Covered by |
|----------|------------|
| FR-1–5 | Identity + JWT + role policies |
| FR-6–14 | Listing aggregate + FileStorageService |
| FR-15–18 | SearchListingsQuery + indexes |
| FR-19–27 | ContactRequest entity + state machine |
| FR-28–31 | WishlistItem + optional event handler |
| FR-32–34 | TransactionHistory on accept handler |
| FR-35–38 | Notification entity + API |
| FR-39–52 | Admin handlers + policies |
| FR-53–55 | ngx-translate + Angular Material/CDK RTL layout |

All NFRs addressed in decisions above.

### Implementation Readiness ✅

- Complete project tree defined
- ERD documented separately with columns and relationships
- API endpoint list in addendum aligned with controllers
- CQRS command/query naming conventions specified
- UX routes mapped to Angular features

### Gap Analysis

| Priority | Gap | Mitigation |
|----------|-----|------------|
| Low | Refresh tokens | Defer; re-login on 401 in MVP |
| Low | Azure Blob | Local storage sufficient for demo |
| Low | SignalR notifications | Poll `/api/notifications` every 30s or on navigation |
| Low | Relevance search | `ORDER BY` title/author LIKE match score |

### Architecture Completeness Checklist

**Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — bounded MVP scope, mandated stack, complete PRD/UX inputs

**Key Strengths:**
- Clean Architecture enforces testable, consistent agent implementations
- CQRS maps 1:1 to API endpoints and user stories
- No chat/payment scope creep
- ERD and API surface pre-defined

**Areas for Future Enhancement:**
- SignalR notifications
- Azure Blob + CDN for images
- .NET 10 LTS migration after hackathon
- Elasticsearch for relevance ranking

### Implementation Handoff

**AI Agent Guidelines:**
1. Read this document + ERD before writing code
2. Scaffold solution structure exactly as specified
3. Implement vertical slices: handler + validator + controller + test per feature
4. Match UX routes in `EXPERIENCE.md` when building Angular pages
5. Never add chat, payment, or cart features

**First Implementation Priority:**
```bash
dotnet new sln -n Kitab && # ... scaffold per Starter Template section
dotnet ef migrations add InitialCreate -p src/Kitab.Infrastructure -s src/Kitab.API
npx @angular/cli@20 new kitab-web --standalone --routing --style=scss --ssr=false
```

---

*Next recommended: `bmad-create-epics-and-stories` for sprint backlog, then `bmad-dev-story` for implementation.*
