# PostgreSQL Schema

The schema lives in `backend/src/db/migrations/001_init.sql`. Core entities:

- `users`: Firebase-linked user profiles.
- `skills`: Global skill catalog.
- `user_skills`: Skill proficiency per user.
- `careers`: Career profiles + metadata.
- `career_skills`: Required skill weights per career.
- `career_mbti`: MBTI compatibility weights.
- `assessments`: MBTI/RIASEC assessment history.
- `saved_careers`: User favorites.
- `career_progress`: Readiness tracking.
- `career_milestones` / `user_milestones`: Checklist items.
- `recommendations` / `recommendation_items`: Stored recommendation runs.
