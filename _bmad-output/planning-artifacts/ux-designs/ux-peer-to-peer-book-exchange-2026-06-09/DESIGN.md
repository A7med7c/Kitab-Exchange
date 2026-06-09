---
name: Kitab
description: Bilingual peer-to-peer book marketplace. Angular 20 with Angular Material and SCSS; this DESIGN.md specifies the brand-layer delta for a warm, literary exchange surface.
status: final
created: 2026-06-09
updated: 2026-06-09
colors:
  primary: '#1B4332'
  primary-foreground: '#FFFFFF'
  primary-dark: '#40916C'
  primary-foreground-dark: '#0D1F17'
  accent: '#D4A373'
  accent-foreground: '#1A1208'
  accent-dark: '#E9C46A'
  accent-foreground-dark: '#1A1208'
  surface-base: '#FAF7F2'
  surface-base-dark: '#1A1A18'
  surface-elevated: '#FFFFFF'
  surface-elevated-dark: '#252522'
  text-primary: '#1A1A18'
  text-primary-dark: '#F5F2EB'
  text-muted: '#6B6560'
  text-muted-dark: '#A8A29E'
  border-subtle: '#E8E2D9'
  border-subtle-dark: '#3D3D38'
  success: '#2D6A4F'
  success-foreground: '#FFFFFF'
  warning: '#BC6C25'
  warning-foreground: '#FFFFFF'
  destructive: '#9B2226'
  destructive-foreground: '#FFFFFF'
  badge-sale: '#D4A373'
  badge-exchange: '#40916C'
  badge-condition-new: '#2D6A4F'
  badge-condition-good: '#52B788'
  badge-condition-acceptable: '#BC6C25'
  badge-condition-poor: '#9B2226'
typography:
  display:
    fontFamily: 'Literata, Georgia, serif'
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-sm:
    fontFamily: 'Literata, Georgia, serif'
    fontSize: 22px
    fontWeight: '600'
    lineHeight: '1.25'
  body:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.45'
  label:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: 0.01em
  price:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
rounded:
  sm: 6px
  md: 10px
  lg: 14px
  xl: 20px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 20px
  '6': 24px
  '8': 32px
  '10': 40px
  gutter-mobile: 16px
  gutter-desktop: 24px
  section-gap: 32px
components:
  button-primary:
    background: '{colors.primary}'
    foreground: '{colors.primary-foreground}'
    radius: '{rounded.md}'
    minHeight: 44px
  button-secondary:
    background: transparent
    foreground: '{colors.primary}'
    border: '1px solid {colors.border-subtle}'
    radius: '{rounded.md}'
    minHeight: 44px
  listing-card:
    background: '{colors.surface-elevated}'
    radius: '{rounded.lg}'
    border: '1px solid {colors.border-subtle}'
    imageRadius: '{rounded.md}'
  badge-sale:
    background: '{colors.badge-sale}'
    foreground: '{colors.accent-foreground}'
    radius: '{rounded.full}'
  badge-exchange:
    background: '{colors.badge-exchange}'
    foreground: '#FFFFFF'
    radius: '{rounded.full}'
  search-bar:
    background: '{colors.surface-elevated}'
    border: '1px solid {colors.border-subtle}'
    radius: '{rounded.full}'
    height: 44px
  bottom-nav:
    background: '{colors.surface-elevated}'
    borderTop: '1px solid {colors.border-subtle}'
    height: 64px
  request-card:
    background: '{colors.surface-elevated}'
    radius: '{rounded.lg}'
    border: '1px solid {colors.border-subtle}'
    statusPending: '{colors.warning}'
    statusAccepted: '{colors.success}'
    statusRejected: '{colors.destructive}'
---

## Brand & Style

**Kitab** (كتاب) is a peer-to-peer book marketplace that feels like browsing a well-organized neighborhood bookshelf — not a chaotic classifieds feed. The aesthetic is **warm literary minimalism**: cream paper surfaces, forest-green trust anchors, and amber accents reserved for commerce moments (prices, sale badges).

The product promise is **clarity over conversation**. There is no chat bubble iconography, no message threads, no typing indicators. Requests are single-shot cards with a status pill — the visual language says *decide*, not *discuss*.

Kitab inherits Angular Material defaults for structural components (`MatDialog`, `MatBottomSheet`, `MatSelect`, `MatSnackBar`, `MatTabs`, `MatMenu`, `MatCard`, `MatButton`). This DESIGN.md specifies brand-layer deltas only: palette, display typography, listing-specific components, and badge vocabulary.

Bilingual by design: Arabic and English share the same visual system. RTL is a layout mirror, not a separate theme.

## Colors

- **Forest Primary (`{colors.primary}`)** — Primary buttons, active nav, links, header logo. Overrides the Angular Material primary theme role. Conveys trust and calm; avoids the aggressive red/orange of discount marketplaces.
- **Paper Surface (`{colors.surface-base}`)** — Page background. Warm off-white, not clinical gray. Makes book cover photos pop.
- **Elevated Card (`{colors.surface-elevated}`)** — Listing cards, request cards, modals. Pure white on paper for subtle depth without heavy shadows.
- **Amber Accent (`{colors.accent}`)** — Sale prices, "For Sale" badges, primary CTA on guest conversion moments. Never used for exchange badges or admin chrome.
- **Sage Exchange (`{colors.badge-exchange}`)** — "For Exchange" badges exclusively. Distinguishes swap listings from sale listings at a glance.
- **Condition ramp** — `badge-condition-new` through `badge-condition-poor` map to listing condition pills. Semantic: green → amber → red as quality decreases.
- **Status semantics** — `success` (accepted), `warning` (pending), `destructive` (rejected, remove actions). Use consistent Angular Material button and badge variants for remove/delete actions.

Avoid: chat-green (#25D366 associations), gradient hero banners, neon sale stickers, dark-mode-only design (light mode is the demo default; dark tokens exist for completeness).

## Typography

- **Display (`{typography.display}`)** — Page titles ("Browse Books", "My Requests"), empty-state headlines. Literata serif gives a bookshelf identity without sacrificing readability.
- **Body (`{typography.body}`)** — Descriptions, form labels, request messages. Inter/system sans for UI density and Arabic glyph support.
- **Price (`{typography.price}`)** — Listing prices only. Bold, slightly larger than body. Never used for non-monetary numbers.
- **Arabic** — Same scale; `font-family` falls back to `Noto Sans Arabic, Inter, system-ui`. Display role may use `Noto Naskh Arabic` where Literata lacks glyphs.

## Layout & Spacing

- **Mobile gutter:** `{spacing.gutter-mobile}` (16px). **Desktop gutter:** `{spacing.gutter-desktop}` (24px).
- **Max content width:** 1200px on browse grid; 640px on forms and request detail.
- **Listing grid:** 2 columns on mobile (`≥360px`), 3 on tablet, 4 on desktop.
- **Touch targets:** minimum 44px height on all interactive elements (`{components.button-primary.minHeight}`).
- **Section gap:** `{spacing.section-gap}` between filter bar and results grid.

## Elevation & Depth

Restrained. Listing cards use 1px `{colors.border-subtle}` border, not shadow. Hover on desktop adds subtle Angular Material elevation only. Modals and bottom sheets use Angular Material overlay defaults. No floating action buttons with heavy drop shadows.

## Shapes

Softer than Drift, rounder than enterprise SaaS:
- `{rounded.md}` — buttons, inputs, book cover thumbnails
- `{rounded.lg}` — cards
- `{rounded.full}` — search bar, badges, avatar
- `{rounded.xl}` — bottom sheet top corners

Book cover images always `{rounded.md}` inside `{rounded.lg}` cards — covers feel like physical objects on a shelf.

## Components

**Inherited from Angular Material:** `MatDialog`, `MatBottomSheet`, `MatSelect`, `MatCheckbox`, `MatRadioGroup`, `MatSnackBar`, `MatTabs`, `MatMenu`, `MatCard`, `MatProgressSpinner`, `MatProgressBar`.

**Brand-layer components:**

| Component | Visual spec |
|-----------|-------------|
| **Listing card** | `{components.listing-card}`. Cover image top, title/author below, row of badges (type + condition), price or "Exchange" label. Wishlist heart top-end overlay. |
| **Search bar** | `{components.search-bar}`. Magnifier icon start; filter chip row below on mobile. |
| **Request card** | `{components.request-card}`. Book thumbnail start, requester name, message excerpt (2 lines max), status pill end. Accept/Reject buttons inline when pending. |
| **Seller preview** | Avatar + display name + member since. No ratings in v1. |
| **Photo upload grid** | Dashed border slots; filled slots show thumbnail with remove `×`. Max 5 per PRD assumption. |
| **Language toggle** | `EN \| ع` pill in header; active language uses `{colors.primary}` fill. |
| **Empty state** | `display-sm` headline + one sentence + single primary action. Book illustration optional (line icon, not stock photo). |

## Do's and Don'ts

| Do | Don't |
|----|-------|
| Use `{colors.badge-sale}` only for For Sale listings | Use amber for exchange or condition badges |
| Show request status as a pill, not a timeline | Imply ongoing conversation with message threads |
| Keep listing detail to one primary CTA | Stack Contact + Exchange + Wishlist as equal-weight buttons |
| Mirror layout for RTL (`margin-inline`, `padding-inline`) | Hard-code `left`/`right` positioning |
| Use `{typography.display}` on page titles only | Set all headings in serif (reduces scan speed) |
| Prompt registration at contact moment | Gate browse or search behind login |
