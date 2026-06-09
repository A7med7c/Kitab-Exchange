---
title: Kitab Angular UI Specification
project: Peer-to-Peer Book Exchange System
source_prd: ../../prds/prd-peer-to-peer-book-exchange-2026-06-09/prd.md
source_architecture: ../../architecture-peer-to-peer-book-exchange.md
framework: Angular 20
rendering: CSR only
status: draft
updated: 2026-06-09
---

# Kitab Angular UI Specification

This specification translates the approved PRD into an Angular 20 UI implementation contract. It assumes:

- Angular 20 with standalone components.
- Angular Router with lazy loaded standalone routes.
- Angular Material for core controls, overlays, tables, tabs, form fields, menus, snack bars, and dialogs.
- SCSS with logical properties for RTL/LTR.
- ngx-translate for English and Arabic strings.
- JWT authentication with route guards and HTTP interceptors.
- Client-Side Rendering only. Do not use Angular Universal, SSR, SSG, or prerender output.

## Global Shell

### Layout

- `AppComponent` bootstraps `AppShellComponent`.
- `AppShellComponent` owns the global header, mobile bottom navigation, router outlet, and notification region.
- Desktop uses top navigation plus account/admin menus.
- Mobile uses a compact top bar and bottom navigation for primary authenticated destinations.
- `dir` and `lang` are applied on the `html` element by `LanguageService`.

### Shared Angular Components

- `AppShellComponent`
- `TopNavComponent`
- `MobileNavComponent`
- `LanguageToggleComponent`
- `NotificationBellComponent`
- `PageHeaderComponent`
- `EmptyStateComponent`
- `ConfirmDialogComponent`
- `ResponsiveContainerComponent`
- `ListingCardComponent`
- `StatusPillComponent`
- `BookPhotoGalleryComponent`
- `AuthRequiredDialogComponent`

### Shared Services

- `LanguageService`
- `AuthService`
- `TokenStorageService`
- `ToastService`
- `BreakpointService`
- `UploadValidationService`

### Responsive Rules

- Mobile `< 768px`: single-column pages, bottom navigation, sticky primary actions, full-width Material dialogs presented as bottom sheets where appropriate.
- Tablet `768px-1023px`: two or three-column listing grids, still touch-first.
- Desktop `>= 1024px`: centered max-width content, denser grids, sidebars for filters/admin.

### RTL Rules

- Use CSS logical properties: `margin-inline`, `padding-inline`, `inset-inline-start`, `border-inline-start`.
- Avoid hard-coded `left` and `right`.
- Use Angular CDK `Directionality` for Material overlays and menus.
- Icons that imply direction, such as arrows, chevrons, and back buttons, must mirror in RTL.
- Numeric price, dates, and counters use locale-aware formatting.

## Route Map

| Page | Route | Access | Lazy entry |
|------|-------|--------|------------|
| Landing Page | `/` | Public | `landing.routes.ts` |
| Home | `/home` | User | `home.routes.ts` |
| Browse Books | `/browse` | Public | `listings.routes.ts` |
| Book Details | `/books/:id` | Public | `listing-detail.routes.ts` |
| Login | `/auth/login` | Guest/Public | `auth.routes.ts` |
| Register | `/auth/register` | Guest/Public | `auth.routes.ts` |
| Add Listing | `/listings/new` | User | `listing-editor.routes.ts` |
| Edit Listing | `/listings/:id/edit` | Owner/API enforced | `listing-editor.routes.ts` |
| My Listings | `/my-listings` | User | `my-listings.routes.ts` |
| Wishlist | `/wishlist` | User | `wishlist.routes.ts` |
| Contact Requests | `/requests/contact` | User | `requests.routes.ts` |
| Exchange Requests | `/requests/exchange` | User | `requests.routes.ts` |
| Notifications | `/notifications` | User | `notifications.routes.ts` |
| Profile | `/profile` | User | `profile.routes.ts` |
| Admin Dashboard | `/admin` | Admin | `admin.routes.ts` |

## Page Specifications

### 1. Landing Page

#### Layout

- Public first-touch page at `/`.
- Above-the-fold area: brand name, concise value proposition, search input, primary CTA to browse books, secondary CTA to add a listing.
- Below first fold: three functional bands: browse, list, request/accept. Keep the browse preview visible on mobile and desktop.
- Include a compact language toggle in the header.
- Do not require login to browse.

#### Components

- `LandingPageComponent`
- `LandingHeroComponent`
- `LandingSearchComponent`
- `FeaturedListingsPreviewComponent`
- `HowItWorksStepsComponent`
- `LandingCtaBarComponent`

#### User Flow

1. Guest lands on `/`.
2. Guest searches by title/author/category or taps browse.
3. Search navigates to `/browse?q=value`.
4. Add listing CTA sends guest to `/auth/login?returnUrl=/listings/new`.
5. Language toggle immediately mirrors layout and reloads translated copy.

#### Responsive Behavior

- Mobile: search and CTAs stack; featured listings show horizontal scroll cards.
- Tablet: two-column hero with listing preview below.
- Desktop: hero search remains primary; listing preview uses 4-card row.

#### Arabic RTL Considerations

- Hero text aligns inline-start.
- Search icon appears at inline-start.
- CTA order remains primary then secondary by DOM order, visually mirrored by direction.
- Avoid decorative text in images because it would need translation.

#### Angular Component Names

- Page: `LandingPageComponent`
- Route file: `landing.routes.ts`
- Feature path: `features/landing/`

### 2. Home

#### Layout

- Authenticated dashboard at `/home`.
- Header greeting, quick actions, request status summary, recent notifications, and user's active listings.
- Admin users see an additional admin dashboard entry card.
- Keep content task-oriented, not marketing-oriented.

#### Components

- `HomePageComponent`
- `HomeGreetingComponent`
- `QuickActionsComponent`
- `RequestSummaryPanelComponent`
- `RecentNotificationsPanelComponent`
- `MyListingsPreviewComponent`

#### User Flow

1. User logs in or registers successfully.
2. App navigates to `/home` unless a return URL exists.
3. User can jump to add listing, requests, wishlist, or browse.
4. Notification/request panels link to their full pages.

#### Responsive Behavior

- Mobile: vertical cards with quick action buttons in a 2-column grid.
- Desktop: summary panels in a 12-column grid; listings preview spans main content width.

#### Arabic RTL Considerations

- Greeting uses locale-aware name placement.
- Summary cards mirror icon placement.
- Dates in notifications use Arabic locale when selected.

#### Angular Component Names

- Page: `HomePageComponent`
- Route file: `home.routes.ts`
- Feature path: `features/home/`

### 3. Browse Books

#### Layout

- Public catalog at `/browse`.
- Top search bar, filter controls, sort control, results count, and listing grid.
- Filters: category, condition, listing type, min/max price.
- Available listings only by default.

#### Components

- `BrowseBooksPageComponent`
- `BookSearchBarComponent`
- `BookFilterPanelComponent`
- `SortSelectComponent`
- `ListingGridComponent`
- `ListingCardComponent`
- `PaginationControlsComponent`
- `BrowseEmptyStateComponent`

#### User Flow

1. Guest or user opens browse.
2. User searches, filters, sorts, or paginates.
3. Listing card opens `/books/:id`.
4. Wishlist heart requires auth; guest receives auth-required dialog.
5. Empty filters offer "clear filters".

#### Responsive Behavior

- Mobile: filters collapse into `MatBottomSheet`; active filters render as horizontal chips.
- Tablet: filter chips remain above grid; grid uses 2-3 columns.
- Desktop: left filter rail plus 3-4 column grid.

#### Arabic RTL Considerations

- Filter rail appears on inline-start, which becomes the right side in RTL.
- Price range inputs preserve numeric entry while labels translate.
- Pagination previous/next icons mirror.

#### Angular Component Names

- Page: `BrowseBooksPageComponent`
- Route file: `listings.routes.ts`
- Feature path: `features/listings/pages/`

### 4. Book Details

#### Layout

- Public details page at `/books/:id`.
- Gallery, title, author, condition, category, listing type, price/exchange badge, description, owner preview, and primary CTA.
- Own listing view replaces contact CTA with edit/status actions.
- Unavailable listings show a prominent status banner.

#### Components

- `BookDetailsPageComponent`
- `BookPhotoGalleryComponent`
- `BookMetadataPanelComponent`
- `OwnerPreviewComponent`
- `ContactRequestPanelComponent`
- `ExchangeProposalPanelComponent`
- `WishlistButtonComponent`
- `ListingStatusBannerComponent`

#### User Flow

1. User opens a listing from browse/wishlist/notification.
2. Guest can inspect all public details.
3. Guest contact/exchange attempt opens auth-required dialog.
4. Registered user sends contact request for sale listing or exchange proposal for exchange listing.
5. Owner can edit listing or change status.

#### Responsive Behavior

- Mobile: gallery first, sticky bottom CTA, metadata stacked.
- Desktop: gallery and details use two-column layout; CTA remains in details panel.

#### Arabic RTL Considerations

- Gallery thumbnail strip scroll direction follows document direction.
- Seller preview avatar/name order mirrors.
- Sticky CTA remains full-width at bottom on mobile in both directions.

#### Angular Component Names

- Page: `BookDetailsPageComponent`
- Route file: `listing-detail.routes.ts`
- Feature path: `features/listings/pages/`

### 5. Login

#### Layout

- Dedicated page at `/auth/login`.
- Centered auth panel with email/phone field, password field, submit button, register link, and language toggle.
- Preserve return URL after protected action.

#### Components

- `LoginPageComponent`
- `LoginFormComponent`
- `PasswordFieldComponent`
- `AuthLayoutComponent`

#### User Flow

1. Guest enters email/phone and password.
2. Form validates required fields.
3. Submit calls API through `AuthService`.
4. JWT is stored, current user signal updates.
5. User navigates to return URL or `/home`.

#### Responsive Behavior

- Mobile: full-width form with comfortable vertical spacing.
- Desktop: fixed-width panel centered in content area.

#### Arabic RTL Considerations

- Form labels align inline-start.
- Password visibility icon appears inline-end.
- Error messages use translated validation keys.

#### Angular Component Names

- Page: `LoginPageComponent`
- Route file: `auth.routes.ts`
- Feature path: `features/auth/pages/`

### 6. Register

#### Layout

- Dedicated page at `/auth/register`.
- Fields: display name, email or phone, password, confirm password.
- Optional terms/rules acknowledgement if configured by admin settings.

#### Components

- `RegisterPageComponent`
- `RegisterFormComponent`
- `PasswordStrengthHintComponent`
- `AuthLayoutComponent`

#### User Flow

1. Guest fills registration form.
2. Client validates required fields and matching passwords.
3. API creates account and returns JWT.
4. App sets current user and redirects to return URL or `/home`.
5. If user started from contact CTA, resume contact/exchange intent where feasible.

#### Responsive Behavior

- Mobile: one field per row.
- Desktop: fixed-width auth panel; no split marketing layout.

#### Arabic RTL Considerations

- Password strength text translates and wraps safely.
- Phone number input remains usable with LTR numeric entry inside RTL form.

#### Angular Component Names

- Page: `RegisterPageComponent`
- Route file: `auth.routes.ts`
- Feature path: `features/auth/pages/`

### 7. Add Listing

#### Layout

- Protected page at `/listings/new`.
- Multi-section form: photos, book metadata, category, condition, listing type, price, description, publish action.
- Sale type requires price; exchange type hides price.
- Max 5 photos unless platform setting changes.

#### Components

- `AddListingPageComponent`
- `ListingFormComponent`
- `PhotoUploadComponent`
- `ListingTypeSelectorComponent`
- `ConditionSelectComponent`
- `CategorySelectComponent`
- `PriceFieldComponent`
- `ListingPreviewPanelComponent`

#### User Flow

1. User opens add listing.
2. Uploads photos and fills details.
3. Selects For Sale or For Exchange.
4. Client validates fields before submit.
5. API creates listing.
6. App redirects to `/books/:id`.

#### Responsive Behavior

- Mobile: single-column form; sticky "Publish" action at bottom.
- Desktop: form on left, live preview/status helper on right.

#### Arabic RTL Considerations

- Photo ordering mirrors visually but uploaded order remains deterministic.
- Price currency formatting follows locale.
- Textarea supports Arabic input and right-aligned text in RTL.

#### Angular Component Names

- Page: `AddListingPageComponent`
- Shared editor: `ListingFormComponent`
- Route file: `listing-editor.routes.ts`
- Feature path: `features/listings/pages/`

### 8. Edit Listing

#### Layout

- Protected page at `/listings/:id/edit`.
- Same form as Add Listing, pre-populated.
- Includes current status control, delete action, and photo management.
- API enforces owner permission; UI hides edit entry for non-owners.

#### Components

- `EditListingPageComponent`
- `ListingFormComponent`
- `ListingStatusSelectComponent`
- `PhotoManagerComponent`
- `DeleteListingDialogComponent`

#### User Flow

1. Owner opens edit from My Listings or Book Details.
2. Existing values load.
3. User edits fields/photos/status.
4. Save updates listing and returns to detail page.
5. Delete opens confirmation and soft-deletes listing.

#### Responsive Behavior

- Mobile: destructive delete action moves below save actions and requires confirmation.
- Desktop: status/delete actions sit in side panel.

#### Arabic RTL Considerations

- Confirmation dialog button order follows Material direction.
- Status labels translate consistently with status pills elsewhere.

#### Angular Component Names

- Page: `EditListingPageComponent`
- Route file: `listing-editor.routes.ts`
- Feature path: `features/listings/pages/`

### 9. My Listings

#### Layout

- Protected page at `/my-listings`.
- Tabs or segmented control for Available, Unavailable, Sold, Exchanged.
- List/grid of user's own listings with edit/status/delete actions.
- Add listing CTA remains prominent.

#### Components

- `MyListingsPageComponent`
- `MyListingsTabsComponent`
- `MyListingCardComponent`
- `ListingStatusMenuComponent`
- `AddListingButtonComponent`

#### User Flow

1. User opens My Listings.
2. User filters by status.
3. User edits, changes status, deletes, or adds listing.
4. Status changes update card immediately after API success.

#### Responsive Behavior

- Mobile: card list with actions menu.
- Desktop: table/list hybrid with thumbnail, metadata, status, actions.

#### Arabic RTL Considerations

- Action menus open from inline-end.
- Status tabs mirror order while retaining semantic status grouping.

#### Angular Component Names

- Page: `MyListingsPageComponent`
- Route file: `my-listings.routes.ts`
- Feature path: `features/my-listings/`

### 10. Wishlist

#### Layout

- Protected page at `/wishlist`.
- Saved available listings displayed as cards.
- Empty state encourages browsing.
- Removed/unavailable listings show contextual status if returned by API.

#### Components

- `WishlistPageComponent`
- `WishlistGridComponent`
- `WishlistCardComponent`
- `WishlistEmptyStateComponent`

#### User Flow

1. User saves listing from Browse or Details.
2. User opens Wishlist.
3. User opens listing detail or removes item.
4. Empty wishlist CTA navigates to `/browse`.

#### Responsive Behavior

- Mobile: one-column saved list.
- Tablet/desktop: grid layout matching Browse.

#### Arabic RTL Considerations

- Heart/remove controls sit at inline-end overlay.
- Empty-state CTA alignment mirrors.

#### Angular Component Names

- Page: `WishlistPageComponent`
- Route file: `wishlist.routes.ts`
- Feature path: `features/wishlist/`

### 11. Contact Requests

#### Layout

- Protected page at `/requests/contact`.
- Tabs: Incoming and Outgoing.
- Cards show listing, counterparty, optional message, status, date.
- Incoming pending cards expose Accept and Reject.
- Outgoing cards show terminal or pending status only.

#### Components

- `ContactRequestsPageComponent`
- `RequestTabsComponent`
- `ContactRequestCardComponent`
- `RequestStatusPillComponent`
- `RequestMessagePreviewComponent`
- `AcceptRejectActionsComponent`

#### User Flow

1. User sends request from sale listing.
2. Owner sees it under Incoming.
3. Owner accepts or rejects.
4. Requester receives notification and sees updated Outgoing status.
5. Accepted sale request creates transaction history.

#### Responsive Behavior

- Mobile: tabs full-width; cards stacked; actions full-width buttons.
- Desktop: two-column layout may show Incoming and Outgoing side by side, or tabs with denser cards.

#### Arabic RTL Considerations

- Incoming/outgoing tab labels translate and mirror.
- Status colors stay stable; labels translate.
- Message excerpt respects Arabic wrapping and line height.

#### Angular Component Names

- Page: `ContactRequestsPageComponent`
- Route file: `requests.routes.ts`
- Feature path: `features/requests/contact/`

### 12. Exchange Requests

#### Layout

- Protected page at `/requests/exchange`.
- Similar to Contact Requests, with extra offered-listing preview.
- Incoming card compares requested book and offered book.
- Outgoing card shows user's offered book and target listing.

#### Components

- `ExchangeRequestsPageComponent`
- `ExchangeRequestCardComponent`
- `OfferedListingPreviewComponent`
- `ExchangeComparisonComponent`
- `AcceptRejectActionsComponent`

#### User Flow

1. User opens For Exchange listing detail.
2. User selects one of their Available For Exchange listings.
3. Proposal is created as Pending.
4. Owner accepts or rejects.
5. Accepted exchange marks both listings Exchanged and creates transaction history.

#### Responsive Behavior

- Mobile: comparison stacks target listing above offered listing.
- Desktop: side-by-side comparison with clear direction labels.

#### Arabic RTL Considerations

- Directional language such as "for" or "offered for" must be translated, not assembled by string concatenation.
- Comparison arrows mirror or use neutral separators.

#### Angular Component Names

- Page: `ExchangeRequestsPageComponent`
- Route file: `requests.routes.ts`
- Feature path: `features/requests/exchange/`

### 13. Notifications

#### Layout

- Protected page at `/notifications`.
- List grouped by Today, This Week, Older.
- Each item shows icon, title, body, timestamp, read state.
- Bulk mark all as read action.

#### Components

- `NotificationsPageComponent`
- `NotificationListComponent`
- `NotificationGroupComponent`
- `NotificationItemComponent`
- `MarkAllReadButtonComponent`

#### User Flow

1. User receives request event notification.
2. Bell shows unread dot/count.
3. User opens notifications.
4. Tapping notification navigates to related request or listing.
5. Item marks read.

#### Responsive Behavior

- Mobile: full-width list, large tap targets.
- Desktop: centered list with optional side summary.

#### Arabic RTL Considerations

- Relative dates localize.
- Bell count stays readable with Arabic numerals or locale numerals.
- Unread marker sits at inline-start.

#### Angular Component Names

- Page: `NotificationsPageComponent`
- Route file: `notifications.routes.ts`
- Feature path: `features/notifications/`

### 14. Profile

#### Layout

- Protected page at `/profile`.
- Sections: account info, contact info, language preference, session actions, transaction history shortcut.
- Admin users see admin dashboard shortcut.
- Logout is clear but not destructive-looking.

#### Components

- `ProfilePageComponent`
- `ProfileSummaryCardComponent`
- `AccountDetailsFormComponent`
- `LanguagePreferencePanelComponent`
- `ProfileActionsPanelComponent`

#### User Flow

1. User opens profile from nav/avatar.
2. User reviews account details.
3. User changes language; app immediately updates `lang` and `dir`.
4. User logs out; token clears and app navigates to Landing or Browse.

#### Responsive Behavior

- Mobile: stacked sections.
- Desktop: profile summary side rail and settings main panel.

#### Arabic RTL Considerations

- Language switch uses labels "English" and "Arabic" in their own languages.
- Direction change should not require reload.
- Account fields support Arabic display names.

#### Angular Component Names

- Page: `ProfilePageComponent`
- Route file: `profile.routes.ts`
- Feature path: `features/profile/`

### 15. Admin Dashboard

#### Layout

- Admin-only page at `/admin`.
- Desktop-first operational layout with admin sidebar, KPI cards, charts, recent activity, moderation alerts.
- Mobile remains usable but not primary; sidebar collapses into menu.
- Dashboard links to category management, listing moderation, user management, and settings.

#### Components

- `AdminDashboardPageComponent`
- `AdminShellComponent`
- `AdminSidebarComponent`
- `AdminKpiGridComponent`
- `AdminKpiCardComponent`
- `ExchangeVolumeChartComponent`
- `PopularCategoriesChartComponent`
- `ModerationAlertsPanelComponent`
- `RecentAdminActivityTableComponent`

#### User Flow

1. Admin signs in.
2. Admin guard allows `/admin`.
3. Dashboard loads total listings, active users, exchange volume, reported listings.
4. Admin follows alert to moderation queue or opens management sections.
5. Non-admin is redirected to `/browse` or `/home`.

#### Responsive Behavior

- Mobile: KPI cards stack; sidebar becomes `MatDrawer` opened by menu button.
- Tablet: two-column KPI grid.
- Desktop: persistent sidebar and dense 12-column dashboard.

#### Arabic RTL Considerations

- Admin sidebar moves to inline-start, which is right side in RTL.
- Charts must localize labels and mirror legends when direction changes.
- Tables keep numeric columns aligned consistently while headers translate.

#### Angular Component Names

- Page: `AdminDashboardPageComponent`
- Shell: `AdminShellComponent`
- Route file: `admin.routes.ts`
- Feature path: `features/admin/`

## Cross-Page Component Rules

### Forms

- Use Angular Reactive Forms.
- Use translated validation keys, not hard-coded English messages.
- Show inline field errors and summary snack bar on submit failure.
- Keep submit buttons disabled only for invalid/pristine states that are obvious to the user; otherwise allow submit and reveal errors.

### Request Status

- `Pending`: warning color.
- `Accepted`: success color.
- `Rejected`: destructive color.
- Terminal statuses are non-editable in request views.

### Auth

- Protected routes use `authGuard`.
- Admin routes use `adminGuard`.
- Guest-only auth pages use `publicOnlyGuard`.
- API calls use `authInterceptor`.
- `apiErrorInterceptor` clears token and redirects on 401.

### Localization

- All visible strings live in `assets/i18n/en.json` and `assets/i18n/ar.json`.
- Avoid concatenated phrases; use translation parameters.
- Format dates, numbers, and prices per locale.
- Persist selected language in `localStorage`.

### Accessibility

- Minimum 44px tap targets.
- Every book image alt text includes title and author.
- Dialogs and bottom sheets must trap focus and restore focus on close.
- Notification count updates use an `aria-live="polite"` region.
- Color is never the only status indicator; status pills include translated text.

## Angular File Layout

```text
src/app/
├── core/
│   ├── auth/
│   ├── i18n/
│   ├── api/
│   └── layout/
├── shared/
│   ├── components/
│   ├── pipes/
│   └── validators/
└── features/
    ├── landing/
    ├── home/
    ├── auth/
    ├── listings/
    ├── my-listings/
    ├── wishlist/
    ├── requests/
    ├── notifications/
    ├── profile/
    └── admin/
```

Each feature should use this internal pattern where applicable:

```text
feature-name/
├── pages/
├── ui/
├── data-access/
├── models/
└── feature-name.routes.ts
```

