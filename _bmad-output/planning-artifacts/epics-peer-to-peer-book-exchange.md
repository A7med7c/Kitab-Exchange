---
stepsCompleted: [1, 2, 3, 4]
status: complete
completedAt: 2026-06-09
inputDocuments:
  - prds/prd-peer-to-peer-book-exchange-2026-06-09/prd.md
  - prds/prd-peer-to-peer-book-exchange-2026-06-09/addendum.md
  - architecture-peer-to-peer-book-exchange.md
  - erd-peer-to-peer-book-exchange.md
  - ux-designs/ux-peer-to-peer-book-exchange-2026-06-09/DESIGN.md
  - ux-designs/ux-peer-to-peer-book-exchange-2026-06-09/EXPERIENCE.md
---

# Peer-to-Peer Book Exchange System (Kitab) — Epic Breakdown

## Overview

This document decomposes the PRD (55 FRs), Architecture, and UX spine into **7 user-value epics** and **32 implementable stories** for hackathon MVP delivery. Stories are sized for a single dev agent session and ordered without forward dependencies.

---

## Requirements Inventory

### Functional Requirements

```
FR-1: Register with email or phone number and password
FR-2: Login with email or phone number and password; receive JWT
FR-3: Logout and invalidate client session
FR-4: Enforce RBAC: Guest (read-only public), Registered User (own resources), Admin (platform-wide)
FR-5: Admin accounts created via seeding or admin promotion (no public admin registration)
FR-6: Create Listing with title, author, category, condition, photos, description, listing type, and price (required if For Sale)
FR-7: Upload multiple photos per Listing within configured image limit
FR-8: Edit own Listing fields and photos
FR-9: Delete own Listing (soft-delete)
FR-10: Set Listing status to Sold, Exchanged, or Unavailable
FR-11: View Listing detail including description, condition, type, photos, and owner profile preview
FR-12: Browse all Available Listings without login
FR-13: Grade condition as New, Good, Acceptable, or Poor
FR-14: Set listing type as For Sale (fixed price) or For Exchange
FR-15: Search by title, author, or category keyword
FR-16: Filter by condition, listing type, and price range
FR-17: Sort by newest (default) or relevance
FR-18: Paginate search results
FR-19: Send Contact Request to Listing owner with optional message (For Sale)
FR-20: Propose Exchange by selecting requester's own Available Listing as swap offer
FR-21: View incoming and outgoing requests with status
FR-22: Accept or reject pending requests
FR-23: Request status flow: Pending → Accepted or Rejected (terminal)
FR-24: Notify requester on status change
FR-25: Block Contact Request on own Listing
FR-26: Block Exchange Proposal if offered Listing is not Available or not For Exchange
FR-27: Prompt Guest to register before sending any request
FR-28: Save any Available Listing to personal wishlist
FR-29: Remove Listing from wishlist
FR-30: View wishlist
FR-31: Notify user when wishlisted Listing returns to Available (Could — stretch)
FR-32: View completed sales and exchanges
FR-33: Transaction record shows book title, counterparty, date, and type
FR-34: Auto-create history entry when request is Accepted
FR-35: In-app notification list for request status changes
FR-36: In-app notification for new incoming requests
FR-37: Mark notifications as read
FR-38: Email notification on request status change (Could — post-MVP)
FR-39: Create, edit, and delete book Categories (Admin)
FR-40: Prevent deletion of Category with active Listings
FR-41: List all Categories for public browse/filter
FR-42: View all Listings including non-Available (Admin)
FR-43: Edit or remove any Listing (Admin)
FR-44: View reported/flagged Listings queue (Admin)
FR-45: Registered User can report a Listing
FR-46: View user accounts and activity summary (Admin)
FR-47: Suspend user (blocks login and new requests)
FR-48: Remove/deactivate user account (Admin)
FR-49: Dashboard: total Listings, active users, exchange volume (Admin)
FR-50: Popular Categories by listing count (Admin)
FR-51: Most listed or most requested books (Could — stretch)
FR-52: Configure platform settings: max photos per Listing, listing rules text
FR-53: UI available in Arabic and English with language toggle
FR-54: RTL layout support for Arabic
FR-55: Responsive layout for mobile and desktop browsers
```

### Non-Functional Requirements

```
NFR-1: Listing browse/search API response (p95) ≤ 500 ms
NFR-2: Listing detail page load (p95) ≤ 2 s on 4G mobile
NFR-3: Support 50 simultaneous users for demo
NFR-4: JWT authentication with configurable expiry
NFR-5: Passwords hashed via ASP.NET Identity
NFR-6: HTTPS in production; EF Core parameterized queries
NFR-7: File upload validation: JPEG/PNG/WebP whitelist, max size per image
NFR-8: RBAC enforced at API layer
NFR-9: SQL Server + EF Core migrations
NFR-10: Soft-delete for Listings and Users
NFR-11: Idempotent accept/reject on requests
NFR-12: Clean Architecture: Domain, Application, Infrastructure, API
NFR-13: CQRS + MediatR; AutoMapper; Swagger/OpenAPI
NFR-14: Structured logging for errors and admin actions
NFR-15: WCAG 2.1 Level A minimum
NFR-16: Form validation messages in user's selected language
NFR-17: Touch-friendly controls (min 44px tap targets)
NFR-18: i18n for all user-facing strings
NFR-19: Dates/numbers formatted per locale (ar-EG, en-US)
```

### Additional Requirements (Architecture)

```
- Epic 1 Story 1: Scaffold Kitab solution (Domain, Application, Infrastructure, API) per architecture doc
- Epic 1 Story 2: Scaffold kitab-web React + Vite + TypeScript + shadcn/ui
- docker-compose.yml for SQL Server (dev)
- MediatR pipeline: ValidationBehaviour, ExceptionHandling middleware, ProblemDetails errors
- GUID primary keys; PascalCase DB tables; camelCase JSON
- Local file storage for listing photos (wwwroot/uploads) in MVP
- JWT claims: sub, email, role, name
- Seed admin user + default categories on startup
- TanStack Query for SPA server state; Axios JWT interceptor
- No chat/messaging tables or endpoints
- ContactRequest accept handler runs in EF transaction (NFR-11)
```

### UX Design Requirements

```
UX-DR1: Implement Kitab design tokens (forest primary #1B4332, cream surface #FAF7F2, amber sale badges)
UX-DR2: Listing card component — cover, title, author, type/condition badges, price/swap label, wishlist heart
UX-DR3: Search bar + horizontally scrollable filter chip row on mobile
UX-DR4: Listing detail — photo gallery, seller preview, sticky bottom CTA bar (mobile)
UX-DR5: Contact request sheet/dialog — optional message only; no chat thread UI
UX-DR6: Exchange proposal sheet — message + dropdown of user's Available For Exchange listings
UX-DR7: Request card — incoming/outgoing tabs, Accept/Reject for pending, status pills
UX-DR8: Language toggle EN|ع in header; persist locale in localStorage
UX-DR9: RTL layout mirroring for Arabic (dir, logical CSS properties)
UX-DR10: Mobile bottom nav: Browse · Add · Requests · Wishlist · Profile
UX-DR11: Admin sidebar layout (desktop) with KPI dashboard cards
UX-DR12: Loading skeletons and empty states per EXPERIENCE.md State Patterns
UX-DR13: Guest registration gate dialog on contact CTA (not on browse)
UX-DR14: Post-accept banner: "Arrange handoff directly with {name}" — never open chat
```

### FR Coverage Map

| FR | Epic | Story |
|----|------|-------|
| FR-1–5 | Epic 1 | 1.3–1.5 |
| FR-6–10, FR-13–14 | Epic 3 | 3.1–3.5 |
| FR-11–12, FR-15–18 | Epic 2 | 2.1–2.4 |
| FR-19–27, FR-32–34 | Epic 4 | 4.1–4.5 |
| FR-28–31, FR-35–37 | Epic 5 | 5.1–5.4 |
| FR-39–52, FR-45 | Epic 6 | 6.1–6.5 |
| FR-41 | Epic 1 + 2 | 1.3, 2.1 |
| FR-53–55, UX-DR1–14 | Epic 7 | 7.1–7.4 |
| NFR-* | All | Woven into acceptance criteria per story |

---

## Epic List

### Epic 1: Foundation, Auth & Platform Bootstrap
Users and developers have a running Kitab stack with secure registration, login, JWT sessions, admin seeding, and public categories.
**FRs covered:** FR-1, FR-2, FR-3, FR-4, FR-5, FR-41 (seed)

### Epic 2: Browse & Discover Books
Guests and users search, filter, and view book listings without logging in.
**FRs covered:** FR-11, FR-12, FR-15, FR-16, FR-17, FR-18, FR-41

### Epic 3: List & Manage My Books
Registered users create, edit, photo-upload, and lifecycle-manage their own listings.
**FRs covered:** FR-6, FR-7, FR-8, FR-9, FR-10, FR-13, FR-14

### Epic 4: Contact & Exchange Requests
Users send chat-free contact or exchange requests; owners accept/reject; transaction history is recorded.
**FRs covered:** FR-19–27, FR-32, FR-33, FR-34

### Epic 5: Notifications & Wishlist
Users receive in-app notifications and save books to a personal wishlist.
**FRs covered:** FR-24, FR-28, FR-29, FR-30, FR-35, FR-36, FR-37 (FR-31 stretch)

### Epic 6: Admin Platform Management
Admins manage categories, moderate listings, suspend users, and view platform analytics.
**FRs covered:** FR-39–48, FR-49, FR-50, FR-52 (FR-44, FR-45, FR-51 stretch)

### Epic 7: Bilingual Kitab UI & Responsive Experience
The app delivers Arabic/English RTL/LTR support and mobile-first responsive layouts with Kitab visual identity.
**FRs covered:** FR-53, FR-54, FR-55 + UX-DR1–14

---

## Epic 1: Foundation, Auth & Platform Bootstrap

Establish the Kitab solution scaffold, database, JWT authentication, RBAC, and seeded admin + categories so all subsequent epics have a stable platform.

### Story 1.1: Scaffold Backend Clean Architecture Solution

As a **developer**,
I want the Kitab .NET solution with Domain, Application, Infrastructure, and API projects,
So that all features follow CQRS and Clean Architecture consistently.

**Acceptance Criteria:**

**Given** an empty repository
**When** I run the scaffold commands from the architecture document
**Then** `Kitab.sln` exists with four projects and correct project references (Domain ← Application ← Infrastructure ← API)
**And** MediatR, FluentValidation, AutoMapper, EF Core SqlServer, and Swashbuckle packages are installed
**And** `docker-compose.yml` starts SQL Server for local development
**And** Swagger UI is accessible at `/swagger` when the API runs

**Implements:** NFR-12, NFR-13, Architecture starter

---

### Story 1.2: Scaffold React Frontend with shadcn/ui

As a **developer**,
I want a Vite React TypeScript SPA with Tailwind and shadcn/ui initialized,
So that UX components can be built to the Kitab design spine.

**Acceptance Criteria:**

**Given** the backend API runs on port 5000
**When** I create `kitab-web` via Vite react-ts template and run `shadcn init`
**Then** the dev server runs on port 5173 with hot reload
**And** a base `App.tsx` with React Router is configured
**And** Axios client module exists with configurable `VITE_API_URL`
**And** folder structure matches architecture: `features/`, `components/ui/`, `lib/`, `i18n/`

**Implements:** UX-DR1 (foundation), Architecture frontend starter

---

### Story 1.3: Database Initial Migration — Users, Roles, Categories

As a **system**,
I want Users, Roles, and Categories persisted in SQL Server,
So that authentication and listing categorization can be implemented.

**Acceptance Criteria:**

**Given** EF Core is configured in Infrastructure
**When** I run the initial migration
**Then** tables exist per ERD: `Users` (Identity), `Categories` with `NameEn`/`NameAr`
**And** seed data creates categories: Fiction, Science, Children's, Textbooks
**And** `GET /api/categories` returns all non-deleted categories (FR-41)
**And** GUID primary keys are used on all entities

**Implements:** FR-41, NFR-9

---

### Story 1.4: User Registration and Login with JWT

As a **guest**,
I want to register and log in with email or phone and password,
So that I can access authenticated features.

**Acceptance Criteria:**

**Given** I am unauthenticated
**When** I `POST /api/auth/register` with email, password, displayName
**Then** I receive 201 and can log in
**And** `POST /api/auth/login` returns a JWT with `sub`, `email`, `role`, `name` claims (FR-1, FR-2)
**And** invalid credentials return 401 ProblemDetails
**And** passwords are stored hashed via Identity (NFR-5)
**And** phone number may be used as alternate username field

**Implements:** FR-1, FR-2, NFR-4, NFR-5, NFR-8

---

### Story 1.5: Logout, RBAC Policies, and Admin Seed

As an **admin**,
I want role-based access and a seeded admin account,
So that platform governance is possible from day one.

**Acceptance Criteria:**

**Given** the API starts
**When** database seed runs
**Then** an admin user exists (`admin@kitab.local`) with `Admin` role (FR-5)
**And** `[Authorize]` protects mutating endpoints; unauthenticated requests return 401 (FR-4)
**And** `[Authorize(Roles = "Admin")]` on `/api/admin/*` returns 403 for non-admin (FR-4)
**And** SPA logout clears token from localStorage and redirects to browse (FR-3)
**And** registered users cannot access admin routes

**Implements:** FR-3, FR-4, FR-5, NFR-8

---

## Epic 2: Browse & Discover Books

Guests and users can browse, search, filter, sort, and view listing details without friction.

### Story 2.1: Browse Available Listings (Guest)

As a **guest**,
I want to browse all available book listings without logging in,
So that I can discover books before creating an account.

**Acceptance Criteria:**

**Given** listings exist with various statuses
**When** I `GET /api/listings?page=1&pageSize=20`
**Then** only `Available` listings are returned, sorted by newest (FR-12, FR-18)
**And** response includes `PagedResult` with `items`, `page`, `pageSize`, `totalCount`
**And** each item includes id, title, author, price, listingType, condition, primary photo URL
**And** SPA Browse page (S-01) renders a 2-column mobile grid of listing cards (UX-DR2)
**And** no authentication is required

**Implements:** FR-12, FR-18, UX-DR2

---

### Story 2.2: Search and Filter Listings

As a **guest or user**,
I want to search and filter books by title, author, category, condition, type, and price,
So that I can find relevant books quickly.

**Acceptance Criteria:**

**Given** I am on the browse page
**When** I enter a search query and select filter chips
**Then** `GET /api/listings/search?q=&categoryId=&condition=&listingType=&minPrice=&maxPrice=` returns matching Available listings (FR-15, FR-16)
**And** price filter applies only to For Sale listings (FR-16 consequence)
**And** filter chips scroll horizontally on mobile (UX-DR3)
**And** empty results show empty state with "Clear all filters" link (UX-DR12)

**Implements:** FR-15, FR-16, UX-DR3, UX-DR12

---

### Story 2.3: Sort Listings by Newest or Relevance

As a **guest or user**,
I want to sort results by newest or relevance,
So that I can prioritize fresh listings or best matches.

**Acceptance Criteria:**

**Given** search results are displayed
**When** I select sort `newest` (default) or `relevance`
**Then** newest sorts by `CreatedAt DESC` (FR-17)
**And** relevance ranks title/author/category keyword matches (simple LIKE score for MVP)
**And** sort persists in URL query params

**Implements:** FR-17

---

### Story 2.4: View Listing Detail with Seller Preview

As a **guest or user**,
I want to view full listing details and seller preview,
So that I can decide whether to contact the seller.

**Acceptance Criteria:**

**Given** a listing id
**When** I `GET /api/listings/{id}` and open S-02
**Then** response includes photos, description, condition, type, status, price, category, owner displayName and member-since (FR-11)
**And** photo gallery is swipeable on mobile with dot indicators (UX-DR4)
**And** sticky bottom CTA shows "Contact seller" or "Propose exchange" based on type
**And** Sold/Exchanged/Unavailable listings show gray banner and hide CTA

**Implements:** FR-11, UX-DR4, UX-DR12

---

## Epic 3: List & Manage My Books

Registered users can list books for sale or exchange with photos and manage listing lifecycle.

### Story 3.1: Create Listing with Photos

As a **registered user**,
I want to create a book listing with photos, metadata, type, and condition,
So that I can offer my books for sale or exchange.

**Acceptance Criteria:**

**Given** I am authenticated
**When** I `POST /api/listings` with title, author, categoryId, condition, listingType, description, price (if ForSale), and photos
**Then** listing is created with status `Available` (FR-6, FR-13, FR-14)
**And** up to 5 JPEG/PNG/WebP images upload successfully (FR-7, NFR-7)
**And** For Sale without price returns 400 validation error
**And** photos are stored in `wwwroot/uploads` with `ListingPhotos` records
**And** SPA create form (S-11) uses React Hook Form + Zod validation

**Implements:** FR-6, FR-7, FR-13, FR-14, NFR-7

---

### Story 3.2: Edit and Delete Own Listings

As a **registered user**,
I want to edit or delete my listings,
So that I can keep my offers accurate.

**Acceptance Criteria:**

**Given** I own a listing
**When** I `PUT /api/listings/{id}` or `DELETE /api/listings/{id}`
**Then** changes persist for my listing only (FR-8, FR-9)
**And** attempting to edit another user's listing returns 403 (FR-4)
**And** delete sets `IsDeleted=true` (soft delete, NFR-10)
**And** deleted listings no longer appear in browse

**Implements:** FR-8, FR-9, FR-4, NFR-10

---

### Story 3.3: Update Listing Status

As a **registered user**,
I want to mark my listing as Sold, Exchanged, or Unavailable,
So that buyers know the book is no longer available.

**Acceptance Criteria:**

**Given** I own an Available listing
**When** I `PATCH /api/listings/{id}/status` with Sold, Exchanged, or Unavailable
**Then** status updates and listing is excluded from default browse (FR-10)
**And** confirmation dialog appears in SPA for terminal statuses
**And** viewing my own listing on S-02 hides contact CTA and shows edit controls

**Implements:** FR-10

---

### Story 3.4: My Listings Dashboard

As a **registered user**,
I want to view all my listings in one place,
So that I can manage my shelf efficiently.

**Acceptance Criteria:**

**Given** I am authenticated
**When** I navigate to S-10 `/my-listings`
**Then** `GET /api/listings/mine` returns all my non-deleted listings with status badges
**And** I can tap edit, change status, or navigate to listing detail
**And** "Add book" navigates to S-11 create form

**Implements:** FR-8, FR-10 (UI aggregation)

---

### Story 3.5: Listing Form UX — Type Toggle and Photo Grid

As a **registered user**,
I want the listing form to adapt to sale vs exchange and support photo management,
So that listing creation is intuitive on mobile.

**Acceptance Criteria:**

**Given** I am on the create/edit form
**When** I toggle For Sale vs For Exchange
**Then** price field shows/hides accordingly (UX-DR4 pattern from EXPERIENCE)
**And** photo upload grid shows dashed add slots and thumbnail remove buttons (max 5)
**And** validation errors display inline in current UI language

**Implements:** FR-6, FR-14, UX-DR12, NFR-16

---

## Epic 4: Contact & Exchange Requests

Users initiate chat-free contact or exchange proposals; owners respond; completed transactions are recorded.

### Story 4.1: Send Contact Request (Sale)

As a **registered user**,
I want to send a contact request with an optional message to a seller,
So that I can express interest without using chat.

**Acceptance Criteria:**

**Given** I view a For Sale listing I do not own
**When** I submit the contact request sheet with optional message (≤500 chars)
**Then** `POST /api/requests` creates a Pending Contact request (FR-19, FR-23)
**And** I cannot request my own listing (FR-25) — returns 400
**And** no chat thread is created (UX-DR5)
**And** toast confirms "Request sent" and CTA shows Pending pill (UX-DR14)

**Implements:** FR-19, FR-23, FR-25, UX-DR5, UX-DR14

---

### Story 4.2: Propose Exchange

As a **registered user**,
I want to propose swapping one of my books for a listing marked For Exchange,
So that I can trade books directly.

**Acceptance Criteria:**

**Given** I view a For Exchange listing I do not own
**When** I select one of my Available For Exchange listings and submit
**Then** `POST /api/requests` creates Pending Exchange request with `offeredListingId` (FR-20)
**And** invalid offered listing (not mine, not Available, not ForExchange) returns 400 (FR-26)
**And** exchange sheet shows dropdown of eligible listings only (UX-DR6)

**Implements:** FR-20, FR-26, UX-DR6

---

### Story 4.3: Guest Registration Gate on Contact

As a **guest**,
I want to be prompted to register when I try to contact a seller,
So that I can browse freely but authenticate to transact.

**Acceptance Criteria:**

**Given** I am not logged in on S-02
**When** I tap Contact or Propose exchange
**Then** registration/login dialog appears (FR-27, UX-DR13)
**And** after successful auth the contact sheet opens automatically
**And** browse/search remain accessible without login

**Implements:** FR-27, UX-DR13

---

### Story 4.4: Manage Incoming and Outgoing Requests

As a **registered user**,
I want to view and respond to requests,
So that I can complete sales and exchanges efficiently.

**Acceptance Criteria:**

**Given** I have incoming and outgoing requests
**When** I open S-12 `/requests`
**Then** tabs show Incoming and Outgoing lists (FR-21)
**And** incoming Pending requests show Accept and Reject buttons (FR-22)
**And** `POST /api/requests/{id}/accept` or `/reject` updates status to terminal state (FR-23)
**And** double-accept returns 409 Conflict (NFR-11)
**And** request cards show status pills: Pending (amber), Accepted (green), Rejected (red) (UX-DR7)

**Implements:** FR-21, FR-22, FR-23, NFR-11, UX-DR7

---

### Story 4.5: Transaction History on Accept

As a **registered user**,
I want completed sales and exchanges recorded automatically,
So that I have a record of past transactions.

**Acceptance Criteria:**

**Given** a request is Accepted
**When** the accept handler completes
**Then** `TransactionHistories` rows are created for both parties with title, counterparty, date, type (FR-32, FR-33, FR-34)
**And** exchange accept marks both listings as Exchanged
**And** `GET /api/transactions` returns my history on S-13
**And** post-accept banner reads "Arrange handoff directly with {name}" — no chat opens (UX-DR14)
**And** requester receives in-app notification (FR-24 — ties to Epic 5)

**Implements:** FR-24, FR-32, FR-33, FR-34, UX-DR14

---

## Epic 5: Notifications & Wishlist

Users stay informed of request activity and save books for later.

### Story 5.1: In-App Notifications for Requests

As a **registered user**,
I want in-app notifications for request events,
So that I know when action is needed.

**Acceptance Criteria:**

**Given** a request is created or status changes
**When** the event occurs
**Then** a `Notifications` row is created for the recipient (FR-35, FR-36)
**And** `GET /api/notifications` returns unread and read items
**And** bell icon in header shows unread dot count
**And** tapping a notification navigates to S-12 or relevant listing

**Implements:** FR-35, FR-36

---

### Story 5.2: Mark Notifications as Read

As a **registered user**,
I want to mark notifications as read,
So that I can track what I've already seen.

**Acceptance Criteria:**

**Given** I have unread notifications
**When** I `PATCH /api/notifications/{id}/read` or open the notifications page
**Then** `IsRead` updates to true (FR-37)
**And** unread count on bell decrements

**Implements:** FR-37

---

### Story 5.3: Wishlist Save and View

As a **registered user**,
I want to save listings to my wishlist,
So that I can track books I'm interested in.

**Acceptance Criteria:**

**Given** an Available listing
**When** I tap the heart on a listing card or detail page
**Then** `POST /api/wishlist/{listingId}` adds the item (FR-28)
**And** `DELETE /api/wishlist/{listingId}` removes it (FR-29)
**And** S-14 `/wishlist` shows saved listings in a grid (FR-30)
**And** unauthenticated heart tap prompts login

**Implements:** FR-28, FR-29, FR-30, UX-DR2

---

### Story 5.4: Wishlist Availability Notification (Stretch)

As a **registered user**,
I want to be notified when a wishlisted book becomes available again,
So that I don't miss a second chance.

**Acceptance Criteria:**

**Given** a wishlisted listing changes from Sold/Exchanged/Unavailable to Available
**When** status update handler runs
**Then** notification type `WishlistAvailable` is sent to wishlist owners (FR-31)
**And** notification links to listing detail

**Implements:** FR-31 (Could — implement if sprint capacity allows)

---

## Epic 6: Admin Platform Management

Admins govern categories, moderate content, manage users, and view platform health.

### Story 6.1: Admin Category CRUD

As an **admin**,
I want to manage book categories in English and Arabic,
So that listings are organized consistently.

**Acceptance Criteria:**

**Given** I am logged in as Admin
**When** I use S-21 `/admin/categories`
**Then** I can create, edit, and delete categories with NameEn and NameAr (FR-39)
**And** deleting a category with active listings is blocked with 409 (FR-40)
**And** public `GET /api/categories` reflects changes immediately

**Implements:** FR-39, FR-40

---

### Story 6.2: Admin Listing Moderation

As an **admin**,
I want to view, edit, and remove any listing,
So that I can keep the marketplace appropriate.

**Acceptance Criteria:**

**Given** I am Admin on S-22
**When** I `GET /api/admin/listings`
**Then** all listings including non-Available are listed (FR-42)
**And** I can edit or soft-delete any listing (FR-43)
**And** reported listings appear in a Reported tab when FR-45 is implemented

**Implements:** FR-42, FR-43

---

### Story 6.3: User Reporting and Admin Queue (Stretch)

As a **registered user** and **admin**,
I want to report inappropriate listings and review them,
So that the community stays safe.

**Acceptance Criteria:**

**Given** I view a listing
**When** I submit a report with reason
**Then** `ListingReports` record is created with status Open (FR-45)
**And** admin Reported tab shows queue (FR-44)
**And** admin can dismiss or act on report

**Implements:** FR-44, FR-45 (Should — stretch)

---

### Story 6.4: Admin User Management

As an **admin**,
I want to view and suspend user accounts,
So that I can block bad actors.

**Acceptance Criteria:**

**Given** I am on S-23 `/admin/users`
**When** I view the user list
**Then** I see accounts with activity summary (FR-46)
**And** `POST /api/admin/users/{id}/suspend` sets `IsSuspended=true` (FR-47)
**And** suspended users cannot login — message "Your account has been suspended"
**And** deactivate/remove is available (FR-48)

**Implements:** FR-46, FR-47, FR-48

---

### Story 6.5: Admin Dashboard and Platform Settings

As an **admin**,
I want a dashboard and configurable platform settings,
So that I can monitor health and enforce listing rules.

**Acceptance Criteria:**

**Given** I open S-20 `/admin`
**When** dashboard loads
**Then** KPI cards show total listings, active users (30d), exchange volume (FR-49)
**And** popular categories table shows listing counts (FR-50)
**And** `GET/PUT /api/admin/settings` manages MaxPhotosPerListing and ListingRulesText (FR-52)
**And** admin layout uses sidebar per UX-DR11

**Implements:** FR-49, FR-50, FR-52, UX-DR11

---

## Epic 7: Bilingual Kitab UI & Responsive Experience

The application delivers Kitab visual identity with Arabic/English support and responsive layouts for hackathon demo.

### Story 7.1: i18n Setup with Arabic and English

As a **user**,
I want to switch between Arabic and English,
So that I can use the app in my preferred language.

**Acceptance Criteria:**

**Given** the SPA loads
**When** I toggle EN|ع in the header (UX-DR8)
**Then** all user-facing strings switch via react-i18next (FR-53, NFR-18)
**And** selected locale persists in localStorage
**And** form validation messages appear in active language (NFR-16)

**Implements:** FR-53, NFR-16, NFR-18, UX-DR8

---

### Story 7.2: RTL Layout for Arabic

As an **Arabic-speaking user**,
I want the layout mirrored for RTL,
So that the app feels natural in Arabic.

**Acceptance Criteria:**

**Given** I select Arabic
**When** any page renders
**Then** `<html dir="rtl" lang="ar">` is set (FR-54)
**And** layouts use logical properties (`margin-inline`, `padding-inline`) not hard-coded left/right (UX-DR9)
**And** chevrons and back arrows flip direction
**And** listing detail demo matches `key-listing-detail.html` RTL mock

**Implements:** FR-54, UX-DR9

---

### Story 7.3: Responsive Mobile and Desktop Layouts

As a **user**,
I want the app to work on phone and desktop browsers,
So that I can use Kitab anywhere.

**Acceptance Criteria:**

**Given** viewports 375px, 768px, and 1024px+
**When** I exercise core flows (browse, detail, requests, add listing)
**Then** mobile shows bottom nav (UX-DR10); desktop shows header nav links
**And** no horizontal scroll on 375px (FR-55)
**And** touch targets are ≥44px (NFR-17)
**And** filter panel becomes sidebar on desktop per EXPERIENCE.md breakpoints

**Implements:** FR-55, NFR-17, UX-DR10

---

### Story 7.4: Kitab Design System Application

As a **user**,
I want a cohesive warm literary visual identity,
So that Kitab feels trustworthy and distinct.

**Acceptance Criteria:**

**Given** DESIGN.md tokens
**When** I view browse, detail, requests, and admin pages
**Then** primary `#1B4332`, surface `#FAF7F2`, sale badge amber, exchange badge sage are applied (UX-DR1)
**And** Literata/Georgia display headings and Inter body text are used
**And** loading skeletons and empty states match UX-DR12
**And** no chat/message iconography appears anywhere

**Implements:** UX-DR1, UX-DR12, NFR-15

---

## Validation Summary

### FR Coverage: ✅ 55/55 mapped (FR-31, FR-38, FR-44, FR-45, FR-51 marked stretch)

### Epic Independence: ✅ Each epic delivers standalone user value in sequence

### Story Dependencies: ✅ No story requires a future story within its epic

### Architecture Compliance: ✅
- Story 1.1 = starter template setup (required)
- Entities created when first needed (Users/Categories in 1.3; Listings in 3.1; Requests in 4.1; etc.)

### Suggested Sprint Allocation (Hackathon)

| Sprint | Epics | Demo milestone |
|--------|-------|----------------|
| Day 1–2 | Epic 1, Epic 2 | API + browse working |
| Day 2–3 | Epic 3, Epic 4 | List + request flow E2E |
| Day 3–4 | Epic 5, Epic 6 | Notifications + admin |
| Day 4–5 | Epic 7 + stretch | Bilingual demo polish |

---

*Next: `bmad-sprint-planning` or `bmad-dev-story` to implement Story 1.1.*
