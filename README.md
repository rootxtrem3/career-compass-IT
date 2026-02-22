# Career Compass

Career Compass is a full-stack platform for improving job searching and applications using:
- RIASEC interests
- MBTI personality alignment
- Skill-based weighted matching
- Skill-gap and certification insights
- Aggregated jobs from a free public jobs API (Remotive), normalized into PostgreSQL

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- API Style: REST (`/api/v1/*`)
- Animations/UI: Scroll-triggered reveals, glassmorphism cards, responsive layout, SEO-ready meta structure

## Project Structure

```text
.
├── backend/
│   ├── migrations/
│   ├── seeds/
│   ├── scripts/
│   └── src/
│       ├── adapters/
│       ├── algorithms/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── repositories/
│       ├── routes/
│       └── services/
├── src/
│   ├── components/
│   ├── constants/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   └── services/
└── README.md
```

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

## Environment Variables

### Frontend (`.env`)

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Available variables:
- `VITE_API_BASE_URL` (default: `http://localhost:4000/api/v1`)

### Backend (`backend/.env`)

Copy backend template:

```bash
cp backend/.env.example backend/.env
```

Required values:
- `PORT` (default: `4000`)
- `DATABASE_URL` (PostgreSQL connection string)
- `CORS_ORIGIN` (frontend URL, default `http://localhost:5173`)
- `JOBS_SYNC_LIMIT` (default: `40`)
- `JWT_SECRET` (at least 12 chars)

## Installation

Install root/frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
npm --prefix backend install
```

## Database Setup

If you do not have PostgreSQL installed locally, you can run an embedded instance:

```bash
npm --prefix backend run db:embedded
```

Then use `postgres://postgres:postgres@127.0.0.1:55432/career_compass` as `DATABASE_URL`.

1. Create database (example name):

```sql
CREATE DATABASE career_compass;
```

2. Run migrations:

```bash
npm run backend:migrate
```

3. Seed data:

```bash
npm run backend:seed
```

4. Optional: sync jobs from Remotive API:

```bash
npm run backend:sync-jobs
```

## Running Locally

Start backend:

```bash
npm run dev:backend
```

Start frontend (new terminal):

```bash
npm run dev:frontend
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:4000`

## Core Features Delivered

- Multipage React UI (Home, Analysis, Paths, About)
- Modern minimal apple-style glassmorphism with blur cards
- Scroll reveal animations across sections
- Dynamic world career statistics from backend with chart visualization
- Analysis engine with weighted hybrid scoring:
  - Skills match: 50%
  - RIASEC alignment: 30%
  - MBTI alignment: 20%
- Dedicated `Paths` page for career requirements (skills, certifications, experience level)
- Safe external links for MBTI and RIASEC tests (`target="_blank" rel="noopener noreferrer"`)
- Public jobs API integration (Remotive) and normalized persistence in PostgreSQL
- Authentication-ready API and frontend context (register/login/me with mock JWT signing)

## Main API Endpoints

- `GET /api/v1/health`
- `GET /api/v1/lookups`
- `GET /api/v1/careers/paths`
- `GET /api/v1/stats/world`
- `POST /api/v1/analysis/recommendations`
- `GET /api/v1/jobs`
- `POST /api/v1/jobs/sync`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

## Notes

- Job sync includes a fallback dataset if the remote API is temporarily unavailable.
- Authentication uses lightweight mock JWT signing for now; structure is ready for real JWT/Auth provider integration.
- Migrations and seeds are idempotent for repeated setup during development.
