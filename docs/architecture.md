# Career Compass Architecture

## Overview
Career Compass is a full-stack platform that combines RIASEC + MBTI assessments, skills data, and job market insights to recommend career paths. The backend is a Node.js/Express API with PostgreSQL, while the frontend is a Next.js + Material UI (Material Design 3) web app.

## Key Services
- **Assessment Engine**: Stores MBTI + RIASEC results and updates the user profile.
- **Recommendation Engine**: Computes weighted scores (RIASEC 40%, MBTI 25%, Skills 35%).
- **Job Market Insights**: Pulls salary + demand data from Adzuna with caching.
- **Career Progress Tracker**: Tracks milestones, readiness, and saved careers.
- **Auth**: Firebase Authentication on the frontend, token verification on the backend.

## Folder Structure
```
career-compass-postgresql-no-prisma/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── db/
│   │   │   ├── migrations/001_init.sql
│   │   │   ├── pool.js
│   │   │   └── seed.js
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── styles/
│   └── utils/
└── docs/
```

## Database Schema (PostgreSQL)
Core tables:
- `users` (Firebase UID + profile data)
- `skills`, `user_skills`
- `careers`, `career_skills`
- `career_mbti`
- `assessments`
- `saved_careers`
- `career_progress`
- `career_milestones`, `user_milestones`
- `recommendations`, `recommendation_items`

## API Endpoints
- `POST /auth/sync` — create/update user from Firebase UID
- `POST /assessments` — store MBTI/RIASEC results
- `GET /skills` — list skills
- `POST /skills/user` — store user skills
- `GET /careers` — list careers
- `GET /careers/:id` — career details
- `GET /careers/:id/market` — job market stats
- `POST /careers/recommendations` — top career matches
- `POST /careers/save` — save a career
- `GET /careers/saved/list` — saved careers
- `POST /progress/goal` — set career goal
- `POST /progress/milestone` — update milestone completion
- `GET /progress` — fetch goal + milestones

## Recommendation Logic
Compatibility score is calculated using:
- RIASEC alignment = 40%
- MBTI compatibility = 25%
- Skill match = 35%

Scores are normalized to a 0–100 scale and ranked. Each response returns a breakdown for transparency.
