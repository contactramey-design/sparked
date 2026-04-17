# UI shell and navigation

## Path-based chrome

`isSchoolShellPath` in [`src/lib/schoolShell.ts`](../src/lib/schoolShell.ts) drives:

- `data-school-theme` and orange styling in [`App.tsx`](../src/App.tsx)
- School vs consumer `MainNav` variant in [`AppShellHeader.tsx`](../src/design-system/components/AppShellHeader.tsx)
- `useSchoolShopHidden` also treats `schoolMode` (localStorage) as commerce-off

**School shell routes:** `/for-schools`, `/compliance`, `/teacher`, and **`/schools/*`** (pilot class, weekly track, generated units, alignment, etc.). Consumer family flows (`/`, `/tracks`, `/practice`, …) use a warm **Ascent-aligned** canvas via `app-main--ascent` in [`App.tsx`](../src/App.tsx) and [`App.css`](../src/App.css) (teal-accent cards, Fredoka headings). School shell routes are unchanged (orange, no `app-main--ascent`).

## Educators / B2B entry

The **Educators** link was removed from the header to reduce crowding. Schools and pilots are grouped in the **footer** (`AppShellFooter`) with For schools, Compliance, Teacher sign-in, and (when shop is hidden) Class join.

## Mobile header

Below **768px** width, primary nav moves into a **menu button** that opens an overlay with the same `MainNav` and language switcher (single instance in the DOM for the active layout).
