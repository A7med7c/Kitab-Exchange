---
title: Kitab — Epics & User Stories
status: final
created: 2026-06-09
sources:
  - prds/prd-peer-to-peer-book-exchange-2026-06-09/prd.md
  - architecture-peer-to-peer-book-exchange.md
  - erd-peer-to-peer-book-exchange.md
  - ux-designs/ux-peer-to-peer-book-exchange-2026-06-09/EXPERIENCE.md
---

# Kitab — Complete Epics & User Stories

**Project:** Peer-to-Peer Book Exchange System  
**Roles:** Guest · Registered User · Admin  
**Total epics:** 8 · **Total stories:** 48 · **Total story points:** 157

## Story Point Scale

| Points | Meaning |
|--------|---------|
| **1** | Trivial UI or config change |
| **2** | Small CRUD endpoint or simple screen |
| **3** | Standard feature with API + UI |
| **5** | Multi-step flow or file upload |
| **8** | Complex workflow, transactions, or cross-cutting setup |

## Priority Legend

| Priority | PRD mapping |
|----------|-------------|
| **P0 — Must** | MVP demo blocker |
| **P1 — Should** | Important; include if sprint allows |
| **P2 — Could** | Stretch / post-MVP |

---

## Epic Summary

| Epic | Title | Guest | User | Admin | Platform | Points |
|------|-------|-------|------|-------|----------|--------|
| E0 | Platform Foundation | — | — | — | 5 | 21 |
| E1 | Discovery & Browse | 7 | 2 | — | — | 24 |
| E2 | Account & Access | 2 | 3 | 1 | — | 13 |
| E3 | Listing Management | — | 7 | — | — | 29 |
| E4 | Requests & Transactions | — | 8 | — | — | 34 |
| E5 | Wishlist & Notifications | — | 6 | — | — | 18 |
| E6 | Admin Governance | — | 1 | 9 | — | 26 |
| E7 | Bilingual & Responsive UI | 3 | 3 | 1 | — | 16 |
| | **Totals** | **12** | **30** | **11** | **5** | **157** |

---

# Epic E0: Platform Foundation

*Enables all roles. Technical stories required by Architecture.*

---

### Story E0-1: Scaffold Backend Solution

| Field | Value |
|-------|-------|
| **ID** | E0-1 |
| **Role** | Platform |
| **Priority** | P0 — Must |
| **Story Points** | 5 |
| **FRs** | NFR-12, NFR-13 |

**Description:**  
As a **developer**, I need the Kitab .NET 8 solution scaffolded with Clean Architecture (Domain, Application, Infrastructure, API), MediatR, EF Core, AutoMapper, FluentValidation, and Swagger, so that all features follow a consistent technical foundation.

**Acceptance Criteria:**
- `Kitab.sln` contains Domain, Application, Infrastructure, and API projects with correct references
- MediatR, EF Core SqlServer, Swashbuckle, and FluentValidation packages installed
- `docker-compose.yml` provides SQL Server for local development
- API runs and Swagger UI is available at `/swagger`
- Global exception middleware returns RFC 7807 ProblemDetails

---

### Story E0-2: Scaffold React Frontend

| Field | Value |
|-------|-------|
| **ID** | E0-2 |
| **Role** | Platform |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-55 (foundation) |

**Description:**  
As a **developer**, I need a Vite React TypeScript SPA with Tailwind CSS and shadcn/ui initialized, so that UX components can be built to the Kitab design specification.

**Acceptance Criteria:**
- `kitab-web` runs on port 5173 with hot reload
- React Router, Axios client with `VITE_API_URL`, and folder structure (`features/`, `components/ui/`, `i18n/`) exist
- shadcn/ui base components (Button, Card, Dialog, Sheet) are installed

---

### Story E0-3: Database Schema & Category Seed

| Field | Value |
|-------|-------|
| **ID** | E0-3 |
| **Role** | Platform |
| **Priority** | P0 — Must |
| **Story Points** | 5 |
| **FRs** | FR-41, NFR-9 |

**Description:**  
As the **system**, I need the initial EF Core migration creating Users, Categories, and Identity tables with seed data, so authentication and categorization can function.

**Acceptance Criteria:**
- Tables match ERD: Users (Identity), Categories (`NameEn`, `NameAr`), GUID PKs
- Seed creates categories: Fiction, Science, Children's, Textbooks
- `GET /api/categories` returns all non-deleted categories without authentication
- Migrations apply cleanly on fresh database

---

### Story E0-4: RBAC & Admin Seed

| Field | Value |
|-------|-------|
| **ID** | E0-4 |
| **Role** | Platform |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-4, FR-5, NFR-8 |

**Description:**  
As the **system**, I need role-based access control with a seeded admin account, so Guest, User, and Admin permissions are enforced at the API layer.

**Acceptance Criteria:**
- Admin user `admin@kitab.local` seeded with `Admin` role; no public admin registration
- `[Authorize]` returns 401 for unauthenticated protected endpoints
- `[Authorize(Roles = "Admin")]` returns 403 for non-admin on `/api/admin/*`
- Registered users cannot modify another user's resources

---

### Story E0-5: JWT Authentication Pipeline

| Field | Value |
|-------|-------|
| **ID** | E0-5 |
| **Role** | Platform |
| **Priority** | P0 — Must |
| **Story Points** | 5 |
| **FRs** | NFR-4, NFR-5 |

**Description:**  
As the **system**, I need JWT bearer authentication configured with ASP.NET Identity password hashing, so secure token-based sessions work for SPA clients.

**Acceptance Criteria:**
- JWT issued on login with claims: `sub`, `email`, `role`, `name`
- Token expiry configurable in `appsettings.json` (default 60 min)
- Passwords hashed via Identity defaults
- Invalid/expired tokens return 401

---

# Epic E1: Discovery & Browse

*Guests and users discover books without mandatory login.*

---

### Story G-01: Browse Available Listings

| Field | Value |
|-------|-------|
| **ID** | G-01 |
| **Role** | Guest |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-12, FR-18 |

**Description:**  
As a **guest**, I want to browse all available book listings without creating an account, so that I can explore the marketplace with zero friction.

**Acceptance Criteria:**
- `GET /api/listings?page=1&pageSize=20` returns only `Available` listings without authentication
- Response is paginated with `items`, `page`, `pageSize`, `totalCount`
- Browse page (S-01) shows a responsive 2-column mobile grid of listing cards
- Listings with status Sold, Exchanged, or Unavailable are excluded

---

### Story G-02: Search Books by Keyword

| Field | Value |
|-------|-------|
| **ID** | G-02 |
| **Role** | Guest |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-15 |

**Description:**  
As a **guest**, I want to search books by title, author, or category keyword, so that I can quickly find specific books.

**Acceptance Criteria:**
- `GET /api/listings/search?q={keyword}` matches title, author, or category name
- Search bar on browse page submits query and updates results
- Empty query returns all available listings (paginated)
- API p95 response ≤ 500 ms with 100+ listings (NFR-1)

---

### Story G-03: Filter Listings

| Field | Value |
|-------|-------|
| **ID** | G-03 |
| **Role** | Guest |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-16 |

**Description:**  
As a **guest**, I want to filter listings by condition, listing type, and price range, so that I can narrow results to books that match my needs.

**Acceptance Criteria:**
- Filters: `categoryId`, `condition`, `listingType`, `minPrice`, `maxPrice`
- Price range applies only to For Sale listings
- Filter chips scroll horizontally on mobile; active chips show clear (×) control
- Combining search + filters returns intersection of criteria

---

### Story G-04: Sort Listing Results

| Field | Value |
|-------|-------|
| **ID** | G-04 |
| **Role** | Guest |
| **Priority** | P1 — Should |
| **Story Points** | 2 |
| **FRs** | FR-17 |

**Description:**  
As a **guest**, I want to sort results by newest or relevance, so that I see the most recent or best-matching books first.

**Acceptance Criteria:**
- `sort=newest` (default) orders by `CreatedAt DESC`
- `sort=relevance` ranks keyword matches in title, then author, then category
- Sort selection persists in URL query parameters

---

### Story G-05: Paginate Browse Results

| Field | Value |
|-------|-------|
| **ID** | G-05 |
| **Role** | Guest |
| **Priority** | P0 — Must |
| **Story Points** | 2 |
| **FRs** | FR-18 |

**Description:**  
As a **guest**, I want paginated browse results, so that pages load quickly on mobile connections.

**Acceptance Criteria:**
- Default `pageSize=20`; configurable up to 50
- "Load more" or page controls on browse UI
- Total count available for pagination UI

---

### Story G-06: View Listing Detail

| Field | Value |
|-------|-------|
| **ID** | G-06 |
| **Role** | Guest |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-11 |

**Description:**  
As a **guest**, I want to view full listing details including photos, description, condition, type, and seller preview, so that I can evaluate a book before deciding to contact the seller.

**Acceptance Criteria:**
- `GET /api/listings/{id}` returns photos, description, condition, listingType, price, category, owner displayName, member-since
- Photo gallery is swipeable on mobile with dot indicators
- Unavailable listings show gray banner; contact CTA hidden
- Page loads in ≤ 2 s on simulated 4G (NFR-2)

---

### Story G-07: View Categories for Browse

| Field | Value |
|-------|-------|
| **ID** | G-07 |
| **Role** | Guest |
| **Priority** | P0 — Must |
| **Story Points** | 1 |
| **FRs** | FR-41 |

**Description:**  
As a **guest**, I want to see available book categories when browsing, so that I can filter by genre or subject.

**Acceptance Criteria:**
- Category list loaded on browse page for filter chips/dropdown
- Categories display in user's selected language (NameEn / NameAr)

---

### Story U-01: Browse as Registered User

| Field | Value |
|-------|-------|
| **ID** | U-01 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 1 |
| **FRs** | FR-12, FR-15, FR-16 |

**Description:**  
As a **registered user**, I want the same browse, search, and filter experience as a guest, plus wishlist heart icons, so that I can discover books and save favorites while logged in.

**Acceptance Criteria:**
- All guest browse features work when authenticated
- Wishlist heart appears on listing cards (inactive state when not saved)
- Header shows notifications bell and avatar menu instead of "Sign in"

---

### Story U-02: View Own Listing on Detail Page

| Field | Value |
|-------|-------|
| **ID** | U-02 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 2 |
| **FRs** | FR-11, FR-8 |

**Description:**  
As a **registered user**, when I view my own listing I want to see edit and status controls instead of a contact button, so that I can manage my listing from the detail page.

**Acceptance Criteria:**
- Contact/Exchange CTA hidden when `ownerId === currentUserId`
- "Edit listing" and status dropdown visible for owner
- Other users still see contact CTA on the same listing

---

# Epic E2: Account & Access

*Guests convert to users; users and admins manage sessions.*

---

### Story G-08: Register Account

| Field | Value |
|-------|-------|
| **ID** | G-08 |
| **Role** | Guest |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-1 |

**Description:**  
As a **guest**, I want to register with email or phone number and password, so that I can list books and send contact requests.

**Acceptance Criteria:**
- `POST /api/auth/register` accepts email (or phone), password, displayName
- Password minimum 8 characters with at least one digit
- Duplicate email/phone returns 409 with clear validation message
- On success, user can immediately log in
- Registration dialog accessible from header and contact gate

---

### Story G-09: Registration Gate on Contact

| Field | Value |
|-------|-------|
| **ID** | G-09 |
| **Role** | Guest |
| **Priority** | P0 — Must |
| **Story Points** | 2 |
| **FRs** | FR-27 |

**Description:**  
As a **guest**, when I tap "Contact seller" or "Propose exchange" I want to be prompted to register or sign in, so that browse stays open but transactions require an account.

**Acceptance Criteria:**
- Tapping contact CTA while unauthenticated opens login/register dialog
- Browse and search remain fully accessible without login
- After successful auth, contact sheet opens automatically
- Dialog copy: "Sign in to contact the seller" (no chat language)

---

### Story U-03: Login

| Field | Value |
|-------|-------|
| **ID** | U-03 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 2 |
| **FRs** | FR-2 |

**Description:**  
As a **registered user**, I want to log in with email or phone and password and receive a JWT, so that I can access authenticated features across sessions.

**Acceptance Criteria:**
- `POST /api/auth/login` returns JWT and user profile summary
- SPA stores token in localStorage and attaches to Axios Authorization header
- Invalid credentials show error without revealing which field failed
- Suspended users see: "Your account has been suspended"

---

### Story U-04: Logout

| Field | Value |
|-------|-------|
| **ID** | U-04 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 1 |
| **FRs** | FR-3 |

**Description:**  
As a **registered user**, I want to log out and clear my session, so that my account is protected on shared devices.

**Acceptance Criteria:**
- Logout clears JWT from localStorage
- User redirected to browse page as guest
- Subsequent API calls without token return 401 on protected endpoints

---

### Story U-05: View Profile

| Field | Value |
|-------|-------|
| **ID** | U-05 |
| **Role** | Registered User |
| **Priority** | P1 — Should |
| **Story Points** | 2 |
| **FRs** | — |

**Description:**  
As a **registered user**, I want to view my profile with display name and account info, so that I can confirm my identity shown to other users.

**Acceptance Criteria:**
- Profile page (S-16) shows displayName, email/phone, member since date
- Links to My Listings, Transaction History, Wishlist
- Logout and language toggle accessible from profile

---

### Story A-01: Admin Login & Access

| Field | Value |
|-------|-------|
| **ID** | A-01 |
| **Role** | Admin |
| **Priority** | P0 — Must |
| **Story Points** | 2 |
| **FRs** | FR-4, FR-5 |

**Description:**  
As an **admin**, I want to log in with my seeded admin account and access admin-only routes, so that I can govern the platform.

**Acceptance Criteria:**
- Admin logs in via same auth flow; JWT contains `Admin` role
- Avatar menu shows "Admin" link to `/admin`
- Non-admin users hitting `/admin` are redirected to browse
- Admin layout uses sidebar navigation (desktop)

---

# Epic E3: Listing Management

*Registered users create and manage book listings.*

---

### Story U-06: Create Book Listing

| Field | Value |
|-------|-------|
| **ID** | U-06 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 5 |
| **FRs** | FR-6, FR-13, FR-14 |

**Description:**  
As a **registered user**, I want to create a listing with title, author, category, condition, description, listing type, and price (if for sale), so that I can offer my books to the community.

**Acceptance Criteria:**
- `POST /api/listings` creates listing with status `Available`
- Condition: New, Good, Acceptable, Poor
- Listing type: ForSale (price required) or ForExchange (price null)
- For Sale without price returns 400 validation error
- Create form (S-11) uses React Hook Form + Zod

---

### Story U-07: Upload Listing Photos

| Field | Value |
|-------|-------|
| **ID** | U-07 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 5 |
| **FRs** | FR-7, NFR-7 |

**Description:**  
As a **registered user**, I want to upload multiple photos per listing, so that buyers can see the book's condition.

**Acceptance Criteria:**
- Up to 5 images per listing (configurable via PlatformSettings)
- Accepted types: JPEG, PNG, WebP; max 5 MB each
- Photos stored in `wwwroot/uploads`; `ListingPhotos` records created with sort order
- Exceeding limit returns 400 validation error
- Photo grid UI with add/remove on create and edit forms

---

### Story U-08: Edit Own Listing

| Field | Value |
|-------|-------|
| **ID** | U-08 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-8 |

**Description:**  
As a **registered user**, I want to edit my listing's fields and photos, so that I can keep information accurate.

**Acceptance Criteria:**
- `PUT /api/listings/{id}` updates only if `ownerId === currentUserId`
- Editing another user's listing returns 403
- Photos can be added, reordered, or removed
- Updated `UpdatedAt` timestamp set

---

### Story U-09: Delete Own Listing

| Field | Value |
|-------|-------|
| **ID** | U-09 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 2 |
| **FRs** | FR-9, NFR-10 |

**Description:**  
As a **registered user**, I want to delete my listing, so that removed books no longer appear in the marketplace.

**Acceptance Criteria:**
- `DELETE /api/listings/{id}` sets `IsDeleted=true` (soft delete)
- Soft-deleted listings excluded from browse and search
- Only owner can delete; others receive 403

---

### Story U-10: Update Listing Status

| Field | Value |
|-------|-------|
| **ID** | U-10 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-10 |

**Description:**  
As a **registered user**, I want to mark my listing as Sold, Exchanged, or Unavailable, so that buyers know it is no longer available.

**Acceptance Criteria:**
- `PATCH /api/listings/{id}/status` accepts Sold, Exchanged, Unavailable
- Status change excludes listing from default browse immediately
- Confirmation dialog in SPA for terminal statuses
- Only owner can update status

---

### Story U-11: My Listings Dashboard

| Field | Value |
|-------|-------|
| **ID** | U-11 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-6–10 (aggregation) |

**Description:**  
As a **registered user**, I want a dashboard of all my listings with status badges, so that I can manage my shelf in one place.

**Acceptance Criteria:**
- `GET /api/listings/mine` returns all non-deleted owned listings
- Page S-10 shows status pill per listing (Available, Sold, Exchanged, Unavailable)
- Quick actions: Edit, Change status, View detail
- "Add book" navigates to create form

---

### Story U-12: Listing Type Toggle on Form

| Field | Value |
|-------|-------|
| **ID** | U-12 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 2 |
| **FRs** | FR-14 |

**Description:**  
As a **registered user**, I want the listing form to show or hide the price field based on sale vs exchange type, so that I only enter relevant information.

**Acceptance Criteria:**
- Selecting For Sale shows required price field (EGP)
- Selecting For Exchange hides price; shows "Swap" label on preview
- Toggle works on both create and edit forms

---

# Epic E4: Requests & Transactions

*Chat-free contact and exchange workflow.*

---

### Story U-13: Send Contact Request (Sale)

| Field | Value |
|-------|-------|
| **ID** | U-13 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 5 |
| **FRs** | FR-19, FR-23, FR-25 |

**Description:**  
As a **registered user**, I want to send a contact request with an optional message to a seller of a For Sale book, so that I can express interest without using chat.

**Acceptance Criteria:**
- `POST /api/requests` with `requestType=Contact`, `targetListingId`, optional `message` (≤500 chars)
- Request created with status `Pending`
- Cannot request own listing — returns 400 (FR-25)
- No chat thread created; toast: "Request sent. You'll be notified when they respond."
- CTA bar shows Pending pill after submit

---

### Story U-14: Propose Exchange

| Field | Value |
|-------|-------|
| **ID** | U-14 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 5 |
| **FRs** | FR-20, FR-26 |

**Description:**  
As a **registered user**, I want to propose exchanging one of my listed books for a book marked For Exchange, so that I can arrange a swap.

**Acceptance Criteria:**
- `POST /api/requests` with `requestType=Exchange`, `targetListingId`, `offeredListingId`, optional message
- Offered listing must be mine, Available, and ForExchange — else 400 (FR-26)
- Exchange sheet shows dropdown of eligible own listings only
- Both book thumbnails shown in request preview

---

### Story U-15: View Incoming Requests

| Field | Value |
|-------|-------|
| **ID** | U-15 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-21 |

**Description:**  
As a **registered user** (listing owner), I want to view incoming contact and exchange requests, so that I can respond to interested buyers.

**Acceptance Criteria:**
- `GET /api/requests/incoming` returns requests where I own the target listing
- S-12 Incoming tab shows request cards with requester name, message excerpt, status pill
- Exchange requests show both books side by side with ⇄ indicator

---

### Story U-16: View Outgoing Requests

| Field | Value |
|-------|-------|
| **ID** | U-16 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 2 |
| **FRs** | FR-21 |

**Description:**  
As a **registered user**, I want to view requests I have sent, so that I can track their status.

**Acceptance Criteria:**
- `GET /api/requests/outgoing` returns my sent requests
- S-12 Outgoing tab shows status pills: Pending (amber), Accepted (green), Rejected (red)
- No cancel action in MVP

---

### Story U-17: Accept Request

| Field | Value |
|-------|-------|
| **ID** | U-17 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 5 |
| **FRs** | FR-22, FR-23, FR-34, NFR-11 |

**Description:**  
As a **listing owner**, I want to accept a pending request, so that the sale or exchange can proceed offline.

**Acceptance Criteria:**
- `POST /api/requests/{id}/accept` sets status to `Accepted` (terminal)
- Handler runs in EF transaction; double-accept returns 409 (NFR-11)
- Sale accept: creates TransactionHistory for both parties
- Exchange accept: marks both listings `Exchanged`; creates history for both parties
- Banner: "Arrange handoff directly with {name}" — no chat opens
- Requester receives in-app notification (FR-24)

---

### Story U-18: Reject Request

| Field | Value |
|-------|-------|
| **ID** | U-18 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 2 |
| **FRs** | FR-22, FR-23 |

**Description:**  
As a **listing owner**, I want to reject a pending request, so that I can decline offers I do not want to pursue.

**Acceptance Criteria:**
- `POST /api/requests/{id}/reject` sets status to `Rejected` (terminal)
- No transaction history created
- Requester notified of rejection
- Rejected requests cannot be re-opened; user may send new request from listing detail

---

### Story U-19: View Transaction History

| Field | Value |
|-------|-------|
| **ID** | U-19 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-32, FR-33 |

**Description:**  
As a **registered user**, I want to view my completed sales and exchanges, so that I have a record of past transactions.

**Acceptance Criteria:**
- `GET /api/transactions` returns my history rows
- Each record shows: book title, counterparty displayName, completed date, type (Sale/Exchange)
- Page S-13 accessible from profile menu
- Sorted by `CompletedAt DESC`

---

### Story U-20: Request Status Notifications

| Field | Value |
|-------|-------|
| **ID** | U-20 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-24, FR-35 |

**Description:**  
As a **registered user**, I want to be notified when my request is accepted or rejected, so that I know when to arrange handoff.

**Acceptance Criteria:**
- Notification created on accept/reject with type `RequestAccepted` or `RequestRejected`
- Notification links to S-12 or listing detail
- Bell icon shows unread indicator

---

# Epic E5: Wishlist & Notifications

*Engagement features for registered users.*

---

### Story U-21: Add to Wishlist

| Field | Value |
|-------|-------|
| **ID** | U-21 |
| **Role** | Registered User |
| **Priority** | P1 — Should |
| **Story Points** | 2 |
| **FRs** | FR-28 |

**Description:**  
As a **registered user**, I want to save an available listing to my wishlist, so that I can track books I am interested in.

**Acceptance Criteria:**
- `POST /api/wishlist/{listingId}` adds item; unique per user+listing
- Heart icon on card/detail toggles to filled state
- Guest tapping heart sees login prompt
- Only Available listings can be wishlisted

---

### Story U-22: Remove from Wishlist

| Field | Value |
|-------|-------|
| **ID** | U-22 |
| **Role** | Registered User |
| **Priority** | P1 — Should |
| **Story Points** | 1 |
| **FRs** | FR-29 |

**Description:**  
As a **registered user**, I want to remove a listing from my wishlist, so that my saved list stays current.

**Acceptance Criteria:**
- `DELETE /api/wishlist/{listingId}` removes item
- Heart icon returns to outline state
- Idempotent: deleting non-existent item returns 204

---

### Story U-23: View Wishlist

| Field | Value |
|-------|-------|
| **ID** | U-23 |
| **Role** | Registered User |
| **Priority** | P1 — Should |
| **Story Points** | 2 |
| **FRs** | FR-30 |

**Description:**  
As a **registered user**, I want to view all wishlisted books in one page, so that I can quickly return to books I liked.

**Acceptance Criteria:**
- `GET /api/wishlist` returns saved listings with current status
- S-14 shows grid of wishlist cards
- Unavailable listings shown with badge; contact CTA hidden

---

### Story U-24: View In-App Notifications

| Field | Value |
|-------|-------|
| **ID** | U-24 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-35, FR-36 |

**Description:**  
As a **registered user**, I want an in-app notification list for request events, so that I stay informed without email.

**Acceptance Criteria:**
- `GET /api/notifications` returns paginated notifications
- Types include: `RequestReceived`, `RequestAccepted`, `RequestRejected`
- S-15 lists notifications with title, body, timestamp, read/unread state
- Tapping notification navigates to relevant screen

---

### Story U-25: Mark Notifications as Read

| Field | Value |
|-------|-------|
| **ID** | U-25 |
| **Role** | Registered User |
| **Priority** | P1 — Should |
| **Story Points** | 2 |
| **FRs** | FR-37 |

**Description:**  
As a **registered user**, I want to mark notifications as read, so that I can distinguish new from seen items.

**Acceptance Criteria:**
- `PATCH /api/notifications/{id}/read` sets `IsRead=true`
- Bell unread count decrements
- Optional: mark all as read endpoint

---

### Story U-26: Wishlist Availability Alert

| Field | Value |
|-------|-------|
| **ID** | U-26 |
| **Role** | Registered User |
| **Priority** | P2 — Could |
| **Story Points** | 3 |
| **FRs** | FR-31 |

**Description:**  
As a **registered user**, I want to be notified when a wishlisted book becomes available again, so that I do not miss a second chance.

**Acceptance Criteria:**
- When listing status changes from Sold/Exchanged/Unavailable → Available, notification `WishlistAvailable` sent to wishlist owners
- Notification links to listing detail
- No notification if user removed item from wishlist

---

# Epic E6: Admin Governance

*Platform administration and moderation.*

---

### Story U-27: Report a Listing

| Field | Value |
|-------|-------|
| **ID** | U-27 |
| **Role** | Registered User |
| **Priority** | P1 — Should |
| **Story Points** | 2 |
| **FRs** | FR-45 |

**Description:**  
As a **registered user**, I want to report an inappropriate listing, so that admins can review problematic content.

**Acceptance Criteria:**
- Report action on listing detail with reason text (required)
- `POST /api/listings/{id}/report` creates `ListingReport` with status `Open`
- User cannot report own listing
- Confirmation toast after submit

---

### Story A-02: Manage Categories

| Field | Value |
|-------|-------|
| **ID** | A-02 |
| **Role** | Admin |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-39, FR-40 |

**Description:**  
As an **admin**, I want to create, edit, and delete book categories in English and Arabic, so that the catalog taxonomy stays organized.

**Acceptance Criteria:**
- CRUD on `/api/admin/categories` with `NameEn`, `NameAr`
- Delete blocked with 409 if category has active listings (FR-40)
- Changes reflect immediately in public category list

---

### Story A-03: View All Listings (Moderation)

| Field | Value |
|-------|-------|
| **ID** | A-03 |
| **Role** | Admin |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-42 |

**Description:**  
As an **admin**, I want to view all listings including non-available ones, so that I have full visibility for moderation.

**Acceptance Criteria:**
- `GET /api/admin/listings` returns all listings regardless of status
- Filter by status, owner, category
- S-22 moderation page with data table

---

### Story A-04: Edit or Remove Any Listing

| Field | Value |
|-------|-------|
| **ID** | A-04 |
| **Role** | Admin |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-43 |

**Description:**  
As an **admin**, I want to edit or remove any listing, so that I can address inappropriate or erroneous content.

**Acceptance Criteria:**
- `PUT /api/admin/listings/{id}` edits any listing field
- `DELETE /api/admin/listings/{id}` soft-deletes listing
- Actions logged via structured logging (NFR-14)

---

### Story A-05: Review Reported Listings

| Field | Value |
|-------|-------|
| **ID** | A-05 |
| **Role** | Admin |
| **Priority** | P1 — Should |
| **Story Points** | 3 |
| **FRs** | FR-44 |

**Description:**  
As an **admin**, I want to view a queue of reported listings, so that I can prioritize moderation work.

**Acceptance Criteria:**
- Reported tab on S-22 shows Open reports with listing preview, reporter, reason, date
- Admin can navigate to listing, remove, or dismiss report (status → Reviewed/Dismissed)
- Dashboard alert links to reported queue count

---

### Story A-06: View User Accounts

| Field | Value |
|-------|-------|
| **ID** | A-06 |
| **Role** | Admin |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-46 |

**Description:**  
As an **admin**, I want to view user accounts with activity summary, so that I can understand platform usage per user.

**Acceptance Criteria:**
- `GET /api/admin/users` returns users with listing count, request count, join date
- S-23 user table with search by email/name
- Suspended users visually indicated

---

### Story A-07: Suspend User

| Field | Value |
|-------|-------|
| **ID** | A-07 |
| **Role** | Admin |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-47 |

**Description:**  
As an **admin**, I want to suspend a user account, so that bad actors cannot login or send new requests.

**Acceptance Criteria:**
- `POST /api/admin/users/{id}/suspend` sets `IsSuspended=true`
- Suspended user login returns clear error message
- Suspended user cannot create listings or requests
- Admin can unsuspend (reverse action)

---

### Story A-08: Deactivate User Account

| Field | Value |
|-------|-------|
| **ID** | A-08 |
| **Role** | Admin |
| **Priority** | P1 — Should |
| **Story Points** | 2 |
| **FRs** | FR-48, NFR-10 |

**Description:**  
As an **admin**, I want to deactivate a user account, so that removed users no longer appear as active sellers.

**Acceptance Criteria:**
- Deactivate sets `IsDeleted=true` on user (soft delete)
- User listings can be bulk-marked Unavailable (admin choice)
- Deactivated users cannot log in

---

### Story A-09: Admin Dashboard KPIs

| Field | Value |
|-------|-------|
| **ID** | A-09 |
| **Role** | Admin |
| **Priority** | P0 — Must |
| **Story Points** | 5 |
| **FRs** | FR-49 |

**Description:**  
As an **admin**, I want a dashboard showing total listings, active users, and exchange volume, so that I can assess platform health at a glance.

**Acceptance Criteria:**
- `GET /api/admin/dashboard` returns KPIs: total listings, active users (30d), exchanges (30d)
- S-20 shows KPI cards per UX mockup
- Reported listings alert banner when count > 0

---

### Story A-10: Popular Categories Report

| Field | Value |
|-------|-------|
| **ID** | A-10 |
| **Role** | Admin |
| **Priority** | P1 — Should |
| **Story Points** | 2 |
| **FRs** | FR-50 |

**Description:**  
As an **admin**, I want to see popular categories by listing count, so that I understand what genres dominate the marketplace.

**Acceptance Criteria:**
- Dashboard table: category name, listing count, request count
- Sorted by listing count descending

---

### Story A-11: Configure Platform Settings

| Field | Value |
|-------|-------|
| **ID** | A-11 |
| **Role** | Admin |
| **Priority** | P1 — Should |
| **Story Points** | 3 |
| **FRs** | FR-52 |

**Description:**  
As an **admin**, I want to configure max photos per listing and listing rules text, so that platform policies are enforceable and visible.

**Acceptance Criteria:**
- `GET/PUT /api/admin/settings` for keys: `MaxPhotosPerListing`, `MaxPhotoSizeMb`, `ListingRulesText`
- Upload validation reads settings dynamically
- Listing rules text displayable on create listing form (optional footer)

---

### Story A-12: Most Listed Books Report

| Field | Value |
|-------|-------|
| **ID** | A-12 |
| **Role** | Admin |
| **Priority** | P2 — Could |
| **Story Points** | 3 |
| **FRs** | FR-51 |

**Description:**  
As an **admin**, I want to see the most listed and most requested books, so that I can identify trending titles.

**Acceptance Criteria:**
- Dashboard section: top 10 titles by listing count and by request count
- Aggregated by normalized title+author

---

# Epic E7: Bilingual & Responsive UI

*Cross-cutting experience for all roles.*

---

### Story G-10: Switch Language (EN / Arabic)

| Field | Value |
|-------|-------|
| **ID** | G-10 |
| **Role** | Guest |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-53, NFR-18 |

**Description:**  
As a **guest**, I want to switch the UI between English and Arabic, so that I can use the app in my preferred language.

**Acceptance Criteria:**
- Header toggle EN | ع switches all UI strings via react-i18next
- Locale persisted in localStorage
- Categories, labels, buttons, and validation messages translated

---

### Story G-11: Responsive Browse on Mobile

| Field | Value |
|-------|-------|
| **ID** | G-11 |
| **Role** | Guest |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-55, NFR-17 |

**Description:**  
As a **guest** on a mobile browser, I want the browse experience optimized for small screens, so that I can shop for books on my phone.

**Acceptance Criteria:**
- Layout works at 375px width without horizontal scroll
- Touch targets ≥ 44px on buttons and filter chips
- 2-column listing grid on mobile; 4-column on desktop

---

### Story G-12: RTL Layout for Arabic

| Field | Value |
|-------|-------|
| **ID** | G-12 |
| **Role** | Guest |
| **Priority** | P0 — Must |
| **Story Points** | 5 |
| **FRs** | FR-54 |

**Description:**  
As an **Arabic-speaking guest**, I want the layout mirrored for right-to-left reading, so that the app feels natural in Arabic.

**Acceptance Criteria:**
- `<html dir="rtl" lang="ar">` when Arabic selected
- Layout uses logical CSS properties (`margin-inline`, `padding-inline`)
- Chevrons, back arrows, and gallery swipe direction flip
- Price displays as `ج.م` suffix in Arabic locale

---

### Story U-28: Authenticated Mobile Navigation

| Field | Value |
|-------|-------|
| **ID** | U-28 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | FR-55 |

**Description:**  
As a **registered user** on mobile, I want bottom navigation to Browse, Add, Requests, Wishlist, and Profile, so that I can reach key actions with my thumb.

**Acceptance Criteria:**
- Bottom nav visible on viewports < 1024px when authenticated
- Active tab highlighted with primary color
- Desktop uses header nav links instead of bottom nav

---

### Story U-29: Localized Form Validation

| Field | Value |
|-------|-------|
| **ID** | U-29 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 2 |
| **FRs** | NFR-16, NFR-19 |

**Description:**  
As a **registered user**, I want form validation errors in my selected language with correctly formatted dates and numbers, so that errors are easy to understand.

**Acceptance Criteria:**
- Zod/React Hook Form error messages use i18n keys
- Dates formatted per locale (ar-EG, en-US)
- Currency shown as EGP / ج.م per locale

---

### Story U-30: Kitab Visual Identity

| Field | Value |
|-------|-------|
| **ID** | U-30 |
| **Role** | Registered User |
| **Priority** | P0 — Must |
| **Story Points** | 3 |
| **FRs** | — (UX-DR1) |

**Description:**  
As a **registered user**, I want the Kitab warm literary design applied consistently, so that the marketplace feels trustworthy and distinct.

**Acceptance Criteria:**
- Primary `#1B4332`, surface `#FAF7F2`, sale badge amber, exchange badge sage
- Display headings in Literata/Georgia; body in Inter
- Loading skeletons and empty states per UX State Patterns
- No chat/message iconography anywhere

---

### Story A-13: Admin Responsive Layout

| Field | Value |
|-------|-------|
| **ID** | A-13 |
| **Role** | Admin |
| **Priority** | P1 — Should |
| **Story Points** | 2 |
| **FRs** | FR-55 |

**Description:**  
As an **admin** on a laptop, I want a sidebar admin layout with KPI dashboard, so that I can manage the platform efficiently on desktop.

**Acceptance Criteria:**
- Admin routes use sidebar on ≥ 1024px
- Sidebar collapses or stacks on smaller screens
- Matches `key-admin-dashboard.html` mock structure

---

# Appendix A: FR Traceability Matrix

| FR | Story ID(s) |
|----|-------------|
| FR-1 | G-08 |
| FR-2 | U-03 |
| FR-3 | U-04 |
| FR-4 | E0-4, A-01 |
| FR-5 | E0-4, A-01 |
| FR-6 | U-06 |
| FR-7 | U-07 |
| FR-8 | U-08, U-02 |
| FR-9 | U-09 |
| FR-10 | U-10 |
| FR-11 | G-06, U-02 |
| FR-12 | G-01, U-01 |
| FR-13 | U-06 |
| FR-14 | U-06, U-12 |
| FR-15 | G-02 |
| FR-16 | G-03 |
| FR-17 | G-04 |
| FR-18 | G-05 |
| FR-19 | U-13 |
| FR-20 | U-14 |
| FR-21 | U-15, U-16 |
| FR-22 | U-17, U-18 |
| FR-23 | U-13, U-17, U-18 |
| FR-24 | U-20 |
| FR-25 | U-13 |
| FR-26 | U-14 |
| FR-27 | G-09 |
| FR-28 | U-21 |
| FR-29 | U-22 |
| FR-30 | U-23 |
| FR-31 | U-26 |
| FR-32 | U-19 |
| FR-33 | U-19 |
| FR-34 | U-17 |
| FR-35 | U-24 |
| FR-36 | U-24 |
| FR-37 | U-25 |
| FR-38 | — (post-MVP) |
| FR-39 | A-02 |
| FR-40 | A-02 |
| FR-41 | G-07, E0-3 |
| FR-42 | A-03 |
| FR-43 | A-04 |
| FR-44 | A-05 |
| FR-45 | U-27 |
| FR-46 | A-06 |
| FR-47 | A-07 |
| FR-48 | A-08 |
| FR-49 | A-09 |
| FR-50 | A-10 |
| FR-51 | A-12 |
| FR-52 | A-11 |
| FR-53 | G-10 |
| FR-54 | G-12 |
| FR-55 | G-11, U-28, A-13 |

---

# Appendix B: MVP vs Stretch

| Priority | Stories | Points |
|----------|---------|--------|
| **P0 — Must** | 38 stories | 118 |
| **P1 — Should** | 8 stories | 30 |
| **P2 — Could** | 2 stories | 6 |
| **Platform** | 5 stories | 21 |

**Recommended MVP cutoff:** All P0 stories (118 points)  
**Full hackathon scope:** P0 + P1 (148 points)

---

*Generated from approved PRD, Architecture, ERD, and UX specifications.*
