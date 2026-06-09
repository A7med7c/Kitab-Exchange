---
name: Kitab
status: final
sources:
  - {planning_artifacts}/prds/prd-peer-to-peer-book-exchange-2026-06-09/prd.md
created: 2026-06-09
updated: 2026-06-09
---

# Kitab — Experience Spine

> Peer-to-Peer Book Exchange System. Responsive web, mobile-first. Angular 20 CSR with Angular Material, SCSS, standalone components, Angular Router, HttpClient, Signals, ngx-translate, and RTL support consuming ASP.NET Core API. Paired with `DESIGN.md`. Visual identity: `{colors.primary}`, `{colors.surface-base}`, `{typography.display}`.

## Foundation

| Attribute | Decision |
|-----------|----------|
| **Form-factor** | Responsive web; mobile-first (375px+). No native app. |
| **UI system** | Angular 20 CSR SPA, Angular Material components, SCSS |
| **API** | ASP.NET Core Web API (JWT); all mutations via REST |
| **Languages** | Arabic (ar, RTL) and English (en, LTR); user-toggle persists in `localStorage` |
| **Roles** | Guest (browse only), Registered User, Admin |
| **Auth surfaces** | Dedicated Angular routes for login/register, plus auth-required dialog from protected CTAs |

`DESIGN.md` owns visual tokens. This spine owns behavior, IA, states, and flows.

---

## Information Architecture

### Public surfaces (Guest + User)

| ID | Surface | Route | Reached from | Purpose |
|----|---------|-------|--------------|---------|
| S-01 | **Browse** | `/` or `/books` | App open, logo tap | Search, filter, grid of Available listings |
| S-02 | **Listing detail** | `/books/:id` | Listing card tap | Photos, metadata, seller preview, primary CTA |
| S-03 | **Login / Register** | modal on `/auth` | Contact CTA, header "Sign in", wishlist | Email or phone + password; returns to prior surface |
| S-04 | **Search results** | `/books?q=…` | Search submit | Same grid as Browse with query context |

### Authenticated user surfaces

| ID | Surface | Route | Reached from | Purpose |
|----|---------|-------|--------------|---------|
| S-10 | **My listings** | `/my-listings` | Bottom nav / header menu | CRUD own listings; status controls |
| S-11 | **Create / Edit listing** | `/my-listings/new`, `/my-listings/:id/edit` | "Add book" FAB or edit action | Form with photos, type, condition, price |
| S-12 | **Requests** | `/requests` | Bottom nav; notification tap | Tabs: Incoming / Outgoing; accept/reject |
| S-13 | **Transaction history** | `/history` | Profile menu | Completed sales and exchanges |
| S-14 | **Wishlist** | `/wishlist` | Bottom nav (if in MVP) | Saved listings |
| S-15 | **Notifications** | `/notifications` | Bell icon in header | In-app notification list |
| S-16 | **Profile** | `/profile` | Avatar menu | Account info, language, logout |

### Admin surfaces

| ID | Surface | Route | Reached from | Purpose |
|----|---------|-------|--------------|---------|
| S-20 | **Admin dashboard** | `/admin` | Admin nav (role-gated) | KPIs: listings, users, exchange volume |
| S-21 | **Categories** | `/admin/categories` | Admin sidebar | Category CRUD |
| S-22 | **Moderation** | `/admin/listings` | Admin sidebar | All listings; edit/remove; reported queue |
| S-23 | **Users** | `/admin/users` | Admin sidebar | View, suspend users |
| S-24 | **Settings** | `/admin/settings` | Admin sidebar | Image limits, listing rules text |

### Navigation model

**Guest header:** Logo | Search | Language toggle | Sign in

**Authenticated header:** Logo | Search | Notifications bell | Avatar menu

**Mobile bottom nav (authenticated):** Browse · Add · Requests · Wishlist* · Profile  
*Wishlist omitted from bottom nav if cut from MVP; accessible via profile menu.

**Admin:** Separate sidebar layout; no bottom nav. Admin users see "Admin" link in avatar menu.

→ IA diagram: [`wireframes/ia-book-exchange.excalidraw`](wireframes/ia-book-exchange.excalidraw)  
→ Composition references: [`ANGULAR-UI-SPEC.md`](ANGULAR-UI-SPEC.md), [`mockups/key-browse.html`](mockups/key-browse.html), [`mockups/key-listing-detail.html`](mockups/key-listing-detail.html), [`mockups/key-requests.html`](mockups/key-requests.html), [`mockups/key-admin-dashboard.html`](mockups/key-admin-dashboard.html)

Spine wins on conflict with mocks.

---

## Voice and Tone

Microcopy only. Brand posture lives in `DESIGN.md` Brand & Style.

| Context | English | Arabic (example) |
|---------|---------|------------------|
| Browse empty | "No books match your filters. Try widening your search." | "لا توجد كتب تطابق البحث. جرّب توسيع الفلاتر." |
| Contact CTA | "Contact seller" | "تواصل مع البائع" |
| Exchange CTA | "Propose exchange" | "اقترح مبادلة" |
| Registration gate | "Sign in to contact the seller" | "سجّل الدخول للتواصل مع البائع" |
| Request sent | "Request sent. You'll be notified when they respond." | "تم إرسال الطلب. سنُعلمك عند الرد." |
| Request accepted | "Accepted. Arrange handoff with {name}." | "تم القبول. رتّب التسليم مع {name}." |
| No chat reminder | Never imply ongoing chat | Never use "message", "reply", "chat" |

| Do | Don't |
|----|-------|
| "Request" / "Proposal" vocabulary | "Message", "Chat", "Inbox thread" |
| Short, direct sentences | Exclamation-heavy marketing copy |
| Name the other party on accept | "Transaction completed successfully ✓" |
| Explain offline handoff once on accept | Imply platform handles payment/shipping |

---

## Component Patterns

Behavioral. Visual specs in `DESIGN.md` Components.

| Component | Surfaces | Behavioral rules |
|-----------|----------|------------------|
| **Listing card** | S-01, S-04, S-14 | Tap opens S-02. Heart toggles wishlist (auth required). Badges: type + condition. Sold/Exchanged listings hidden from browse. |
| **Filter chip row** | S-01 | Horizontally scrollable on mobile. Active chips show `×` to clear. Filters: category, condition, type, price range. Apply on change (no separate "Apply" button). |
| **Listing detail gallery** | S-02 | Swipeable photo carousel on mobile; thumbnail strip on desktop. |
| **Primary CTA bar** | S-02 | Sticky bottom on mobile. One CTA: "Contact seller" (sale) or "Propose exchange" (exchange). Guest → S-03 modal first. |
| **Contact request sheet** | S-02 → modal | Angular Material bottom sheet on mobile / dialog on desktop. Fields: optional message (500 char max). Submit creates Pending request. No edit after send. |
| **Exchange proposal sheet** | S-02 → modal | Same as contact + required `mat-select`: "Your book to offer" (user's Available For Exchange listings only). |
| **Request card** | S-12 | Incoming: Accept / Reject buttons when Pending. Outgoing: status pill only. Tap expands message + linked listings. |
| **Listing form** | S-11 | Type toggle (Sale / Exchange) shows/hides price field. Photo upload with drag-drop desktop, camera/gallery mobile. Validate before submit. |
| **Status selector** | S-10 | Dropdown on own listing: Available → Sold / Exchanged / Unavailable. Confirm dialog on terminal statuses. |
| **Notification item** | S-15 | Tap navigates to S-12 or S-02. Unread dot on bell until cleared. |
| **Admin KPI card** | S-20 | Number + label + optional sparkline. Not interactive in MVP. |
| **Language toggle** | Global header | Switches `dir`, `lang`, and i18n bundle. No page reload if client-side i18n. |

---

## State Patterns

| State | Surface | Treatment |
|-------|---------|-----------|
| **Loading browse** | S-01 | `Skeleton` grid matching 2-col mobile layout (6 cards). |
| **Empty browse** | S-01 | `display-sm`: "No books yet." Body: "Be the first to list a book." CTA: "Add a book" (auth) or "Sign in" (guest). |
| **Empty filters** | S-01 | "No books match your filters." Link: "Clear all filters." |
| **Guest contact attempt** | S-02 | `Dialog`: "Sign in to contact the seller." Primary: Register. Secondary: Sign in. |
| **Pending request (outgoing)** | S-12 | Amber pill "Pending". No cancel in MVP. |
| **Accepted request** | S-12 | Green pill "Accepted". Banner: "Arrange payment and handoff directly with {name}." |
| **Rejected request** | S-12 | Red pill "Rejected". No resubmit; user may send new request from S-02. |
| **Own listing** | S-02 | Hide contact CTA. Show "Edit listing" and status controls. |
| **Unavailable listing** | S-02 | Gray banner: "This book is no longer available." Hide CTA. Wishlist users get notification if it returns to Available. |
| **Form validation error** | S-11 | Inline field errors in user's language. Summary toast on submit failure. |
| **Unauthorized admin** | S-20+ | Redirect to S-01. No "access denied" page. |
| **Suspended user** | Login | "Your account has been suspended. Contact support." |
| **Offline** | Global | Toast once: "You're offline. Some actions unavailable." Browse cache read-only if implemented. |

---

## Interaction Primitives

**Primary input:** touch on mobile, click on desktop.

| Action | Behavior |
|--------|----------|
| Tap listing card | Navigate to S-02 |
| Tap heart | Toggle wishlist (optimistic; revert on 401 → S-03) |
| Pull to refresh | S-01, S-12 — reload data |
| Swipe photo | S-02 gallery |
| Accept / Reject | S-12 — confirm not required; immediate API call with optimistic UI |
| Back | Browser back; preserve scroll position on S-01 |

**Banned in MVP:**
- Real-time chat or typing indicators
- Infinite scroll (use "Load more" pagination)
- Drag-to-reorder photos (tap to remove, add at end)
- Hover-only actions on mobile breakpoints
- Multi-step checkout or cart

---

## Accessibility Floor

- WCAG 2.1 Level A minimum (PRD NFR-15); target AA on text contrast for `{colors.text-primary}` on `{colors.surface-base}`.
- All images: `alt` = "{title} by {author}, {condition} condition".
- `dir="rtl"` on `<html>` when Arabic selected; logical properties for layout (`margin-inline-start`, etc.).
- Focus order matches reading order; `Esc` closes modals/sheets.
- Status pills include text, not color alone: "Pending", "Accepted", "Rejected".
- Form fields: associated `<label>`; errors linked via `aria-describedby`.
- Touch targets ≥ 44px (`DESIGN.md` `{components.button-primary.minHeight}`).
- Notification bell: `aria-live="polite"` region for new notification count.

---

## Responsive & Platform

| Breakpoint | Layout |
|------------|--------|
| `< 768px` (mobile) | Single column; bottom nav; sticky CTA on S-02; filter chips scroll horizontally; sheets for modals |
| `768–1023px` (tablet) | 3-col listing grid; bottom nav retained |
| `≥ 1024px` (desktop) | 4-col grid; sidebar filter panel (replaces chip-only); dialogs instead of sheets; no bottom nav — header nav links |

**RTL (Arabic):**
- Mirror header, bottom nav, card layouts
- Chevron icons flip direction
- Price displays as `{amount} ج.م` or `EGP {amount}` per locale convention
- Search icon remains at **start** edge (inline-start)

---

## Inspiration & Anti-patterns

**Lifted from:**
- **Facebook Marketplace** — card grid density, photo-first listings (without social graph noise)
- **Vinted / Depop** — single-tap contact flow, status on listings (without in-app chat)
- **Open Library** — literary metadata presentation (title, author prominence)

**Rejected:**
- **WhatsApp / Messenger integration** — contradicts chat-free product (PRD non-goal)
- **Star ratings on sellers** — deferred; adds moderation scope
- **Map-based discovery** — irrelevant for book exchange MVP
- **Gamification** (badges, streaks) — undermines trust-focused tone
- **Auto-playing carousels** — accessibility and data cost

---

## Key Flows

### Flow 1 — Layla discovers and contacts a seller (UJ-1)

**Persona:** Layla, 24, student, Arabic UI, mobile browser.

1. Layla opens Kitab. **S-01 Browse** loads in Arabic (`dir=rtl`). She taps search, types "دوستويفسكي".
2. She taps filter chips: Condition **Good**, Type **For Sale**. Grid updates.
3. She taps a listing card → **S-02 Listing detail**. Swipes photos; reads description; sees seller preview "Omar · member since 2024".
4. She taps sticky CTA **"تواصل مع البائع"**. System shows **S-03 Register** dialog: "سجّل الدخول للتواصل مع البائع".
5. She registers with email. Dialog closes; **Contact request sheet** opens. She types "هل الكتاب متاح هذا الأسبوع؟" and submits.
6. **Climax:** Toast — "تم إرسال الطلب." CTA bar changes to amber pill **"قيد الانتظار"**. She is not dropped into a chat thread — the screen tells her she will be notified. Later, notification bell shows dot; she opens **S-12** and sees green **"مقبول"** with banner to arrange handoff with Omar.

**Failure:** Network error on submit → toast "تعذّر الإرسال. حاول مرة أخرى." Sheet stays open with message preserved.

→ Wireframe: [`wireframes/flow-contact-request.excalidraw`](wireframes/flow-contact-request.excalidraw)

---

### Flow 2 — Omar accepts an exchange proposal (UJ-2)

**Persona:** Omar, 35, seller with mixed sale/exchange listings.

1. Omar opens **S-12 Requests**, tab **Incoming**. Sees card: "Youssef wants to exchange **Animal Farm** for your **1984**" with message excerpt.
2. He taps the card to expand both book thumbnails side by side.
3. He taps **Accept**.
4. **Climax:** Card animates to green **Accepted**. Both listings auto-mark **Exchanged** (per PRD assumption A-5). **S-13 History** gains a new row. No chat opens — banner reads "Arrange the swap with Youssef directly."

**Failure:** Youssef's offered book became unavailable → API returns 409 → toast "This exchange is no longer available." Request auto-rejected.

---

### Flow 3 — Omar lists a new book

**Persona:** Omar, desktop browser, English UI.

1. Omar taps **Add** (bottom nav) → **S-11 Create listing**.
2. He uploads 3 photos, enters title "Brave New World", author "Aldous Huxley", category Fiction, condition Good.
3. He selects **For Sale**, enters price 120 EGP.
4. Taps **Publish**.
5. **Climax:** Redirect to **S-02** for the new listing with shareable URL. **S-10 My listings** shows the row with status **Available**.

**Failure:** Price missing on For Sale → inline error "Price is required for sale listings."

---

### Flow 4 — Nour moderates a flagged listing (UJ-3)

**Persona:** Nour, admin, laptop.

1. Nour opens **S-20 Admin dashboard**. Sees KPI cards and "3 reported listings" alert link.
2. Navigates to **S-22 Moderation** → Reported tab.
3. Reviews listing with inappropriate description. Taps **Remove listing** → confirm dialog.
4. **Climax:** Listing removed from public browse. Dashboard active listing count decrements. Optional: **Suspend user** from **S-23**.

---

## Surface ↔ Journey Closure

| Stated need (PRD) | Surface | Journey |
|-------------------|---------|---------|
| Guest browse/search | S-01, S-04 | Flow 1 steps 1–2 |
| Contact without chat | S-02 + sheet | Flow 1 steps 4–6 |
| Exchange proposal | S-02 + exchange sheet | Flow 2 |
| Manage requests | S-12 | Flow 2 |
| List a book | S-11 | Flow 3 |
| Transaction history | S-13 | Flow 2 climax |
| Admin moderation | S-22 | Flow 4 |
| Bilingual RTL | Global | Flow 1 |

All surfaces have at least one journey. All MVP journeys land on defined surfaces.

---

## Open Questions

| # | Question | UX impact |
|---|----------|-----------|
| OQ-UX-1 | Wishlist in bottom nav or profile only? | S-14 prominence |
| OQ-UX-2 | FAB vs header "Add" for create listing on mobile? | S-11 entry |
| OQ-UX-3 | Show seller phone after accept, or message-only? | Post-accept banner content |

---

## Assumptions

| ID | Assumption |
|----|------------|
| A-UX-1 | Client-side i18n with ngx-translate; API returns locale-neutral data |
| A-UX-2 | Guest can view all listing detail; only contact/wishlist require auth |
| A-UX-3 | Single modal stack depth (no dialog on dialog) |
| A-UX-4 | Admin uses same app shell with role-gated routes, not separate deploy |

---

*Next recommended: `bmad-create-architecture`, `bmad-create-epics-and-stories`.*
