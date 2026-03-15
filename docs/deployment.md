# Deployment Guide

## Backend
1. Create a PostgreSQL database and set `DATABASE_URL`.
2. Add Firebase Admin credentials to `.env`.
3. Install dependencies and run migrations:
   - `npm install`
   - `npm run migrate`
   - `npm run seed` (optional)
4. Start the API:
   - `npm run dev` (local)
   - `npm run build && npm run start` (production)

## Frontend
1. Create `.env.local` with Firebase public config and API base URL.
2. Install dependencies:
   - `npm install`
3. Run the app:
   - `npm run dev`

## Notes
- `Adzuna` credentials are required for job market insights.
- Caching uses in-memory TTL; swap to Redis for multi-instance deployment.
- Use HTTPS for Firebase auth in production.
