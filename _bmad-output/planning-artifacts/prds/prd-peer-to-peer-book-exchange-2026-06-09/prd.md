---
title: Peer-to-Peer Book Exchange System
status: final
created: 2026-06-09
updated: 2026-06-09
project_type: hackathon-mvp
---

# PRD: Peer-to-Peer Book Exchange System

## 0. Document Purpose

This Product Requirements Document defines the vision, goals, personas, functional and non-functional requirements, MVP scope, and success metrics for a **Peer-to-Peer Book Exchange System** — a chat-free web marketplace where users sell or swap used books.

**Audience:** Hackathon judges, product stakeholders, and downstream workflow owners (UX, architecture, epics/stories, sprint planning).

**Structure:** Requirements use globally numbered IDs (`FR-N`, `NFR-N`, `SM-N`) for traceability to user stories, use cases, ERD, and API documentation. Technical implementation choices are captured in `addendum.md`.

**Hackathon deliverables this PRD feeds:**
- Vision Document
- Requirements Specification
- User Stories
- Use Case Diagram
- ERD (Database Design)
- API Documentation
- Wireframes
- Sprint Plan
- Final Working MVP

---

## 1. Vision

Readers deserve a simple way to give books a second life — without navigating cluttered classifieds, negotiating in endless chat threads, or paying platform fees on every transaction.

The **Peer-to-Peer Book Exchange System** is a responsive web platform where book lovers browse, buy, or swap used books directly with other readers. The product deliberately avoids real-time chat. Instead, **Contact Requests** carry a single optional message, keeping interactions lightweight and focused on completing a sale or exchange.

**Guests** can explore the full catalog without friction. **Registered Users** list books for sale or exchange, send contact or swap proposals, manage requests, track completed transactions, and save favorites to a wishlist. **Admins** keep the marketplace healthy through category management, moderation, user administration, and platform analytics.

The platform supports **Arabic and English**, serving bilingual communities in hackathon demo and real-world deployment contexts. Built as a hackathon MVP on ASP.NET Core with Clean Architecture, the system demonstrates a production-minded foundation — JWT authentication, CQRS, EF Core, and SQL Server — while delivering a demonstrable end-to-end book marketplace in a compressed timeline.

---

## 2. Goals

### 2.1 Product Goals

| ID | Goal | Rationale |
|----|------|-----------|
| G-1 | **Enable frictionless discovery** | Guests browse and search without registration; conversion happens when intent to transact is clear. |
| G-2 | **Support two transaction models in one marketplace** | Fixed-price sales and book-for-book exchanges share the same listing and request infrastructure. |
| G-3 | **Replace chat with structured requests** | Reduce moderation burden and keep hackathon scope achievable while preserving essential communication. |
| G-4 | **Give users transaction visibility** | History and wishlist features build trust and repeat engagement. |
| G-5 | **Equip admins to govern the platform** | Categories, moderation, and analytics are minimum viable governance for a public marketplace. |
| G-6 | **Ship a bilingual, mobile-friendly MVP** | Arabic/English and responsive web UI meet hackathon evaluation criteria and regional usability. |

### 2.2 Hackathon Goals

| ID | Goal | Rationale |
|----|------|-----------|
| HG-1 | **Demonstrate full-stack capability** | Working API + UI covering auth, CRUD, requests, and admin flows. |
| HG-2 | **Produce complete documentation set** | PRD, ERD, API docs, wireframes, and sprint plan align with submission requirements. |
| HG-3 | **Deliver judge-ready demo in ≤ 5 days** | MVP scope is explicitly cut to what a small team can build and demo. |

### 2.3 Non-Goals (Explicit)

- Real-time messaging or in-app chat
- Payment processing or escrow (buyers and sellers arrange payment offline)
- Shipping logistics, tracking, or courier integration
- Native mobile apps (responsive web only)
- AI-powered book recommendations (post-MVP)
- Social features (follows, feeds, reviews/ratings in v1)
- Multi-item cart or bulk checkout

---

## 3. User Personas

### 3.1 Layla — The Casual Reader (Guest → Registered User)

| Attribute | Detail |
|-----------|--------|
| **Age** | 24 |
| **Context** | University student in Cairo; reads fiction and textbooks; limited budget |
| **Tech comfort** | High; uses mobile browser daily |
| **Goals** | Find affordable used books; swap duplicates for books she wants |
| **Pain points** | Facebook groups are chaotic; doesn't want another chat app |
| **Behavior** | Browses without account first; registers only when she finds a book to contact |

### 3.2 Omar — The Active Seller & Exchanger (Registered User)

| Attribute | Detail |
|-----------|--------|
| **Age** | 35 |
| **Context** | Book collector decluttering his shelf; lists 10–20 books |
| **Tech comfort** | Moderate |
| **Goals** | Sell some books, exchange others; manage incoming requests efficiently |
| **Pain points** | Wants clear request status without back-and-forth messaging |
| **Behavior** | Lists books with photos; accepts/rejects requests; marks items sold or exchanged |

### 3.3 Nour — The Platform Administrator (Admin)

| Attribute | Detail |
|-----------|--------|
| **Age** | 28 |
| **Context** | Hackathon team member or future ops role |
| **Goals** | Keep listings appropriate; manage categories; view platform health |
| **Pain points** | Needs quick visibility into flagged content and user activity |
| **Behavior** | Reviews reported listings, suspends bad actors, adjusts category taxonomy |

### 3.4 Key User Journeys

**UJ-1. Layla discovers and contacts a seller**
- Layla opens the site on her phone (Arabic UI), searches "Dostoevsky", filters by condition "Good" and type "For Sale".
- She views book details, sees seller profile preview, and taps "Contact Seller".
- System prompts registration; she signs up with email, sends a contact request with message "Available this weekend?"
- She receives notification when the seller accepts.

**UJ-2. Omar proposes an exchange**
- Omar lists "1984" as For Exchange and "Brave New World" as For Sale.
- A user selects Omar's "1984" listing and proposes swapping their listed "Animal Farm".
- Omar reviews incoming requests, accepts the exchange proposal.
- Both parties see the transaction in history; Omar marks "1984" as exchanged.

**UJ-3. Nour moderates a flagged listing**
- Nour logs into admin dashboard, sees a reported listing with inappropriate description.
- She reviews, edits or removes the listing, and optionally suspends the user.
- Analytics reflect updated active listing count.

---

## 4. Glossary

| Term | Definition |
|------|------------|
| **Listing** | A book offered by a Registered User; has type (For Sale / For Exchange), condition, status, photos, and metadata. |
| **Contact Request** | A Registered User's request to initiate a sale conversation; includes optional message. No chat thread. |
| **Exchange Proposal** | A Contact Request variant where the requester selects one of their own Listings as the swap offer. |
| **Listing Status** | `Available`, `Sold`, `Exchanged`, or `Unavailable`. |
| **Listing Type** | `For Sale` (fixed price) or `For Exchange` (swap offer). |
| **Condition** | `New`, `Good`, `Acceptable`, or `Poor`. |
| **Wishlist** | Saved Listings per Registered User; triggers notification when status returns to Available. |
| **Transaction History** | Record of completed sales and exchanges (title, counterparty, date, type). |
| **Category** | Admin-managed taxonomy for organizing Listings (e.g., Fiction, Science, Children's). |

---

## 5. Functional Requirements

### 5.1 Authentication & Authorization

**Description:** Role-based access for Guest, Registered User, and Admin. JWT-based sessions for authenticated roles.

| ID | Requirement | Actor | Priority |
|----|-------------|-------|----------|
| FR-1 | Register with email or phone number and password | Guest | Must |
| FR-2 | Login with email or phone number and password; receive JWT | Registered User | Must |
| FR-3 | Logout and invalidate client session | Registered User, Admin | Must |
| FR-4 | Enforce RBAC: Guest (read-only public), Registered User (own resources), Admin (platform-wide) | System | Must |
| FR-5 | Admin accounts created via seeding or admin promotion (no public admin registration) | System | Must |

**Consequences (testable):**
- Unauthenticated calls to protected endpoints return HTTP 401.
- Registered User cannot edit another user's Listing.
- Admin endpoints reject non-admin JWT with HTTP 403.

---

### 5.2 Book Listings (CRUD)

**Description:** Full lifecycle management of book Listings with photos, condition, type, and status.

| ID | Requirement | Actor | Priority |
|----|-------------|-------|----------|
| FR-6 | Create Listing with title, author, category, condition, photos, description, listing type, and price (required if For Sale) | Registered User | Must |
| FR-7 | Upload multiple photos per Listing within configured image limit | Registered User | Must |
| FR-8 | Edit own Listing fields and photos | Registered User | Must |
| FR-9 | Delete own Listing (soft-delete preferred for audit) | Registered User | Must |
| FR-10 | Set Listing status to Sold, Exchanged, or Unavailable | Registered User | Must |
| FR-11 | View Listing detail including description, condition, type, photos, and owner profile preview | Guest, Registered User | Must |
| FR-12 | Browse all Available Listings without login | Guest | Must |
| FR-13 | Grade condition as New, Good, Acceptable, or Poor | Registered User | Must |
| FR-14 | Set listing type as For Sale (fixed price) or For Exchange | Registered User | Must |

**Consequences (testable):**
- For Sale Listing without price fails validation.
- Listing with status Sold/Exchanged/Unavailable excluded from default browse results.
- Photo count exceeding admin-configured limit returns validation error.

---

### 5.3 Search & Filter

**Description:** Discovery engine for finding books across the catalog.

| ID | Requirement | Actor | Priority |
|----|-------------|-------|----------|
| FR-15 | Search by title, author, or category keyword | Guest, Registered User | Must |
| FR-16 | Filter by condition, listing type, and price range | Guest, Registered User | Must |
| FR-17 | Sort by newest (default) or relevance | Guest, Registered User | Should |
| FR-18 | Paginate search results | Guest, Registered User | Must |

**Consequences (testable):**
- Price range filter applies only to For Sale Listings.
- Empty search returns paginated Available Listings.

---

### 5.4 Contact Requests & Exchange Proposals

**Description:** Structured, chat-free transaction initiation.

| ID | Requirement | Actor | Priority |
|----|-------------|-------|----------|
| FR-19 | Send Contact Request to Listing owner with optional message (For Sale) | Registered User | Must |
| FR-20 | Propose Exchange by selecting one of requester's own Available Listings as swap offer | Registered User | Must |
| FR-21 | View incoming and outgoing requests with status | Registered User | Must |
| FR-22 | Accept or reject pending requests | Listing owner | Must |
| FR-23 | Request status flow: Pending → Accepted or Rejected (terminal) | System | Must |
| FR-24 | Notify requester on status change | System | Must |
| FR-25 | Block Contact Request on own Listing | System | Must |
| FR-26 | Block Exchange Proposal if offered Listing is not Available or not For Exchange type | System | Must |
| FR-27 | Prompt Guest to register before sending any request | System | Must |

**Consequences (testable):**
- Accepted sale request creates Transaction History record for both parties.
- Accepted exchange request creates Transaction History for both Listings and parties.
- Rejected request does not create transaction record.

---

### 5.5 Wishlist

| ID | Requirement | Actor | Priority |
|----|-------------|-------|----------|
| FR-28 | Save any Available Listing to personal wishlist | Registered User | Should |
| FR-29 | Remove Listing from wishlist | Registered User | Should |
| FR-30 | View wishlist | Registered User | Should |
| FR-31 | Notify user when wishlisted Listing returns to Available from Sold/Exchanged/Unavailable | System | Could |

---

### 5.6 Transaction History

| ID | Requirement | Actor | Priority |
|----|-------------|-------|----------|
| FR-32 | View completed sales and exchanges | Registered User | Must |
| FR-33 | Each record shows book title, counterparty, date, and type (Sale or Exchange) | Registered User | Must |
| FR-34 | Auto-create history entry when request is Accepted | System | Must |

---

### 5.7 Notifications

| ID | Requirement | Actor | Priority |
|----|-------------|-------|----------|
| FR-35 | In-app notification list for request status changes | Registered User | Must |
| FR-36 | In-app notification for new incoming requests | Registered User | Must |
| FR-37 | Mark notifications as read | Registered User | Should |
| FR-38 | Email notification on request status change | Registered User | Could (post-MVP) |

---

### 5.8 Admin — Categories

| ID | Requirement | Actor | Priority |
|----|-------------|-------|----------|
| FR-39 | Create, edit, and delete book Categories | Admin | Must |
| FR-40 | Prevent deletion of Category with active Listings (or reassign) | Admin | Must |
| FR-41 | List all Categories for public browse/filter | Guest, Registered User | Must |

---

### 5.9 Admin — Moderation

| ID | Requirement | Actor | Priority |
|----|-------------|-------|----------|
| FR-42 | View all Listings including non-Available | Admin | Must |
| FR-43 | Edit or remove any Listing | Admin | Must |
| FR-44 | View reported/flagged Listings queue | Admin | Should |
| FR-45 | Registered User can report a Listing | Registered User | Should |

---

### 5.10 Admin — User Management

| ID | Requirement | Actor | Priority |
|----|-------------|-------|----------|
| FR-46 | View user accounts and activity summary | Admin | Must |
| FR-47 | Suspend user (blocks login and new requests) | Admin | Must |
| FR-48 | Remove/deactivate user account | Admin | Should |

---

### 5.11 Admin — Analytics & Settings

| ID | Requirement | Actor | Priority |
|----|-------------|-------|----------|
| FR-49 | Dashboard: total Listings, active users, exchange volume | Admin | Must |
| FR-50 | Popular Categories by listing count | Admin | Should |
| FR-51 | Most listed or most requested books | Admin | Could |
| FR-52 | Configure platform settings: max photos per Listing, listing rules text | Admin | Should |

---

### 5.12 Localization & UI

| ID | Requirement | Actor | Priority |
|----|-------------|-------|----------|
| FR-53 | UI available in Arabic and English with language toggle | All | Must |
| FR-54 | RTL layout support for Arabic | All | Must |
| FR-55 | Responsive layout for mobile and desktop browsers | All | Must |

---

## 6. Non-Functional Requirements

### 6.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1 | Listing browse/search API response (p95) | ≤ 500 ms |
| NFR-2 | Listing detail page load (p95) | ≤ 2 s on 4G mobile |
| NFR-3 | Support concurrent demo load | 50 simultaneous users without degradation |

### 6.2 Security

| ID | Requirement |
|----|-------------|
| NFR-4 | JWT authentication with configurable expiry; refresh token optional for MVP |
| NFR-5 | Passwords hashed (bcrypt or ASP.NET Identity defaults) |
| NFR-6 | HTTPS in production; SQL injection prevention via EF Core parameterized queries |
| NFR-7 | File upload validation: type whitelist (JPEG, PNG, WebP), max size per image |
| NFR-8 | RBAC enforced at API layer (not UI-only) |

### 6.3 Reliability & Data

| ID | Requirement |
|----|-------------|
| NFR-9 | SQL Server as system of record; migrations via EF Core |
| NFR-10 | Soft-delete for Listings and Users where audit trail matters |
| NFR-11 | Idempotent accept/reject on requests (no double-accept race) |

### 6.4 Maintainability & Architecture

| ID | Requirement |
|----|-------------|
| NFR-12 | Clean Architecture: Domain, Application (CQRS + MediatR), Infrastructure, API layers |
| NFR-13 | AutoMapper for DTO mapping; Swagger/OpenAPI for all public endpoints |
| NFR-14 | Structured logging for errors and admin actions |

### 6.5 Accessibility & Usability

| ID | Requirement |
|----|-------------|
| NFR-15 | WCAG 2.1 Level A minimum for hackathon demo |
| NFR-16 | Form validation messages in user's selected language |
| NFR-17 | Touch-friendly controls on mobile (min 44px tap targets) |

### 6.6 Localization

| ID | Requirement |
|----|-------------|
| NFR-18 | i18n for all user-facing strings (resource files or JSON bundles) |
| NFR-19 | Dates and numbers formatted per locale (ar-EG, en-US) |

---

## 7. MVP Scope

### 7.1 In Scope (Hackathon MVP)

**Must Have — Demo Blockers**

| Area | Scope |
|------|-------|
| Auth | Register, login, JWT, Guest vs User vs Admin roles |
| Listings | Full CRUD, photos (≤ 5 per listing), condition, type, status |
| Browse & Search | Public browse, search by title/author, filter by condition/type/price, sort by newest |
| Requests | Contact request (sale), exchange proposal, accept/reject, pending status flow |
| Notifications | In-app notifications for request events |
| Transaction History | Auto-record on accepted requests |
| Admin | Category CRUD, listing moderation (view/edit/remove), user suspend, basic dashboard (listing count, user count) |
| i18n | Arabic + English UI with RTL |
| API | RESTful ASP.NET Core Web API, Swagger docs |
| UI | Responsive web frontend (React, Blazor, or equivalent SPA) |

**Should Have — If Time Permits**

| Area | Scope |
|------|-------|
| Wishlist | Save/remove/view wishlist |
| Reporting | User flags listing; admin queue |
| Admin analytics | Popular categories, exchange volume chart |
| Platform settings | Configurable image limit |

### 7.2 Out of Scope for MVP

| Item | Reason |
|------|--------|
| Real-time chat | Explicit product non-goal |
| Payment gateway | Offline payment arrangement; reduces compliance scope |
| Email/SMS notifications | In-app sufficient for demo |
| OAuth social login | Email/phone sufficient for hackathon |
| Advanced relevance search | Newest sort acceptable for MVP |
| Wishlist availability alerts | Depends on wishlist; defer if wishlist cut |
| Native mobile apps | Responsive web meets requirement |
| AI book categorization | Nice-to-have; not in requirements |

### 7.3 Suggested MVP Demo Script (3–5 min)

1. Guest browses listings in Arabic, searches and filters.
2. Guest attempts contact → prompted to register.
3. User lists a book with photos (For Exchange).
4. Second user proposes exchange with their book.
5. Owner accepts → both see transaction history.
6. Admin shows dashboard and removes a test listing.

---

## 8. Success Metrics

### 8.1 Hackathon Demo Metrics (Primary)

| ID | Metric | Target | Validates |
|----|--------|--------|-----------|
| SM-1 | **End-to-end flow completion** | Guest browse → register → list → request → accept → history in single demo | FR-1–FR-34 |
| SM-2 | **API coverage** | ≥ 90% of Must Have FRs exposed via documented Swagger endpoints | NFR-13 |
| SM-3 | **Bilingual demo** | Full demo path runnable in both Arabic and English | FR-53, FR-54 |
| SM-4 | **Mobile usability** | Core flows usable on 375px viewport without horizontal scroll | FR-55, NFR-17 |

### 8.2 Post-Hackathon Product Metrics (Secondary)

| ID | Metric | Target (30 days post-launch) | Validates |
|----|--------|------------------------------|-----------|
| SM-5 | **Registration conversion** | ≥ 15% of guests who view Listing detail register within session | G-1 |
| SM-6 | **Listing creation rate** | ≥ 40% of registered users create ≥ 1 Listing | G-2 |
| SM-7 | **Request resolution rate** | ≥ 60% of Contact Requests reach Accepted or Rejected (not abandoned Pending) | G-3 |
| SM-8 | **Admin moderation SLA** | Reported listings reviewed within 24 hours | FR-44 |

### 8.3 Counter-Metrics (Do Not Optimize)

| ID | Metric | Rationale |
|----|--------|-----------|
| SM-C1 | Raw listing count without quality | Incentivizes spam; pair with moderation rate |
| SM-C2 | Time-to-accept without completion | Fast accepts that never result in exchange harm trust |
| SM-C3 | Notification volume per user | Over-notification causes churn |

---

## 9. Open Questions

| # | Question | Owner | Impact |
|---|----------|-------|--------|
| OQ-1 | Frontend framework: React SPA vs Blazor WASM vs server-rendered Razor? | Tech lead | Architecture, sprint split |
| OQ-2 | Image storage: local filesystem vs Azure Blob for hackathon deploy? | DevOps | Infrastructure |
| OQ-3 | Phone registration: SMS OTP in MVP or phone as username only? | PM | FR-1 scope |
| OQ-4 | Exchange accept: auto-mark both Listings as Exchanged, or manual by users? | PM | FR-10, FR-34 behavior |
| OQ-5 | Relevance sort algorithm: simple text match score vs Elasticsearch? | Architect | FR-17; defer to post-MVP |

---

## 10. Assumptions Index

| ID | Assumption |
|----|------------|
| A-1 | Users arrange payment and physical handoff offline after request acceptance |
| A-2 | One admin account seeded at deployment is sufficient for hackathon |
| A-3 | Max 5 photos per Listing for MVP unless admin setting implemented |
| A-4 | "Phone number" registration stores phone as identifier; SMS verification is post-MVP unless OQ-3 resolved |
| A-5 | Exchange acceptance automatically sets both Listings to Exchanged status |
| A-6 | Frontend is a separate SPA consuming the Web API (not monolithic MVC) |

---

## Appendix A — FR Priority Summary

| Priority | Count | Hackathon Guidance |
|----------|-------|-------------------|
| Must | 38 | Required for MVP acceptance |
| Should | 10 | Include if sprint capacity allows |
| Could | 4 | Stretch goals |

---

*Next recommended workflows: `bmad-ux` (wireframes), `bmad-create-architecture` (solution design), `bmad-create-epics-and-stories` (backlog).*
