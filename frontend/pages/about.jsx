import GlassCard from "../components/GlassCard";
import Layout from "../components/Layout";

const contacts = [
  { label: "Email", value: "hello@careercompass.app" },
  { label: "Phone", value: "+1 (415) 555-0129" },
  { label: "Address", value: "San Francisco, CA, United States" },
  { label: "Support Hours", value: "Monday-Friday, 9:00 AM-6:00 PM PT" }
];

export default function AboutPage() {
  return (
    <Layout>
      <div className="page-stack">
        <GlassCard className="content-card fade-up" as="section">
          <p className="eyebrow">About us</p>
          <h1>Built to remove career guesswork with evidence-based matching.</h1>
          <p>
            Career Compass combines career science and labor market data to help job seekers discover
            roles that fit their strengths, personality, and growth direction. The platform is focused
            on practical outcomes: better role targeting, clear skill gaps, and faster applications.
          </p>
        </GlassCard>

        <section className="card-grid dual">
          <GlassCard className="content-card card-tilt fade-up">
            <h2>Our product principles</h2>
            <ul className="flow-list">
              <li>Transparent scoring over black-box recommendations.</li>
              <li>Actionable next steps from every analysis.</li>
              <li>Relational data model for careers, skills, and certifications.</li>
              <li>Real opportunities integrated from public jobs APIs.</li>
            </ul>
          </GlassCard>

          <GlassCard className="content-card card-tilt fade-up" style={{ animationDelay: "0.1s" }}>
            <h2>Contact</h2>
            <ul className="tag-list">
              {contacts.map((entry) => (
                <li key={entry.label}>
                  <strong>{entry.label}</strong>: {entry.value}
                </li>
              ))}
            </ul>
          </GlassCard>
        </section>
      </div>
    </Layout>
  );
}
