# TODOs

## From Design Review (2026-03-26)

### DESIGN.md Creation
- **What:** Create a DESIGN.md documenting the Sailor design system (tokens, components, patterns)
- **Why:** No centralized design reference exists; implementers guess at spacing, colors, patterns
- **Depends on:** Theme token alignment (Phase 3 of current plan)

### Keyboard Navigation for Bottom Sheets
- **What:** Add keyboard nav (Escape to dismiss, Tab to cycle options) to Framer Motion bottom sheets in review flow
- **Why:** Accessibility requirement; bottom sheets are currently mouse/touch only
- **Depends on:** Review flow refactor (Phase 1)

### Loading Skeleton States
- **What:** Add skeleton loading states for dashboard sections, transaction lists, and insights charts
- **Why:** Prevents layout shift when data loads; feels more polished
- **Depends on:** Component extraction (Phase 1)

## From Eng Review (2026-03-26)

### Read Next.js Docs Before Layout Changes
- **What:** Read `node_modules/next/dist/docs/` before implementing layout shell in Phase 2
- **Why:** AGENTS.md warns this Next.js version has breaking changes; layout/routing APIs may differ from standard docs
- **Pros:** 5-minute task that prevents hours of debugging
- **Cons:** None
- **Blocked by:** Nothing — do this first in Phase 2

### Playwright E2E Tests
- **What:** Add Playwright E2E tests for 10 critical user flows: CSV import → dashboard, weekly review swipe flow, transaction detail sheet, empty states, error states, data persistence across refresh, business + personal review completion, navigation between screens, undo in review flow, CSV validation errors
- **Why:** Unit tests (Vitest) cover store logic but can't verify real user interactions; the swipe flow, sheet animations, and CSV upload need browser-level testing
- **Pros:** Catches integration bugs that unit tests miss; prevents regressions in the core habit loop
- **Cons:** Playwright setup adds CI time; flaky test risk with animations
- **Depends on:** Vitest unit tests (this PR), refactor complete

### Server-Side Storage for MVP
- **What:** Replace localStorage persistence with server-side storage (Supabase, PlanetScale, or similar) before Plaid launch
- **Why:** localStorage means data is device-locked; multi-device users lose everything. Real users can't depend on browser storage for financial data
- **Pros:** Data survives device changes, enables multi-device, required for Plaid integration anyway
- **Cons:** Adds infrastructure complexity, auth requirement, hosting cost
- **Depends on:** Plaid integration decision, auth strategy

### CSV Partial-Import Strategy
- **What:** Define what happens when a CSV has some valid and some invalid rows — load the valid ones? Reject the whole file? What does the user see?
- **Why:** Real data from Gina's clients WILL have messy rows (missing fields, wrong formats). Current behavior: parser returns errors array but loads all parseable rows silently
- **Pros:** Better UX for the CSV test with founders; fewer support questions
- **Cons:** Adds UI complexity to upload flow
- **Depends on:** Getting real CSV data from Gina to understand actual error patterns
