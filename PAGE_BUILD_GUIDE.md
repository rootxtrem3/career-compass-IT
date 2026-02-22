# Career Compass Page Build Guide

This document explains each frontend page in detail: what it does, how it is built, what APIs it calls, and how shared UI/auth/routing systems are wired.

---

## 1. Global Page Framework

### 1.1 App shell and route rendering
- File: `src/App.jsx`
- The app uses hash-based routing and conditionally renders one page at a time:
  - `#/home` -> `HomePage`
  - `#/analysis` -> `AnalysisPage`
  - `#/paths` -> `PathsPage`
  - `#/about` -> `AboutPage`
  - `#/login` -> `LoginPage`
- `NavBar` and footer are always visible.
- Ambient background layers (`ambient-a`, `ambient-b`) create the soft Apple-style visual atmosphere.

### 1.2 Routing mechanism
- File: `src/hooks/useHashRoute.js`
- Route parsing is done from `window.location.hash`.
- Unknown or empty routes fall back to `home`.
- Valid routes are constrained by `VALID_ROUTES` set for predictable page navigation.

### 1.3 SEO per page
- File: `src/hooks/useSeo.js`
- Each page sets its own `<title>` and meta description when mounted.

### 1.4 Authentication context (cross-page)
- Files: `src/context/AuthContext.jsx`, `src/services/firebaseClient.js`, `src/main.jsx`
- App is wrapped by `AuthProvider` in `main.jsx`.
- Auth provider exposes `user`, `token`, `isAuthenticated`, `login`, `register`, `loginWithGoogle`, `logout`.
- Firebase is initialized only if all `VITE_FIREBASE_*` values exist.

### 1.5 Shared visual building blocks
- `GlassCard` (`src/components/ui/GlassCard.jsx`): reusable blur card shell.
- `SectionReveal` (`src/components/ui/SectionReveal.jsx`): intersection-observer reveal animation wrapper.
- Global visual system in `src/styles.css`:
  - Glassmorphism
  - theme tokens (light/dark)
  - responsive grid/layout classes
  - reduced-motion support

---

## 2. Home Page (`#/home`)

### 2.1 Purpose
- Introduces Career Compass goals.
- Shows world career statistics chart.
- Shows and refreshes aggregated jobs list.

### 2.2 Source file
- `src/pages/HomePage.jsx`

### 2.3 Build structure
- Hero section in a `GlassCard`:
  - Product headline
  - mission summary
  - CTAs to analysis and about pages
- Goals section:
  - Maps `goals` array into 3 cards (`card-grid triple`).
- Statistics section:
  - Uses `StatsChart` component.
- Job listings section:
  - “Sync Jobs API” button and listing cards.
- Process section:
  - Ordered roadmap steps (`flow-list`).

### 2.4 State and data flow
- Local state:
  - `stats`, `jobs`, `isSyncing`, `error`
- Initial load:
  - `Promise.allSettled([getWorldStats(), getJobs(limit=6)])`
- Fallback:
  - starts with `fallbackStats` until API returns.
- Sync action:
  - calls `syncJobs(limit=40)` then refreshes displayed jobs.

### 2.5 API usage
- `GET /api/v1/stats/world`
- `GET /api/v1/jobs?limit=6`
- `POST /api/v1/jobs/sync`

### 2.6 Styling/animation notes
- Every major section wrapped by `SectionReveal`.
- Jobs row uses `glass-soft` for layered blur style.
- Buttons use `btn-solid` and `btn-soft` tokens.

---

## 3. Analysis Page (`#/analysis`)

### 3.1 Purpose
- Collects MBTI, RIASEC, and skills input.
- Runs weighted hybrid recommendation.
- Shows ranked careers, opportunities, and saved analysis history.

### 3.2 Source file
- `src/pages/AnalysisPage.jsx`

### 3.3 Build structure
- Intro card:
  - Explains scoring weights.
  - Includes external links for MBTI/RIASEC tests.
- Three selector panels:
  - RIASEC chips (max 3)
  - MBTI chips
  - skill filter + skill chips
- Recommendations panel:
  - Generate button
  - fit cards with score bar, breakdown, salary, opportunities, and path link.
- User history panel:
  - shown dynamically based on auth/token state.

### 3.4 State and logic
- Input state:
  - `selectedRiasec`, `selectedMbti`, `selectedSkills`, `searchSkill`
- Data state:
  - `lookups`, `results`, `history`
- UX state:
  - `error`, `loading`, `historyLoading`, `historyError`
- Key helpers:
  - `toggleRiasec` enforces max 3.
  - `toggleSkill` toggles selection.
  - `visibleSkills` uses `useMemo` filter by search query.
- Validation before run:
  - requires at least one RIASEC, one MBTI, one skill.

### 3.5 API usage
- `GET /api/v1/lookups`
- `POST /api/v1/analysis/recommendations`
- `GET /api/v1/tracking/history?limit=10` (requires bearer token)

### 3.6 Auth dependency
- Reads `token` via `useAuth()`.
- If token is present, history is fetched and rendered.
- If not authenticated, page still works for recommendations but history section shows sign-in prompt.

### 3.7 External links behavior
- MBTI and RIASEC test links are read from `src/constants/externalLinks.js`.
- Open in new tab with `rel="noopener noreferrer"`.

---

## 4. Paths Page (`#/paths`)

### 4.1 Purpose
- Dedicated page for “skills and requirements for a job”.
- Converts recommendations into an actionable roadmap.
- Supports persistent checklist tracking for authenticated users.

### 4.2 Source file
- `src/pages/PathsPage.jsx`

### 4.3 Build structure
- Header card:
  - page intro
  - search box for career path filtering
  - result count status
- Path cards grid (`paths-grid`):
  - title, experience level, description, salary
  - required skills list
  - certifications list
  - “Track this path” CTA
- Checklist area (conditional per active selected career):
  - completion percentage
  - checkbox list for requirement items

### 4.4 State and logic
- Search/list state:
  - `search`, `paths`, `loading`, `error`
- Checklist state:
  - `activeCareerId`, `checklistItems`, `checklistLoading`, `checklistError`
- Computed state:
  - `resultsCountLabel`
  - `checklistProgress` (`completed / total`)
- Flow:
  - path query changes -> `getCareerPaths(q)`
  - track button -> `bootstrapChecklist` then `getChecklist`
  - checkbox toggle -> `updateChecklistItem`

### 4.5 API usage
- `GET /api/v1/careers/paths?q=...`
- `POST /api/v1/tracking/checklist/bootstrap` (auth required)
- `GET /api/v1/tracking/checklist?careerId=...` (auth required)
- `PATCH /api/v1/tracking/checklist/:itemId` (auth required)

### 4.6 Auth dependency
- Reads `token` and `isAuthenticated` from `useAuth()`.
- If unauthenticated:
  - page still shows requirements
  - checklist tracking prompts user to sign in.

---

## 5. Login Page (`#/login`)

### 5.1 Purpose
- Entry point for account-based tracking.
- Supports Google auth and email/password auth in one screen.

### 5.2 Source file
- `src/pages/LoginPage.jsx`

### 5.3 Build structure
- Intro card with value statement.
- Configuration status warning if Firebase is not set.
- Two mode tabs:
  - Login
  - Register
- Google sign-in button.
- Email/password form:
  - register mode includes full name.
- Signed-in state:
  - shows current user email + quick link to analysis.

### 5.4 State and logic
- `mode`, `submitting`, `error`, `form`.
- On submit:
  - `mode === login` -> `login`
  - else -> `register`
  - success navigates to `#/analysis`.
- Google flow:
  - `loginWithGoogle` then route to analysis.

### 5.5 Auth functions used
- from `useAuth()`:
  - `login`
  - `register`
  - `loginWithGoogle`
  - `isFirebaseEnabled`
  - `loading`

---

## 6. About Page (`#/about`)

### 6.1 Purpose
- Presents mission, product principles, and contact details.

### 6.2 Source file
- `src/pages/AboutPage.jsx`

### 6.3 Build structure
- Intro card with product positioning.
- Two-column responsive section:
  - Product principles list
  - Contact info list (email, phone, location, support hours)

### 6.4 Data shape
- Contact entries are defined as local structured array and mapped to list items.
- Email address is externalized from `EXTERNAL_LINKS.contactEmail`.

---

## 7. Navigation and Theme Integration

### 7.1 Navbar behavior
- File: `src/components/layout/NavBar.jsx`
- Contains links to all pages.
- Includes:
  - theme toggle
  - auth state display (user email + logout button)
  - fallback sign-in CTA when logged out

### 7.2 Theme implementation
- File: `src/App.jsx` + `src/styles.css`
- Theme key: `career_compass_theme` in localStorage.
- App applies `document.documentElement.dataset.theme = light|dark`.
- CSS variable sets define both palettes and are reused by all pages.

---

## 8. Shared API Client Contract (Used by Pages)

### 8.1 File
- `src/services/apiClient.js`

### 8.2 Pattern
- Single `request()` wrapper:
  - sets `Content-Type`
  - attaches `Authorization` header when token provided
  - parses JSON and throws normalized error message on failure

### 8.3 Why this matters for page construction
- Keeps page components focused on UI/state.
- Avoids duplicating fetch boilerplate.
- Makes all pages consistent in error handling and token handling.

---

## 9. Styling and Motion Construction Details

### 9.1 Main style system
- File: `src/styles.css`
- Built around reusable utility classes used by every page:
  - `glass-card`, `glass-soft`
  - `content-card`
  - grid classes (`card-grid`, `analysis-grid`, `paths-grid`)
  - semantic classes (`muted`, `error-text`, `choice-chip`, etc.)

### 9.2 Animation system
- `SectionReveal` adds `reveal` and `is-visible` classes.
- CSS transitions handle opacity + translate + scale.
- Supports progressive delays via CSS variable `--delay`.
- `prefers-reduced-motion` disables animations for accessibility.

### 9.3 Responsive behavior
- Breakpoints at `58rem` and `40rem`.
- Header, grids, chips, buttons, and row layouts reflow to single-column patterns on small screens.

---

## 10. Page-to-Backend Mapping (Quick Matrix)

| Page | Primary APIs | Requires Auth Token? |
|---|---|---|
| Home | `GET /stats/world`, `GET /jobs`, `POST /jobs/sync` | No |
| Analysis | `GET /lookups`, `POST /analysis/recommendations`, `GET /tracking/history` | History only |
| Paths | `GET /careers/paths`, checklist endpoints | Checklist only |
| Login | Firebase client auth functions | N/A (client auth flow) |
| About | No API calls | No |

---

## 11. Build Philosophy by Page

- **Home** is built as awareness + entry to action.
- **Analysis** is built as the decision engine interface.
- **Paths** is built as execution and progress-tracking workspace.
- **Login** is built as an enablement gate for persistence.
- **About** is built for product trust and contact clarity.

This separation keeps each page focused, composable, and easier to evolve independently.

