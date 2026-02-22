#!/usr/bin/env python3
"""
Generate a detailed DOCX proposal for Career Compass without external dependencies.
"""

from __future__ import annotations

from datetime import date
from pathlib import Path
from xml.sax.saxutils import escape
import zipfile


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "Career_Compass_Full_Proposal.docx"


def run_props(bold: bool = False, size_half_points: int | None = None) -> str:
    parts: list[str] = ["<w:rPr>"]
    if bold:
        parts.append("<w:b/>")
    if size_half_points is not None:
        parts.append(f'<w:sz w:val="{size_half_points}"/>')
        parts.append(f'<w:szCs w:val="{size_half_points}"/>')
    parts.append("</w:rPr>")
    return "".join(parts)


def para(text: str, bold: bool = False, size_half_points: int | None = None) -> str:
    safe = escape(text)
    return (
        "<w:p>"
        "<w:r>"
        f"{run_props(bold=bold, size_half_points=size_half_points)}"
        f"<w:t xml:space=\"preserve\">{safe}</w:t>"
        "</w:r>"
        "</w:p>"
    )


def blank_line() -> str:
    return "<w:p><w:r><w:t xml:space=\"preserve\"> </w:t></w:r></w:p>"


def page_break() -> str:
    return "<w:p><w:r><w:br w:type=\"page\"/></w:r></w:p>"


today = date.today().strftime("%B %d, %Y")

pages: list[dict[str, object]] = [
    {
        "title": "Career Compass",
        "subtitle": "Full Project Proposal and Delivery Plan",
        "lines": [
            "Prepared for: Capstone / Product Review Committee",
            "Prepared by: Team Career Compass (6 Members)",
            f"Date: {today}",
            "Version: 1.0",
            "",
            "Tagline: Personality-driven, skills-aware, evidence-backed career navigation.",
        ],
    },
    {
        "title": "Page 2 - Executive Summary",
        "lines": [
            "Career Compass is a full-stack platform that helps users discover suitable job paths using a weighted hybrid recommendation model.",
            "The platform combines RIASEC interests, MBTI preferences, and skill inventory to rank career opportunities and reveal skill gaps.",
            "This proposal defines architecture, implementation strategy, staffing, timeline, risks, and operational model for a production-ready release.",
            "Primary value proposition:",
            "- Reduce trial-and-error in job search by delivering personalized, explainable recommendations.",
            "- Improve employability by mapping missing skills, certifications, and experience targets.",
            "- Track personal progress through authenticated user records, checklists, and recommendation history.",
            "Business outcomes expected within first release cycle:",
            "- Higher recommendation relevance compared with keyword-only approaches.",
            "- Better conversion from career exploration to concrete application action.",
            "- Reusable data and analytics foundation for future AI-enhanced guidance features.",
        ],
    },
    {
        "title": "Page 3 - Problem Statement and Context",
        "lines": [
            "Many job seekers face information overload and poor alignment between their profile and available job listings.",
            "Current mainstream portals optimize search volume but do not deeply align opportunities with psychometric profile and evolving capability.",
            "Career Compass addresses three core gaps:",
            "1. Discovery gap: Users struggle to identify roles matching personality and strengths.",
            "2. Planning gap: Users cannot clearly see what they are missing for target roles.",
            "3. Tracking gap: Users need a practical, persistent way to monitor readiness progress.",
            "Current global context incorporated in product narrative and charts:",
            "- Demand shifts toward digital, AI-assisted, and data-informed roles.",
            "- Employers increasingly value demonstrable skills and certifications over generic profiles.",
            "- Hybrid and remote opportunities expand candidate competition and require tighter matching quality.",
            "The platform therefore blends structured relational data with practical recommendation logic and transparent scoring explanations.",
        ],
    },
    {
        "title": "Page 4 - Project Goals, Scope, and Deliverables",
        "lines": [
            "Primary Goal:",
            "Deliver a modern, responsive, and production-ready web platform named Career Compass.",
            "Functional Scope:",
            "- Homepage with mission, goals, and career-stat visuals (chart-backed from backend seed or API-backed data).",
            "- Analysis page for MBTI, RIASEC, and skill selection with recommendation output.",
            "- New dedicated Paths page for job requirements, required skills, certifications, and readiness checklist.",
            "- About page with contact and organization information.",
            "- Authentication-ready and Firebase Google login support for user-specific data persistence.",
            "Data Scope:",
            "- Normalized jobs schema from one or more public APIs.",
            "- Requirement tables for role-to-skill/certification/experience mapping.",
            "- User records for recommendation history and checklist completion state.",
            "Delivery Artifacts:",
            "- Frontend app, backend API, migration scripts, seed scripts, setup docs, and technical documentation.",
        ],
    },
    {
        "title": "Page 5 - Technical Architecture Overview",
        "lines": [
            "Architecture Pattern: Modular monorepo-style structure with separated frontend and backend services.",
            "Frontend: React (Vite) with reusable UI components and route-based pages.",
            "Backend: Node.js + Express REST API with layered architecture (routes, controllers, services, repositories).",
            "Database: PostgreSQL chosen for relational integrity plus JSON capabilities and robust indexing.",
            "Auth: Firebase Authentication for Google sign-in; backend remains auth-ready with room for JWT verification middleware hardening.",
            "Data Flow:",
            "1. User submits profile (MBTI, RIASEC, skills).",
            "2. Backend computes weighted scores using stored job requirements and mapping tables.",
            "3. API returns ranked opportunities and skill-gap details.",
            "4. User saves preferred paths and checklist progress under authenticated identity.",
            "Non-functional principles:",
            "- Maintainability through modular boundaries.",
            "- Security by environment isolation and least-privilege config.",
            "- Scalability through stateless API and normalized relational model.",
        ],
    },
    {
        "title": "Page 6 - Frontend Design and User Experience",
        "lines": [
            "UI Direction: Minimal, modern, Apple-inspired visual language with glassmorphism cards and blur effects.",
            "Core UX features:",
            "- Multipage navigation (Home, Analysis, Paths, About, Login).",
            "- Scroll-triggered animation sequences using Framer Motion.",
            "- Responsive layout for desktop, tablet, and mobile screens.",
            "- Dark/light theme toggle with consistent semantic color tokens.",
            "- SEO-friendly route metadata and accessible semantic markup.",
            "Reusable components:",
            "- Navbar, Footer, BlurCard, StatCard, SectionHeader, Chart panels, Form selectors, Recommendation list, Skill-gap matrix.",
            "Animation approach:",
            "- Staggered reveal animations for cards and sections.",
            "- Subtle parallax/opacity transitions tied to viewport entry.",
            "- Performance-conscious animation durations and reduced-motion fallback.",
            "Result:",
            "A cohesive interface that looks premium while keeping interaction fast and legible.",
        ],
    },
    {
        "title": "Page 7 - Backend Services and API Design",
        "lines": [
            "Backend Stack: Node.js runtime, Express framework, PostgreSQL driver, and migration/seed scripts.",
            "REST API modules:",
            "- /api/health: service status and dependency checks.",
            "- /api/stats: career statistics for homepage charts.",
            "- /api/jobs: normalized jobs list and query filters.",
            "- /api/skills: master skill inventory.",
            "- /api/analysis/recommend: recommendation endpoint based on weighted hybrid model.",
            "- /api/paths: role requirements and gap analysis support.",
            "- /api/users/*: user history, saved paths, and checklist state (auth-ready).",
            "Service layer responsibilities:",
            "- Input validation and sanitization.",
            "- Domain scoring logic and explainable score breakdowns.",
            "- External job API aggregation and normalization.",
            "- Repository abstraction for maintainable DB access.",
            "Operational controls:",
            "- Rate limiting hooks, centralized error handling, and structured response format.",
        ],
    },
    {
        "title": "Page 8 - Data Model and Schema Strategy",
        "lines": [
            "Database choice rationale: PostgreSQL supports strict relational modeling with optional JSON columns for flexible metadata.",
            "Core entities:",
            "- users",
            "- jobs",
            "- skills",
            "- job_requirements",
            "- certifications",
            "- job_certifications",
            "- riasec_codes",
            "- mbti_profiles",
            "- job_skill_weights",
            "- user_histories",
            "- user_checklists",
            "Design practices:",
            "- Surrogate keys, unique constraints on natural keys, and foreign-key integrity.",
            "- Indexed lookup fields for title, location, and skill matching.",
            "- Migration-driven evolution to keep schema reproducible across environments.",
            "Seeding approach:",
            "- Baseline career data, expanded skill catalog, and 50+ job-role mappings preloaded.",
            "- Repeatable seeds for local and CI environments.",
        ],
    },
    {
        "title": "Page 9 - Authentication and User Record Tracking",
        "lines": [
            "Authentication implementation:",
            "- Dedicated login page with Google sign-in via Firebase Authentication.",
            "- Auth context provider handles login state, token lifecycle, and sign-out action.",
            "- Route guarding strategy for pages requiring user identity (history/checklist).",
            "User tracking capabilities:",
            "- Save recommendation sessions with timestamp and profile inputs.",
            "- Save target jobs and checklist progress per requirement item.",
            "- Retrieve historical progression and completion trends.",
            "Security notes:",
            "- Firebase config values loaded from environment variables.",
            "- No secret keys embedded in client bundle.",
            "- Backend can be extended to verify Firebase ID tokens for server-protected routes.",
            "User outcome:",
            "People can return and continue their career path execution with persistent progress.",
        ],
    },
    {
        "title": "Page 10 - Jobs API Aggregation and Normalization",
        "lines": [
            "External data integration goal:",
            "Ingest free/public job API data and transform to a unified local jobs schema.",
            "Planned provider pattern:",
            "- Provider interface: fetchJobs(query) -> normalized job objects.",
            "- Adapters for public APIs (e.g., Adzuna with application id/key).",
            "- Optional secondary provider fallback when primary API fails.",
            "Normalization fields:",
            "- external_id, source, title, company, location, description, apply_url, posted_at, salary_min, salary_max, skills_guess.",
            "Operational safeguards:",
            "- Retry/backoff on upstream failures.",
            "- Deduplication by source + external_id.",
            "- Cached recent pulls to reduce quota pressure.",
            "Traceability:",
            "- Store raw-source metadata for debugging and reprocessing.",
            "Result:",
            "Consistent downstream recommendation behavior regardless of upstream API variability.",
        ],
    },
    {
        "title": "Page 11 - Recommendation and Skill-Gap Engine",
        "lines": [
            "Recommendation method: weighted hybrid scoring.",
            "Scoring formula:",
            "final_score = 0.50 * skill_match + 0.25 * mbti_alignment + 0.25 * riasec_alignment",
            "Where:",
            "- skill_match uses overlap between user skills and job required skills with optional weight per critical skill.",
            "- mbti_alignment maps MBTI preferences to job archetype compatibility matrix.",
            "- riasec_alignment computes closeness between user code and role dominant RIASEC profile.",
            "Skill-gap analysis output per recommended job:",
            "- Missing required skills ranked by impact.",
            "- Nice-to-have skills for competitive advantage.",
            "- Required certifications and target experience level.",
            "Explainability:",
            "- Each recommendation returns score components and textual rationale.",
            "- Users understand why a role appears and what to do next to improve fit.",
        ],
    },
    {
        "title": "Page 12 - Paths Page and Checklist Workflow",
        "lines": [
            "Purpose of Paths page:",
            "Provide a dedicated area for job requirement pathways, separated from the analysis form for clarity.",
            "Content blocks:",
            "- Job card with required skills and proficiency expectations.",
            "- Certification block with links and effort estimates.",
            "- Experience milestones and project evidence recommendations.",
            "- Personal checklist with completion toggles and progress meter.",
            "Workflow:",
            "1. User selects a target job from recommendations.",
            "2. System loads requirement template and personal current-state gap.",
            "3. User marks completed items and stores progress history.",
            "4. Dashboard reflects readiness trend over time.",
            "Benefits:",
            "- Converts abstract recommendations into actionable learning/application steps.",
            "- Reduces drop-off by giving users concrete next actions.",
        ],
    },
    {
        "title": "Page 13 - Security, Privacy, and Compliance",
        "lines": [
            "Security controls planned for production:",
            "- Environment variable management for API keys and service credentials.",
            "- CORS policy restriction by deployment environment.",
            "- Input validation and output encoding on all API boundaries.",
            "- Helmet-style HTTP hardening headers and secure cookie strategy where applicable.",
            "- Audit logging for auth and critical data changes.",
            "Privacy posture:",
            "- Minimize personal data collection; store only necessary profile and progress metadata.",
            "- Provide clear data usage disclosure and deletion pathway.",
            "Compliance readiness:",
            "- Foundational alignment with common privacy principles (data minimization, access control, retention policy).",
            "- Architecture supports future regional compliance extension.",
            "Risk reduction outcome:",
            "User trust and operational resilience improve as the platform scales.",
        ],
    },
    {
        "title": "Page 14 - Testing, QA, and Observability",
        "lines": [
            "Testing layers:",
            "- Unit tests for scoring algorithms and utility functions.",
            "- Integration tests for API routes and database interactions.",
            "- End-to-end smoke tests for key user journeys (login, analyze, save path).",
            "Quality gates:",
            "- Linting and formatting standards enforced in CI.",
            "- Migration + seed checks before release branch merge.",
            "- Contract tests for external job provider adapters.",
            "Observability stack recommendations:",
            "- Structured logs with request ids.",
            "- Error monitoring and alerting integration.",
            "- Basic performance metrics for API latency and query hot paths.",
            "Release confidence model:",
            "Automated verification plus manual acceptance testing of UX-critical flows.",
        ],
    },
    {
        "title": "Page 15 - Deployment and Operations",
        "lines": [
            "Deployment topology:",
            "- Frontend hosted on static-friendly platform/CDN edge.",
            "- Backend deployed as containerized API service.",
            "- Managed PostgreSQL instance with automated backups.",
            "Environment strategy:",
            "- Separate local, staging, and production environments.",
            "- Secrets managed via deployment platform secret manager.",
            "- Repeatable environment bootstrap through scripts and documentation.",
            "Operational tasks:",
            "- Scheduled job synchronization runs.",
            "- Daily health checks and weekly backup validation.",
            "- Capacity review and index tuning based on usage.",
            "Cost control:",
            "- Start with right-sized instances and scale horizontally as traffic increases.",
            "- Cache high-demand read endpoints to reduce database pressure.",
        ],
    },
    {
        "title": "Page 16 - Team Structure (6 Members)",
        "lines": [
            "Member 1 - Project Lead / Product Owner",
            "- Owns roadmap, scope control, stakeholder communication, and acceptance criteria.",
            "Member 2 - Frontend Lead Engineer",
            "- Owns UI architecture, reusable components, animations, theme system, accessibility, and responsive quality.",
            "Member 3 - Backend Lead Engineer",
            "- Owns API contracts, service logic, validation, and integration reliability.",
            "Member 4 - Data and Algorithm Engineer",
            "- Owns schema design, migrations, seeds, recommendation weights, and skill-gap analytics.",
            "Member 5 - Auth and DevOps Engineer",
            "- Owns Firebase auth integration, environment security, CI/CD workflows, and deployment automation.",
            "Member 6 - QA and Documentation Engineer",
            "- Owns test strategy, defect tracking, release validation, and comprehensive technical/user documentation.",
            "Collaboration cadence:",
            "- Daily standup, weekly sprint review, and weekly risk/control checkpoint.",
        ],
    },
    {
        "title": "Page 17 - Twelve-Week Delivery Timeline",
        "lines": [
            "Week 1: Discovery, requirements baseline, architecture decisions, repo standards.",
            "Week 2: UI wireframes, design tokens, backend module scaffolding, database draft schema.",
            "Week 3: Core frontend pages (Home, About, Login) and initial API endpoints.",
            "Week 4: Analysis page implementation, MBTI/RIASEC/skills inputs, early recommendation logic.",
            "Week 5: Jobs provider integration (public API), normalization pipeline, persistence.",
            "Week 6: Paths page, requirements tables, checklist data model and API.",
            "Week 7: Firebase Google auth hardening, protected routes, user history persistence.",
            "Week 8: Expanded seed data (50+ jobs and broad skill catalog), performance pass.",
            "Week 9: Testing expansion (unit/integration/e2e), error handling improvements.",
            "Week 10: Security hardening, observability setup, staging deployment rehearsal.",
            "Week 11: UAT fixes, documentation completion, release candidate stabilization.",
            "Week 12: Final deployment, demo preparation, post-launch monitoring and handover.",
            "Milestone governance:",
            "- Each week has defined deliverables, owner accountability, and quality checkpoint.",
        ],
    },
    {
        "title": "Page 18 - Tools Used and Detailed Implementation Mapping",
        "lines": [
            "Frontend Tools and How Used:",
            "- React + Vite: fast local iteration, modular component architecture, route-level page composition.",
            "- Framer Motion: scroll-triggered animations, card reveal sequences, reduced-motion aware transitions.",
            "- Chart library: render career statistics from backend data feed and seeded snapshots.",
            "Backend Tools and How Used:",
            "- Express: REST routing, middleware chain, request validation, consistent JSON responses.",
            "- PostgreSQL driver: parameterized queries and transactional operations for consistency.",
            "- Custom scripts: migration runner, seeding runner, and provider synchronization tasks.",
            "Data and Intelligence Tools and How Used:",
            "- Relational schema for jobs/skills/requirements/checklists.",
            "- Weighted hybrid algorithm to rank job fit with explainable score decomposition.",
            "- Gap engine to generate actionable missing-skill checklist.",
            "Auth and Security Tools and How Used:",
            "- Firebase Authentication (Google provider) for user sign-in and sign-out.",
            "- Environment variables for secrets and API credentials.",
            "- API-level validation and secure defaults for safer production operation.",
            "Project Delivery Tools and How Used:",
            "- Git-based workflow with branch reviews.",
            "- CI checks for lint/test/build gatekeeping.",
            "- Detailed markdown documentation and this formal proposal for governance alignment.",
        ],
    },
]


body_parts: list[str] = []

for idx, page in enumerate(pages):
    title = str(page["title"])
    subtitle = str(page.get("subtitle", ""))
    lines = [str(x) for x in page.get("lines", [])]

    body_parts.append(para(title, bold=True, size_half_points=36))
    if subtitle:
        body_parts.append(blank_line())
        body_parts.append(para(subtitle, bold=False, size_half_points=28))
    body_parts.append(blank_line())

    for line in lines:
        if line == "":
            body_parts.append(blank_line())
        else:
            body_parts.append(para(line, size_half_points=22))

    if idx < len(pages) - 1:
        body_parts.append(page_break())

body_parts.append(
    "<w:sectPr>"
    "<w:pgSz w:w=\"11906\" w:h=\"16838\"/>"
    "<w:pgMar w:top=\"1440\" w:right=\"1440\" w:bottom=\"1440\" w:left=\"1440\" "
    "w:header=\"708\" w:footer=\"708\" w:gutter=\"0\"/>"
    "<w:cols w:space=\"708\"/>"
    "<w:docGrid w:linePitch=\"360\"/>"
    "</w:sectPr>"
)

document_xml = (
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"
    "<w:document "
    "xmlns:wpc=\"http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas\" "
    "xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" "
    "xmlns:o=\"urn:schemas-microsoft-com:office:office\" "
    "xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" "
    "xmlns:m=\"http://schemas.openxmlformats.org/officeDocument/2006/math\" "
    "xmlns:v=\"urn:schemas-microsoft-com:vml\" "
    "xmlns:wp14=\"http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing\" "
    "xmlns:wp=\"http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing\" "
    "xmlns:w10=\"urn:schemas-microsoft-com:office:word\" "
    "xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" "
    "xmlns:w14=\"http://schemas.microsoft.com/office/word/2010/wordml\" "
    "xmlns:wpg=\"http://schemas.microsoft.com/office/word/2010/wordprocessingGroup\" "
    "xmlns:wpi=\"http://schemas.microsoft.com/office/word/2010/wordprocessingInk\" "
    "xmlns:wne=\"http://schemas.microsoft.com/office/word/2006/wordml\" "
    "xmlns:wps=\"http://schemas.microsoft.com/office/word/2010/wordprocessingShape\" "
    "mc:Ignorable=\"w14 wp14\">"
    "<w:body>"
    + "".join(body_parts)
    + "</w:body></w:document>"
)

content_types_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>
"""

rels_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>
"""

doc_rels_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>
"""

core_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
 xmlns:dc="http://purl.org/dc/elements/1.1/"
 xmlns:dcterms="http://purl.org/dc/terms/"
 xmlns:dcmitype="http://purl.org/dc/dcmitype/"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Career Compass Full Proposal</dc:title>
  <dc:creator>Team Career Compass</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">{date.today().isoformat()}T00:00:00Z</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">{date.today().isoformat()}T00:00:00Z</dcterms:modified>
</cp:coreProperties>
"""

app_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"
 xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Career Compass Proposal Generator</Application>
  <Pages>18</Pages>
  <Words>5500</Words>
</Properties>
"""

with zipfile.ZipFile(OUTPUT, "w", compression=zipfile.ZIP_DEFLATED) as zf:
    zf.writestr("[Content_Types].xml", content_types_xml)
    zf.writestr("_rels/.rels", rels_xml)
    zf.writestr("word/document.xml", document_xml)
    zf.writestr("word/_rels/document.xml.rels", doc_rels_xml)
    zf.writestr("docProps/core.xml", core_xml)
    zf.writestr("docProps/app.xml", app_xml)

print(f"Wrote {OUTPUT}")
