---
title: Kitab — Sprint Plan
status: final
created: 2026-06-09
duration_days: 5
team_size: 3-4
total_story_points: 157
mvp_story_points: 118
---

# Kitab — Hackathon Sprint Plan

**Project:** Peer-to-Peer Book Exchange System  
**Duration:** 5 days  
**Team:** 3–4 developers (suggested split: 2 backend, 1–2 frontend)  
**Velocity assumption:** ~25–30 points/day with parallel work

**Tracking file:** [`../implementation-artifacts/sprint-status.yaml`](../implementation-artifacts/sprint-status.yaml)  
**Stories source:** [`user-stories-peer-to-peer-book-exchange.md`](user-stories-peer-to-peer-book-exchange.md)

---

## Sprint Goals

| Goal | Success criteria |
|------|------------------|
| **G1 — Runnable platform** | API + SPA + SQL Server running locally by end of Day 1 |
| **G2 — Guest demo path** | Browse, search, view detail without login by Day 2 |
| **G3 — Core transaction** | List book → contact/exchange → accept → history by Day 3 |
| **G4 — Admin governance** | Dashboard, moderation, categories by Day 4 |
| **G5 — Judge-ready MVP** | Bilingual RTL demo + Swagger docs by Day 5 |

---

## Sprint Calendar

### Day 1 — Foundation (Epic E0) · 21 points

**Sprint goal:** Development environment ready; auth pipeline working.

| Order | Story ID | Key | Points | Owner | Priority |
|-------|----------|-----|--------|-------|----------|
| 1 | E0-1 | `e0-1-scaffold-backend-solution` | 5 | Backend | P0 |
| 2 | E0-2 | `e0-2-scaffold-react-frontend` | 3 | Frontend | P0 |
| 3 | E0-3 | `e0-3-database-schema-category-seed` | 5 | Backend | P0 |
| 4 | E0-4 | `e0-4-rbac-admin-seed` | 3 | Backend | P0 |
| 5 | E0-5 | `e0-5-jwt-authentication-pipeline` | 5 | Backend | P0 |

**Parallel work:** Frontend scaffolds while backend completes E0-1 → E0-3.

**End-of-day demo:** Swagger shows `/api/categories`; admin seed login returns JWT.

**Checkpoint:** `docker-compose up` + `dotnet run` + `npm run dev` all green.

---

### Day 2 — Discovery & Access (Epics E1 + E2) · 37 points

**Sprint goal:** Guests browse and search; users can register and log in.

| Order | Story ID | Key | Points | Owner | Priority |
|-------|----------|-----|--------|-------|----------|
| 1 | G-01 | `g-01-browse-available-listings` | 3 | Full-stack | P0 |
| 2 | G-07 | `g-07-view-categories-for-browse` | 1 | Frontend | P0 |
| 3 | G-05 | `g-05-paginate-browse-results` | 2 | Backend | P0 |
| 4 | G-02 | `g-02-search-books-by-keyword` | 3 | Backend | P0 |
| 5 | G-03 | `g-03-filter-listings` | 3 | Full-stack | P0 |
| 6 | G-06 | `g-06-view-listing-detail` | 3 | Full-stack | P0 |
| 7 | G-08 | `g-08-register-account` | 3 | Full-stack | P0 |
| 8 | U-03 | `u-03-login` | 2 | Full-stack | P0 |
| 9 | U-04 | `u-04-logout` | 1 | Frontend | P0 |
| 10 | A-01 | `a-01-admin-login-access` | 2 | Full-stack | P0 |
| 11 | U-01 | `u-01-browse-as-registered-user` | 1 | Frontend | P0 |
| 12 | G-04 | `g-04-sort-listing-results` | 2 | Backend | P1 |
| 13 | U-05 | `u-05-view-profile` | 2 | Frontend | P1 |
| 14 | U-02 | `u-02-view-own-listing-on-detail-page` | 2 | Frontend | P0 |

**Defer if behind:** G-04, U-05

**End-of-day demo:** Guest browses catalog; user registers and logs in; admin reaches `/admin` shell.

---

### Day 3 — Listings & Requests (Epics E3 + E4) · 63 points

**Sprint goal:** End-to-end sale and exchange flow — the hackathon climax.

| Order | Story ID | Key | Points | Owner | Priority |
|-------|----------|-----|--------|-------|----------|
| 1 | U-06 | `u-06-create-book-listing` | 5 | Full-stack | P0 |
| 2 | U-07 | `u-07-upload-listing-photos` | 5 | Full-stack | P0 |
| 3 | U-12 | `u-12-listing-type-toggle-on-form` | 2 | Frontend | P0 |
| 4 | U-11 | `u-11-my-listings-dashboard` | 3 | Frontend | P0 |
| 5 | U-08 | `u-08-edit-own-listing` | 3 | Full-stack | P0 |
| 6 | U-10 | `u-10-update-listing-status` | 3 | Full-stack | P0 |
| 7 | G-09 | `g-09-registration-gate-on-contact` | 2 | Frontend | P0 |
| 8 | U-13 | `u-13-send-contact-request-sale` | 5 | Full-stack | P0 |
| 9 | U-14 | `u-14-propose-exchange` | 5 | Full-stack | P0 |
| 10 | U-15 | `u-15-view-incoming-requests` | 3 | Full-stack | P0 |
| 11 | U-16 | `u-16-view-outgoing-requests` | 2 | Frontend | P0 |
| 12 | U-17 | `u-17-accept-request` | 5 | Backend | P0 |
| 13 | U-18 | `u-18-reject-request` | 2 | Backend | P0 |
| 14 | U-19 | `u-19-view-transaction-history` | 3 | Full-stack | P0 |
| 15 | U-09 | `u-09-delete-own-listing` | 2 | Backend | P0 |
| 16 | U-20 | `u-20-request-status-notifications` | 3 | Full-stack | P0 |

**Defer if behind:** U-09

**End-of-day demo (3-min script):**
1. Omar lists "1984" for exchange  
2. Layla registers, proposes swap  
3. Omar accepts → both see transaction history  
4. No chat UI anywhere  

---

### Day 4 — Engagement & Admin (Epics E5 + E6) · 44 points

**Sprint goal:** Notifications, wishlist, admin dashboard and moderation.

| Order | Story ID | Key | Points | Owner | Priority |
|-------|----------|-----|--------|-------|----------|
| 1 | U-24 | `u-24-view-in-app-notifications` | 3 | Full-stack | P0 |
| 2 | U-25 | `u-25-mark-notifications-as-read` | 2 | Frontend | P1 |
| 3 | U-21 | `u-21-add-to-wishlist` | 2 | Full-stack | P1 |
| 4 | U-22 | `u-22-remove-from-wishlist` | 1 | Frontend | P1 |
| 5 | U-23 | `u-23-view-wishlist` | 2 | Frontend | P1 |
| 6 | A-02 | `a-02-manage-categories` | 3 | Full-stack | P0 |
| 7 | A-09 | `a-09-admin-dashboard-kpis` | 5 | Full-stack | P0 |
| 8 | A-03 | `a-03-view-all-listings-moderation` | 3 | Full-stack | P0 |
| 9 | A-04 | `a-04-edit-or-remove-any-listing` | 3 | Backend | P0 |
| 10 | A-06 | `a-06-view-user-accounts` | 3 | Full-stack | P0 |
| 11 | A-07 | `a-07-suspend-user` | 3 | Backend | P0 |
| 12 | A-10 | `a-10-popular-categories-report` | 2 | Backend | P1 |
| 13 | A-11 | `a-11-configure-platform-settings` | 3 | Full-stack | P1 |
| 14 | U-27 | `u-27-report-a-listing` | 2 | Full-stack | P1 |
| 15 | A-05 | `a-05-review-reported-listings` | 3 | Full-stack | P1 |

**Defer if behind:** U-25, wishlist trio, A-05, A-10, A-11, U-27

**End-of-day demo:** Nour removes flagged listing; dashboard KPIs update.

---

### Day 5 — Polish, i18n & Submission (Epic E7 + buffer) · 16 points + docs

**Sprint goal:** Bilingual judge demo; documentation package complete.

| Order | Story ID | Key | Points | Owner | Priority |
|-------|----------|-----|--------|-------|----------|
| 1 | G-10 | `g-10-switch-language-en-arabic` | 3 | Frontend | P0 |
| 2 | G-12 | `g-12-rtl-layout-for-arabic` | 5 | Frontend | P0 |
| 3 | G-11 | `g-11-responsive-browse-on-mobile` | 3 | Frontend | P0 |
| 4 | U-28 | `u-28-authenticated-mobile-navigation` | 3 | Frontend | P0 |
| 5 | U-30 | `u-30-kitab-visual-identity` | 3 | Frontend | P0 |
| 6 | U-29 | `u-29-localized-form-validation` | 2 | Frontend | P0 |
| 7 | A-13 | `a-13-admin-responsive-layout` | 2 | Frontend | P1 |

**Stretch (time permitting):**
- U-26 `u-26-wishlist-availability-alert` (3 pts, P2)
- A-08 `a-08-deactivate-user-account` (2 pts, P1)
- A-12 `a-12-most-listed-books-report` (3 pts, P2)

**Non-story deliverables (Day 5):**

| Deliverable | Source artifact |
|-------------|-----------------|
| Vision Document | PRD §1 Vision |
| Requirements Specification | PRD §5 FRs/NFRs |
| User Stories | `user-stories-peer-to-peer-book-exchange.md` |
| Use Case Diagram | Derive from PRD journeys UJ-1–3 |
| ERD | `erd-peer-to-peer-book-exchange.md` |
| API Documentation | Swagger + architecture API section |
| Wireframes | `ux-designs/.../mockups/` + Excalidraw |
| Sprint Plan | This document |
| Working MVP | Deployed API + SPA |
| AI tool reference | Document Cursor/BMad usage |

**End-of-day demo:** Full flow in Arabic RTL on mobile viewport.

---

## Team Allocation (Suggested)

| Role | Focus | Primary epics |
|------|-------|---------------|
| **Backend Dev A** | API, CQRS handlers, EF migrations | E0, E3, E4, E6 |
| **Backend Dev B** | Auth, requests, notifications, admin queries | E0, E2, E4, E5, E6 |
| **Frontend Dev** | React SPA, shadcn, i18n, RTL | E1, E2, E7, all UI |
| **Full-stack / Lead** | Integration, demo script, Swagger, deploy | E4 climax, Day 5 polish |

---

## Risk Register

| Risk | Mitigation | Owner |
|------|------------|-------|
| Photo upload complexity | Use local `wwwroot/uploads` only; max 3 photos for demo | Backend |
| Day 3 overload (63 pts) | Start U-06/U-07 on Day 2 evening if ahead | Lead |
| RTL bugs | Test Arabic on Day 4 evening, not Day 5 only | Frontend |
| Exchange accept race | Implement transaction in U-17 per architecture (NFR-11) | Backend |
| Scope creep (chat) | PRD non-goal — reject any chat UI PRs | Lead |

---

## Definition of Done (per story)

- [ ] Acceptance criteria met and manually tested
- [ ] API endpoint documented in Swagger (if applicable)
- [ ] No linter/build errors
- [ ] Story status updated in `sprint-status.yaml`
- [ ] Demo-able increment (no broken main flow)

---

## Sprint Burndown Targets

| Day | Cumulative points (target) | MVP % |
|-----|---------------------------|-------|
| 1 | 21 | 18% |
| 2 | 58 | 49% |
| 3 | 121 | — (exceeds MVP 118 with P1 items) |
| 4 | 165 | P0 complete |
| 5 | 181 + polish | Submission ready |

**MVP cutoff:** All P0 stories (118 points) — achievable by end of Day 3 with focused scope.

---

## Retrospective Schedule

| Epic | When | Key question |
|------|------|--------------|
| E0 | End Day 1 | Is Clean Architecture slowing us down or helping? |
| E3+E4 | End Day 3 | Did accept-handler transaction work first try? |
| E6 | End Day 4 | Is admin scope trimmed enough? |
| Final | End Day 5 | What would we cut if we had 3 days not 5? |

Update retrospective status in `sprint-status.yaml` (`epic-N-retrospective: done`).

---

*Start implementation with `bmad-dev-story` on story `e0-1-scaffold-backend-solution`.*
