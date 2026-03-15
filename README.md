# Career Compass (PostgreSQL, No Prisma)

Career Compass is a career discovery platform using RIASEC + MBTI, skill matching, and job market data. This build uses PostgreSQL with raw SQL and the `pg` driver (no Prisma), and uses plain JavaScript (no TypeScript).

## Structure
- `backend/` — Express API, PostgreSQL schema, Adzuna integration
- `frontend/` — Next.js + Material UI frontend
- `docs/` — architecture and deployment notes

## Quick Start
1. Backend:
   - Copy `backend/.env.example` to `.env` and fill values.
   - For local dev without Firebase, keep `AUTH_BYPASS=true`.
   - Run `npm install`, `npm run migrate`, `npm run dev`.
2. Frontend:
   - Copy `frontend/.env.local.example` to `.env.local`.
   - Run `npm install`, `npm run dev`.

## Sync Careers from Adzuna
From `backend/`:
- `npm run sync:adzuna`

This now syncs the latest Adzuna jobs into the `jobs` table for live updates on the homepage.

## Seed Skills (100+)
From `backend/`:
- `npm run seed:skills`

## Import ESCO (occupations + skills)
1. Download the ESCO dataset (CSV) and extract it locally.
2. Run:
   - `npm run import:esco -- /path/to/esco`

## Import O*NET (occupations + RIASEC)
1. Download the O*NET database (tab-delimited) and extract it locally.
2. Run:
   - `npm run import:onet -- /path/to/onet`

Notes:
- ESCO provides occupations, skills, and their relations. O*NET provides RIASEC interest scores that we convert into the top 3 Holland codes.
- O*NET requires attribution per its license.

## Run Both (dev)
From the repo root:
- `npm install`
- `npm run install:all`
- `npm run dev:all`

## Notes
- Firebase Authentication is required for protected endpoints.
- Job market data is cached with in-memory TTL by default.

## Disable Auth Bypass (Login Only)
1. Open `backend/.env` and set `AUTH_BYPASS=false`.
2. Provide real Firebase Admin credentials:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY` (multiline key with `\n` escapes)
3. Restart the backend: `npm --prefix backend run dev`.
4. On the frontend, use Firebase sign-in to obtain an ID token and send `Authorization: Bearer <token>` with API requests.

## Firestore User Sessions
The backend now writes user profile + session metadata into Firestore on each `/auth/sync` call:
- Collection: `users/{uid}`
- Subcollection: `users/{uid}/sessions/{uid-iat}`
It stores token metadata (issued/expires) but not the raw JWT.
