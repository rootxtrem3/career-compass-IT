import { GlassCard } from '../components/ui/GlassCard.jsx';
import { SectionReveal } from '../components/ui/SectionReveal.jsx';
import { EXTERNAL_LINKS } from '../constants/externalLinks.js';
import { useSeo } from '../hooks/useSeo.js';

const contacts = [
  { label: 'Email', value: 'hello@careercompass.app', href: EXTERNAL_LINKS.contactEmail },
  { label: 'Phone', value: '+1 (415) 555-0129', href: 'tel:+14155550129' },
  { label: 'Address', value: 'San Francisco, CA, United States', href: '#' },
  { label: 'Support Hours', value: 'Monday-Friday, 9:00 AM-6:00 PM PT', href: '#' }
];

export function AboutPage() {
  useSeo({
    title: 'Career Compass | About',
    description: 'Learn about the mission and contact information behind Career Compass.'
  });

  return (
    <div className="page-stack">
      <SectionReveal>
        <GlassCard className="content-card" as="section">
          <p className="eyebrow">About us</p>
          <h1>Built to remove career guesswork with evidence-based matching.</h1>
          <p>
            Career Compass combines career science and labor market data to help job seekers discover
            roles that fit their strengths, personality, and growth direction. The platform is focused
            on practical outcomes: better role targeting, clear skill gaps, and faster applications.
          </p>
        </GlassCard>
      </SectionReveal>

      <section className="card-grid dual">
        <SectionReveal>
          <GlassCard className="content-card">
            <h2>Our product principles</h2>
            <ul className="flow-list compact">
              <li>Transparent scoring over black-box recommendations.</li>
              <li>Actionable next steps from every analysis.</li>
              <li>Relational data model for careers, skills, and certifications.</li>
              <li>Real opportunities integrated from public jobs APIs.</li>
            </ul>
          </GlassCard>
        </SectionReveal>

        <SectionReveal delay={120}>
          <GlassCard className="content-card">
            <h2>Contact</h2>
            <ul className="contact-list">
              {contacts.map((entry) => (
                <li key={entry.label}>
                  <span>{entry.label}</span>
                  {entry.href === '#' ? (
                    <strong>{entry.value}</strong>
                  ) : (
                    <a href={entry.href}>
                      <strong>{entry.value}</strong>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </GlassCard>
        </SectionReveal>
      </section>
    </div>
  );
}
