# Addendum: Technical Context — Peer-to-Peer Book Exchange System

*This addendum preserves implementation and technology decisions that support the PRD but do not belong in capability-focused requirements.*

---

## Technology Stack (Hackathon)

| Layer | Technology |
|-------|------------|
| API | ASP.NET Core Web API (.NET 8+) |
| Architecture | Clean Architecture (Domain, Application, Infrastructure, API) |
| Patterns | CQRS with MediatR |
| ORM | Entity Framework Core |
| Database | SQL Server |
| Auth | JWT Bearer tokens |
| Mapping | AutoMapper |
| API Docs | Swagger / OpenAPI |
| Frontend | TBD — React or Blazor SPA recommended (see OQ-1 in PRD) |

---

## Suggested Solution Layers

```
BookExchange.sln
├── BookExchange.Domain          # Entities, enums, domain events
├── BookExchange.Application     # Commands, queries, handlers, DTOs, validators
├── BookExchange.Infrastructure  # EF Core, repositories, file storage, notifications
└── BookExchange.API             # Controllers, JWT middleware, Swagger
```

---

## Core Domain Entities (ERD Seed)

| Entity | Key Relationships |
|--------|-------------------|
| User | Role (Guest implicit, Registered, Admin); Listings, Requests, Wishlist |
| Listing | User (owner), Category; photos; type, condition, status |
| Category | Admin-managed; one-to-many Listings |
| ContactRequest | Requester, Listing (target); optional OfferedListing for exchange |
| TransactionHistory | User, Listing, counterparty, type, date |
| WishlistItem | User, Listing |
| Notification | User, type, payload, read flag |
| PlatformSetting | Key-value config (image limits, rules text) |
| ListingReport | Reporter, Listing, reason, status |

---

## API Surface (High-Level)

| Area | Example Endpoints |
|------|-------------------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Listings | `GET /api/listings`, `GET /api/listings/{id}`, `POST /api/listings`, `PUT /api/listings/{id}`, `DELETE /api/listings/{id}`, `PATCH /api/listings/{id}/status` |
| Search | `GET /api/listings/search?q=&category=&condition=&type=&minPrice=&maxPrice=&sort=` |
| Requests | `POST /api/requests`, `GET /api/requests/incoming`, `GET /api/requests/outgoing`, `POST /api/requests/{id}/accept`, `POST /api/requests/{id}/reject` |
| Wishlist | `GET /api/wishlist`, `POST /api/wishlist/{listingId}`, `DELETE /api/wishlist/{listingId}` |
| History | `GET /api/transactions` |
| Notifications | `GET /api/notifications`, `PATCH /api/notifications/{id}/read` |
| Admin Categories | `GET/POST/PUT/DELETE /api/admin/categories` |
| Admin Moderation | `GET /api/admin/listings`, `PUT /api/admin/listings/{id}`, `DELETE /api/admin/listings/{id}` |
| Admin Users | `GET /api/admin/users`, `POST /api/admin/users/{id}/suspend` |
| Admin Analytics | `GET /api/admin/dashboard` |
| Admin Settings | `GET/PUT /api/admin/settings` |

---

## CQRS Command/Query Examples

| Type | Name |
|------|------|
| Command | `CreateListingCommand`, `UpdateListingCommand`, `SendContactRequestCommand`, `ProposeExchangeCommand`, `AcceptRequestCommand`, `RejectRequestCommand` |
| Query | `GetListingsQuery`, `SearchListingsQuery`, `GetListingByIdQuery`, `GetIncomingRequestsQuery`, `GetTransactionHistoryQuery` |

---

## AI Tool Reference (Hackathon Submission)

Document which AI tools assisted the project, for example:

- **Cursor / BMad** — PRD, architecture, story generation
- **GitHub Copilot** — boilerplate and handler scaffolding
- **ChatGPT / Claude** — API design review, test data

Include screenshots or links in the final submission package.
