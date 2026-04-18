import GlassCard from "../components/GlassCard";
import Layout from "../components/Layout";

const objectives = [
  "Build an intelligent hybrid matching system with explainable weighted scoring.",
  "Automate gap analysis for skills, certifications, tools, and experience.",
  "Integrate live labor-market sources such as Remotive and Adzuna.",
  "Provide secure persistence for saved paths, assessments, and progress.",
  "Centralize career intelligence into a single source of truth."
];

const team = [
  { role: "Project Manager / Backend Lead", member: "Ebasa Getu", duty: "Leadership, meeting coordination, API direction, and backend delivery." },
  { role: "Frontend Lead", member: "Dawit Asfaw", duty: "React architecture, responsive layout work, and UI consistency." },
  { role: "Data Engineer", member: "Daniel Kibret", duty: "Database structure, relationship design, and optimization guidance." },
  { role: "DevOps & Security", member: "Ebasa Getu and Bereket H/Mariam", duty: "Firebase integration, CI/CD, and secure deployment setup." },
  { role: "QA & Documentation", member: "Fraol Merga and Nathaniel Dagim", duty: "Testing, API normalization checks, user manual, and SRS support." }
];

const risks = [
  "External API rate limiting mitigated with backend caching.",
  "Database schema drift mitigated with migrations.",
  "Authentication security handled through Firebase managed services.",
  "Team member absence mitigated through documentation and shared knowledge."
];

export default function AboutPage() {
  return (
    <Layout>
      <div className="page-stack">
        <GlassCard className="content-card fade-up" as="section">
          <p className="eyebrow">Project overview</p>
          <h1>From proposal to platform</h1>
          <p>
            Career Compass is positioned in the proposal as a decision-support platform rather than a
            simple vacancy board. Its purpose is to help users discover suitable careers, understand
            the gap between their current profile and target roles, and keep progressing over time.
          </p>
        </GlassCard>

        <section className="card-grid dual">
          <GlassCard className="content-card card-tilt fade-up">
            <h2>Specific objectives</h2>
            <ul className="flow-list">
              {objectives.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="content-card card-tilt fade-up" style={{ animationDelay: "0.1s" }}>
            <h2>Non-functional priorities</h2>
            <ul className="flow-list">
              <li>Performance through efficient API handling and caching.</li>
              <li>Scalability through decoupled frontend, backend, and data layers.</li>
              <li>Accessibility through responsive layouts and readable visual hierarchy.</li>
              <li>Security through token verification and protected data access.</li>
            </ul>
          </GlassCard>
        </section>

        <GlassCard className="content-card fade-up" as="section">
          <p className="eyebrow">System model</p>
          <h2>Basic architecture</h2>
          <div className="card-grid triple">
            <div className="glass-soft content-card compact-card">
              <h3>Client side</h3>
              <p>Renders dashboards, recommendations, and job listings with authenticated requests.</p>
            </div>
            <div className="glass-soft content-card compact-card">
              <h3>Server side</h3>
              <p>Runs business logic, scoring, CRUD operations, and acts as a proxy for job APIs.</p>
            </div>
            <div className="glass-soft content-card compact-card">
              <h3>Security layer</h3>
              <p>Uses Firebase JWT verification so users only reach their own data and saved progress.</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="content-card fade-up" as="section">
          <p className="eyebrow">Team roles</p>
          <h2>Credits to the builders</h2>
          <div className="team-grid">
            {team.map((item) => (
              <div key={item.role} className="glass-soft team-card">
                <p className="eyebrow">{item.role}</p>
                <h3>{item.member}</h3>
                <p className="muted">{item.duty}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="content-card fade-up" as="section">
          <p className="eyebrow">Risk management</p>
          <h2>Mitigation strategy</h2>
          <ul className="flow-list">
            {risks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </Layout>
  );
}
