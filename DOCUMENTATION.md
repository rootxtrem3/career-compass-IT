# Career Compass

## Full Proposal + Technical Documentation

**Document Type:** Unified Project Proposal and Implementation Documentation  
**Project:** Career Compass  
**Version:** 2.0  
**Prepared For:** Product/Capstone Review  
**Prepared By:** Career Compass Team (6 Members)  
**Date:** February 22, 2026

---

## 1. Executive Summary

Career Compass is a full-stack web platform that improves job search quality and application readiness by combining:
- MBTI alignment
- RIASEC alignment
- Skill-based matching
- Career requirement intelligence (skills, certifications, experience)
- Job aggregation from public APIs
- User history + checklist tracking with Firebase login

The platform is delivered with a modern React frontend, a Node.js/Express backend, and PostgreSQL. It uses a weighted hybrid recommendation algorithm and provides a dedicated Paths page for actionable skill-gap closure.

---

## 2. Problem and Goals

### 2.1 Problem
People often apply to jobs with poor fit visibility. Most job boards do not clearly combine personality fit, skill fit, and requirement roadmap into one practical workflow.

### 2.2 Product Goals
- Improve recommendation relevance for job seekers.
- Translate personality + skills into ranked, explainable career matches.
- Show missing requirements (skills/certifications/experience) in a clear path format.
- Enable users to track progress over time through authenticated history and checklists.

---

## 3. Scope Delivered

### 3.1 Core Pages
- `#/home`
- `#/analysis`
- `#/paths`
- `#/about`
- `#/login`

### 3.2 Core Capabilities
- Apple-inspired minimal UI with glassmorphism/blurred cards
- Scroll-triggered reveal animations
- Dark/light theme toggle
- Responsive layout
- SEO metadata per page
- Career analysis engine (skills + MBTI + RIASEC)
- Skill-gap outputs and requirement mapping
- Jobs aggregation and normalized storage
- Firebase login (Google + email/password), logout, and user tracking

---

## 4. Architecture

### 4.1 High-Level Architecture
- **Frontend:** React + Vite (`src/`)
- **Backend:** Node.js + Express (`backend/src/`)
- **Database:** PostgreSQL (`backend/migrations`, `backend/seeds`)
- **Auth:** Firebase Auth on frontend, token-aware backend middleware

### 4.2 Backend Layering
- Routes
- Controllers
- Services
- Repositories
- Adapters (external jobs providers)
- Middleware (auth optional/required, errors)

### 4.3 Why PostgreSQL
- Strong relational integrity for career/requirements/checklist data
- JSONB support for flexible payload fields (`raw_payload`, metadata snapshots)
- Good indexing and migration ergonomics

---

## 5. Technology Stack (What’s Used and How)

| Layer | Tooling | How It Is Used |
|---|---|---|
| Frontend | React + Vite | SPA with hash routes and fast development/build pipeline |
| UI | Custom CSS + glassmorphism + Framer-like reveal pattern (`SectionReveal`) | Blurred cards, soft shadows, animated section entries |
| Charts | `StatsChart` component | Displays world career metrics from backend |
| Backend API | Express | REST API under `/api/v1/*` |
| Validation | `zod` | Request/body/env validation |
| Database | PostgreSQL (`pg`) | Relational model for users, careers, jobs, requirements, tracking |
| Auth (client) | Firebase SDK (`firebase/auth`) | Google popup login, email/password login/register, sign-out |
| Auth (server) | Optional `firebase-admin` verify + mock fallback | Parses bearer token and sets `req.user` |
| Jobs ingestion | Adapter pattern (`remotive`, `adzuna`, `custom`) | Fetch + normalize + upsert jobs |
| Ops scripts | Node scripts + bash orchestrator | Migrate, seed, sync jobs, local all-in-one run |

---

## 6. Frontend Features

### 6.1 Visual/UX
- Glass cards with blur (`GlassCard`)
- Animated section reveals (`SectionReveal`)
- Ambient gradients and soft modern aesthetic
- Dark/light mode toggle in navbar
- Responsive cards, forms, and grids

### 6.2 Navigation and Pages
- Home: product story, goals, world stats chart, live jobs with sync button
- Analysis: MBTI + RIASEC + skills selectors, weighted recommendations
- Paths: separate page for requirements and checklist progress
- Login: dedicated page for Google and email auth
- About: platform context and contact details

### 6.3 Security/Safety in UI
- External test links open with `target="_blank" rel="noopener noreferrer"`
- Login page shows clear Firebase config error when env is missing

---

## 7. Backend Features

### 7.1 REST API Modules
- `GET /api/v1/health`
- `GET /api/v1/lookups`
- `GET /api/v1/stats/world`
- `GET /api/v1/careers/paths`
- `POST /api/v1/analysis/recommendations`
- `GET /api/v1/jobs`
- `POST /api/v1/jobs/sync`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/tracking/history` (auth)
- `GET /api/v1/tracking/checklist` (auth)
- `POST /api/v1/tracking/checklist/bootstrap` (auth)
- `PATCH /api/v1/tracking/checklist/:itemId` (auth)

### 7.2 Data Workflows
- Lookups endpoint serves MBTI, RIASEC, and skills catalogs.
- Analysis endpoint calculates fit and stores analysis runs/history.
- Careers paths endpoint returns requirements and certifications per role.
- Jobs sync endpoint pulls from configured provider and upserts normalized records.

---

## 8. Recommendation Engine

### 8.1 Weighted Hybrid Formula
Current implementation in `backend/src/algorithms/careerScoring.js`:

- Skills coverage: **50%**
- RIASEC alignment: **30%**
- MBTI alignment: **20%**

`final_score = (0.5 * skills) + (0.3 * riasec) + (0.2 * mbti)`

### 8.2 Output Includes
- Fit score per career
- Score breakdown (skills/riasec/mbti)
- Matched dimensions
- Skill gaps (sorted by importance)
- Certifications
- Related opportunities (latest jobs per career)

---

## 9. Jobs and Skills Data

### 9.1 Job APIs Used
Primary/default provider:
- **Remotive** (`JOBS_PROVIDER=remotive`)

Supported configurable providers:
- **Adzuna** (`JOBS_PROVIDER=adzuna`)
- **Custom API** (`JOBS_PROVIDER=custom`)

### 9.2 Adzuna Credentials Usage
For Adzuna, backend expects:
- `ADZUNA_APP_ID`
- `ADZUNA_API_KEY`
- Optional `ADZUNA_COUNTRY`, `ADZUNA_PAGE`

Use credentials through environment variables only. Do not hardcode or commit secret keys.

### 9.3 Skills and Jobs Inventory
From seed design:
- 100+ skills inserted into `skills`
- 8 core career paths inserted into `careers`
- 120 baseline job listings seeded (`8 careers x 15 each`) with LinkedIn apply/source links

Plus dynamic jobs from external API sync.

---

## 10. Database Schema (Core)

| Table | Purpose |
|---|---|
| `users` | Legacy/mock auth user records |
| `riasec_codes` | RIASEC master values |
| `mbti_types` | MBTI master values |
| `skills` | Skills catalog |
| `certifications` | Certifications catalog |
| `careers` | Career path definitions |
| `career_riasec` | Career to RIASEC weighted mapping |
| `career_mbti` | Career to MBTI weighted mapping |
| `career_skill_requirements` | Career required skills + importance + level |
| `career_certification_requirements` | Career certification requirements |
| `job_sources` | External provider registry |
| `jobs` | Normalized job records |
| `world_stats` | Homepage metrics for charting |
| `analysis_runs` | Raw analysis run snapshot logs |
| `user_analysis_history` | Firebase user analysis timeline |
| `user_path_checklist_items` | Firebase user checklist progress |
| `schema_migrations` | Applied migration tracking |

---

## 11. Authentication

### 11.1 Frontend
- `AuthContext` wraps app
- Supports:
  - Email/password login
  - Email/password registration
  - Google popup login
  - Sign out
- Stores current user + Firebase ID token in state

### 11.2 Sign-Out
Yes, users can sign out.
- Triggered via navbar Logout button
- Calls Firebase `signOut`
- Clears user and token state

### 11.3 Backend Token Handling
- `authOptional` and `authRequired` middleware
- Uses Firebase Admin verification when configured
- Has local fallback behavior for development compatibility

---

## 12. Paths Page and Checklist Tracking

The requirements area is separated into `#/paths`, containing:
- Required skills per career (importance + level)
- Certifications per career
- Experience level and salary context
- Authenticated checklist bootstrap and completion tracking

Checklist flow:
1. User selects “Track this path”.
2. Backend creates personalized checklist rows from career requirements.
3. User toggles completed items.
4. Completion progress is calculated in UI.

---

## 13. UI Theme and Animation System

### 13.1 Theme
- Light/dark toggle in navbar
- Theme persisted in `localStorage` key: `career_compass_theme`
- Applied via root `data-theme` attributes and CSS variables

### 13.2 Motion
- Scroll reveal wrappers around all major cards/sections
- Staggered delays on card grids
- Consistent transitions to maintain premium, minimal motion behavior

---

## 14. Environment Variables

### 14.1 Frontend `.env`

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL |
| `VITE_FIREBASE_API_KEY` | Firebase web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

### 14.2 Backend `.env`

| Variable | Purpose |
|---|---|
| `PORT` | API port (default 4000) |
| `DATABASE_URL` | PostgreSQL connection string |
| `CORS_ORIGIN` | Allowed frontend origin |
| `JOBS_SYNC_LIMIT` | Max jobs per sync |
| `JOBS_PROVIDER` | `remotive` or `adzuna` or `custom` |
| `CUSTOM_JOBS_API_URL` | Custom provider endpoint |
| `CUSTOM_JOBS_API_METHOD` | `GET` or `POST` |
| `CUSTOM_JOBS_API_HEADERS_JSON` | Custom headers JSON |
| `CUSTOM_JOBS_RESULTS_PATH` | Path to jobs array in response |
| `CUSTOM_JOBS_SEARCH_PARAM` | Search param/body key |
| `CUSTOM_JOBS_LIMIT_PARAM` | Limit param/body key |
| `ADZUNA_APP_ID` | Adzuna app id |
| `ADZUNA_API_KEY` | Adzuna api key |
| `ADZUNA_COUNTRY` | Adzuna country code |
| `ADZUNA_PAGE` | Adzuna page number |
| `JWT_SECRET` | Mock token signing secret |
| `FIREBASE_PROJECT_ID` | Firebase Admin project id |
| `FIREBASE_CLIENT_EMAIL` | Firebase Admin client email |
| `FIREBASE_PRIVATE_KEY` | Firebase Admin private key |

---

## 15. Setup, Migration, Seed, Run

### 15.1 Install
```bash
npm install
npm --prefix backend install
```

### 15.2 Database Migration + Seed
```bash
npm run backend:migrate
npm run backend:seed
```

### 15.3 Optional Job Sync
```bash
npm run backend:sync-jobs
```

### 15.4 Run Services
```bash
npm run dev:backend
npm run dev:frontend
```

Or run orchestrated mode:
```bash
npm run dev:all
```

---

## 16. API Reference (Condensed)

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/v1/health` | No | Service readiness |
| GET | `/api/v1/lookups` | No | MBTI/RIASEC/skills catalogs |
| GET | `/api/v1/stats/world` | No | Homepage chart data |
| GET | `/api/v1/careers/paths` | No | Requirements by career path |
| POST | `/api/v1/analysis/recommendations` | Optional | Weighted recommendations |
| GET | `/api/v1/jobs` | No | Read normalized jobs |
| POST | `/api/v1/jobs/sync` | No | Pull from configured provider |
| GET | `/api/v1/tracking/history` | Yes | User analysis timeline |
| GET | `/api/v1/tracking/checklist` | Yes | User checklist |
| POST | `/api/v1/tracking/checklist/bootstrap` | Yes | Initialize checklist from requirements |
| PATCH | `/api/v1/tracking/checklist/:itemId` | Yes | Toggle completion |

---

## 17. Team Roles (6 Members)

| Member | Role | Responsibilities |
|---|---|---|
| Member 1 | Project Lead / Product Owner | Scope, planning, stakeholder communication, acceptance criteria |
| Member 2 | Frontend Lead Engineer | UI architecture, responsive layout, animation system, theme controls |
| Member 3 | Backend Lead Engineer | API contracts, controllers/services/repositories, validation and errors |
| Member 4 | Data & Algorithm Engineer | Schema design, migrations, seeds, scoring algorithm, skill-gap logic |
| Member 5 | Auth & DevOps Engineer | Firebase integration, token flow, CI/CD and deployment setup |
| Member 6 | QA & Documentation Engineer | Test planning, API verification, release validation, documentation |

---

## 18. 12-Week Timeline Schedule

| Week | Milestone | Primary Owner(s) | Deliverables |
|---|---|---|---|
| 1 | Discovery and planning | Member 1 + All | Scope freeze, architecture draft, backlog |
| 2 | Design system + backend scaffolding | Members 2, 3, 4 | UI direction, API skeleton, initial schema |
| 3 | Core pages baseline | Members 2, 3 | Home/About/Login base + core endpoints |
| 4 | Analysis engine v1 | Members 3, 4 | Weighted scoring flow + analysis API |
| 5 | Jobs aggregation integration | Members 3, 4 | Provider adapter + normalized jobs persistence |
| 6 | Paths page requirements view | Members 2, 4 | Separate paths page + requirements rendering |
| 7 | Firebase auth integration | Members 2, 5 | Google login page, auth context, sign-out |
| 8 | Tracking persistence | Members 3, 5 | History/checklist APIs + frontend integration |
| 9 | Data expansion | Member 4 | Expanded skills catalog + 50+ jobs baseline |
| 10 | Stabilization and QA cycle 1 | Members 6, 3 | API tests, bug fixes, error hardening |
| 11 | UAT and release prep | Members 1, 6, All | Documentation finalization + release candidate |
| 12 | Deployment and handover | Members 5, 1 | Production deployment, monitoring checklist |

---

## 19. Quality, Security, and Reliability

### 19.1 Quality
- Input validation via `zod`
- Structured backend layers for maintainability
- Migration + seed repeatability for environment consistency

### 19.2 Security
- Environment-driven secrets
- CORS control
- Optional token verification via Firebase Admin
- Safe external links in frontend

### 19.3 Reliability
- Jobs provider fallback behavior
- Seeded baseline inventory to avoid empty states
- `/health` endpoint for readiness checks

---

## 20. Deployment Readiness Notes

Recommended production setup:
- Frontend: static host/CDN
- Backend: containerized Node service
- Database: managed PostgreSQL
- Secrets: deployment platform secret manager
- Monitoring: API uptime checks + error logging

---

## 21. Known Constraints and Next Iterations

### 21.1 Current Constraints
- Mock auth endpoints still exist for compatibility; Firebase is the primary live login experience.
- External jobs provider quota and API availability can vary.

### 21.2 Planned Enhancements
- Full backend Firebase token verification enforcement on all protected routes
- More career paths and richer requirement ontologies
- Admin dashboard for curation of weights and requirements
- Recommendation explainability UI improvements

---

## 22. Repository Pointers

- Frontend app: `src/`
- Backend app: `backend/src/`
- Migrations: `backend/migrations/`
- Seeds: `backend/seeds/`
- Dev orchestration: `scripts/dev-all.sh`
- Proposal docx generator: `scripts/generate_proposal_docx.py`

---

## 23. Final Statement

This document serves as the single markdown source for the full Career Compass proposal, technical implementation details, operational setup, team allocation, and delivery timeline.

