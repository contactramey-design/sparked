# Main navigation (Academy + Shop)

## Structure

The app shell header exposes **two primary labels** for wayfinding:

1. **Academy** — learning paths, age-band selection, homework, weekly adventure, school programs, grown-up sign-in / parent dashboard.
2. **Shop** — ebooks & bundles, subscription (parent view), placeholder links for merch and sensory kits (`/coming-soon`).

School-themed routes (`/for-schools`, `/schools`, `/compliance`, `/teacher/*`) use the same two labels with **school-specific** dropdown links (hub, compliance, teacher tools, shop/contact).

Implementation: `src/components/MainNav.tsx`, wired from `src/App.tsx` → `AppHeader`.

## Why disclosure dropdowns (not tabs)?

- **Tabs** imply parallel views of one screen; here we need **hierarchical menus** of many destinations without crowding the header.
- **Dropdowns** (ARIA disclosure pattern: button + `aria-expanded` + panel) match mental models for “choose a category, then a destination” and work well on **iPad** with large targets.
- Tabs across the full width would compete with the logo/title and don’t scale when labels are localized (EN/ES).

## Accessibility & performance

- **Keyboard**: `Escape` closes open panels; focus remains on the trigger until the user moves it.
- **Pointer**: Outside click closes panels (mousedown on `document`, scoped with a container ref).
- **Route change**: Panels close on `pathname` / `search` change so navigating doesn’t leave a stale overlay.
- **Touch**: Triggers, links, and age-band buttons use **≥ 48px** minimum height (`App.css` under `.nav-dropdown-*`).
- **Performance**: No extra network requests; dropdowns are pure CSS + conditional render (`hidden` when closed).

## Localization

Strings live under `nav.*` in `src/locales/en.json` and `src/locales/es.json`.
