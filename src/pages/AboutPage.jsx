const CONTACTS = [
  { label: "Email", value: "ebafrost@gmail.com" },
  { label: "Phone", value: "+251 973943466" },
  // { label: "Address", value: "400 Market St, San Francisco, CA 94111" },
 // { label: "Support Hours", value: "Monday-Friday, 9:00 AM-6:00 PM PST" }
];

export default function AboutPage() {
  return (
    <div className="page-stack">
      <section className="glass-card" data-reveal>
        <p className="eyebrow">About Career Compass</p>
        <h1>Built to reduce career guesswork.</h1>
        <p className="hero-copy">
          We created Career Compass to help people discover better-fit career paths by blending
          personality signals and practical skills. The goal is simple: make job searching more
          focused, faster, and more effective.
        </p>
      </section>

      <section className="card-grid dual">
        <article className="glass-card content-card" data-reveal>
          <h2>What we prioritize</h2>
          <p>
            Human-centered recommendations, transparent scoring, and practical links that move from
            insight to application without friction.
          </p>
        </article>
        <article className="glass-card content-card" data-reveal>
          <h2>Contact information</h2>
          <ul className="contact-list">
            {CONTACTS.map((entry) => (
              <li key={entry.label}>
                <span>{entry.label}</span>
                <strong>{entry.value}</strong>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
