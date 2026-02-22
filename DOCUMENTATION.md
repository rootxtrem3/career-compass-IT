# Career Compass

## Project Documentation (Descriptive Version)

This document provides a **full project description** of Career Compass from product, architecture, and delivery perspectives.  
It is intentionally written as a high-level specification and implementation guide, not as exhaustive low-level content.

---

## 1. Project Summary

Career Compass is a full-stack career guidance platform that helps users discover suitable career paths and improve job readiness by combining:
- Personality alignment (MBTI + RIASEC)
- Skill-based matching
- Career requirement mapping (skills, certifications, experience)
- Job opportunities from public APIs
- User progress tracking through login and checklist history

The platform is designed to turn career exploration into actionable, trackable pathways.

---

## 2. Objectives

- Improve quality of job targeting and reduce random applications.
- Give users explainable career recommendations based on personal profile.
- Show what is missing for each role and how to close those gaps.
- Provide persistent tracking with authentication so users can continue their path over time.

---

## 3. Scope of the Platform

### User-facing scope
- Modern multi-page web app with clean visual style and responsive design.
- Dedicated pages for Home, Analysis, Paths, About, and Login.
- Theme toggle (dark/light) and animated UI sections.

### System scope
- REST API backend with modular structure.
- PostgreSQL relational data model for careers, requirements, jobs, and user tracking.
- Jobs ingestion layer that supports multiple providers.

---

## 4. Product Experience Description

### Home Page
- Introduces Career Compass and its mission.
- Presents current world career statistics through chart cards.
- Shows aggregated jobs and allows refresh/sync from configured provider.

### Analysis Page
- Users select MBTI, RIASEC categories, and their skills.
- Recommendation engine returns ranked career matches.
- Results include fit explanation and opportunity links.
- External MBTI/RIASEC tests are linked safely in new tabs.

### Paths Page
- Separated requirements area for each career path.
- Displays required skills, certification suggestions, and expected experience level.
- Authenticated users can create and maintain checklist progress for selected paths.

### Login Page
- Google sign-in (Firebase).
- Email/password login and register support.
- Sign-out available from navigation.

### About Page
- Product context and essential contact information.

---

## 5. Technical Stack and Rationale

| Layer | Technology | Why It Is Used |
|---|---|---|
| Frontend | React + Vite | Fast dev workflow, modular component architecture |
| Backend | Node.js + Express | Simple and scalable REST service structure |
| Database | PostgreSQL | Strong relational modeling + JSON support where needed |
| Auth | Firebase Authentication | Reliable Google login and user identity handling |
| Validation | Zod | Input and environment safety checks |
| Jobs Integration | Provider adapters | Flexible source switching (Remotive, Adzuna, Custom API) |

---

## 6. Recommendation Logic (Conceptual)

Career recommendations use a weighted hybrid model:
- Skills match: 50%
- RIASEC alignment: 30%
- MBTI alignment: 20%

The engine produces ranked roles and highlights missing requirements so users can prioritize learning and certification actions.

---

## 7. Data and Domain Model (Overview)

The system stores:
- Master references (MBTI, RIASEC, skills, certifications)
- Career definitions and requirement mappings
- Normalized jobs from external providers
- World statistics for homepage metrics
- User analysis history and checklist progress

The schema is migration-driven and seed-driven for repeatable setup.

---

## 8. Jobs and Skills Sources

### Jobs
- Default provider: Remotive
- Optional provider: Adzuna (via `ADZUNA_APP_ID` + `ADZUNA_API_KEY`)
- Optional provider: custom API endpoint (configurable mapping)

Jobs are normalized into a unified internal format before being served to frontend features.

### Skills
- Skills are maintained in internal database seed and lookup tables.
- They are consumed by analysis and path requirement views.

---

## 9. Authentication and User Tracking Description

- Firebase handles sign-in identity on frontend.
- User token is attached to protected API requests.
- Backend supports token-aware middleware for profile-linked tracking.

Tracked user data includes:
- Analysis history snapshots
- Checklist completion state per chosen career path

---

## 10. UI/UX Direction

- Minimal premium style with glassmorphism cards and blur effects.
- Scroll-based section reveal animations.
- Responsive behavior across desktop and mobile.
- Theme system with user-selectable dark/light mode.

---

## 11. API Design (High-Level)

API modules are organized by domain:
- Health/status
- Lookups (skills/MBTI/RIASEC)
- Stats
- Analysis/recommendations
- Careers/paths
- Jobs/sync
- Auth
- Tracking/history/checklist

This structure separates read-heavy public data endpoints from protected user-specific actions.

---

## 12. Deployment and Operations (Summary)

- Frontend can be deployed as static assets/CDN.
- Backend can run as containerized Express service.
- PostgreSQL should be hosted as managed database in production.
- Environment variables should handle all API keys and secrets.

---

## 13. Team Roles (6 Members)

| Member | Role | Responsibility Summary |
|---|---|---|
| Member 1 | Project Lead | Planning, scope control, stakeholder alignment |
| Member 2 | Frontend Lead | UI architecture, responsiveness, animations, themes |
| Member 3 | Backend Lead | API architecture, services, controllers, reliability |
| Member 4 | Data/Algorithm Engineer | Schema, migrations, seeding, recommendation logic |
| Member 5 | Auth/DevOps Engineer | Firebase integration, environment setup, deployment pipeline |
| Member 6 | QA/Documentation Engineer | Test planning, validation, release docs and final reports |

---

## 14. 12-Week Timeline

| Week | Focus | Key Output |
|---|---|---|
| 1 | Discovery and requirements | Finalized scope and architecture plan |
| 2 | Foundation setup | Frontend/base backend scaffolding and initial schema |
| 3 | Core pages | Home/About/Login and base API modules |
| 4 | Recommendation engine v1 | Analysis flow with weighted matching |
| 5 | Jobs integration | External provider sync and normalization |
| 6 | Paths module | Requirements page and role requirement rendering |
| 7 | Firebase auth | Google login + user state handling |
| 8 | Tracking features | History and checklist persistence |
| 9 | Data expansion | Broader skills and job records |
| 10 | QA pass 1 | Functional and integration stability fixes |
| 11 | UAT and hardening | Documentation finalization and release candidate |
| 12 | Deployment and handover | Production rollout and post-launch checklist |

---

## 15. Deliverables

- Full-stack source code (frontend + backend)
- Database migrations and seed scripts
- Authentication-ready architecture with Firebase login
- Career recommendation and path-tracking modules
- Unified documentation and setup guidance

---

## 16. Conclusion

Career Compass is designed as a practical decision-support platform: it does not only recommend careers, it also explains suitability and guides users through actionable requirement paths.  
The current implementation establishes a production-ready foundation that can be extended with richer provider integrations, deeper analytics, and advanced recommendation tuning.

