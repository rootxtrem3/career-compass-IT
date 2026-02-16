const GOALS = [
  {
    title: "Smarter Search",
    detail: "Match careers to your personality and strengths before spending time on random applications."
  },
  {
    title: "Focused Applications",
    detail: "Target roles where your natural style and skills are more likely to fit hiring expectations."
  },
  {
    title: "Practical Direction",
    detail: "Get concrete opportunity suggestions instead of generic career advice."
  }
];

const WORLD_STATS = [
  {
    value: "5.0%",
    label: "Global unemployment rate (2024)",
    source: "ILO World Employment and Social Outlook: Trends 2025"
  },
  {
    value: "12.6%",
    label: "Youth unemployment rate (2024)",
    source: "ILO World Employment and Social Outlook: Trends 2025"
  },
  {
    value: "53M",
    label: "Estimated jobs added globally in 2025",
    source: "ILO update, May 2025"
  }
];

const PROCESS = [
  "Choose your RIASEC interests",
  "Select your strongest skills",
  "Pick your MBTI type",
  "Get suitable job opportunities with direct links"
];

export default function HomePage() {
  return (
    <div className="page-stack">
      <section className="hero glass-card" data-reveal>
        <p className="eyebrow">Career Compass</p>
        <h1>Personality + Skills, Aligned to Real Career Paths.</h1>
        <p className="hero-copy">
          Career Compass is built to enhance job searching and applications by combining what you
          are good at with how you naturally work.
        </p>
        <div className="hero-actions">
          <a className="btn btn-solid" href="#/analysis">
            Start Analysis
          </a>
          <a className="btn btn-soft" href="#/about">
            About The Team
          </a>
        </div>
      </section>

      <section className="card-grid triple">
        {GOALS.map((goal, index) => (
          <article
            key={goal.title}
            className="glass-card content-card"
            data-reveal
            style={{ "--delay": `${index * 80}ms` }}
          >
            <h3>{goal.title}</h3>
            <p>{goal.detail}</p>
          </article>
        ))}
      </section>

      <section className="glass-card stats-wrap" data-reveal>
        <div className="section-heading">
          <h2>Current world career statistics</h2>
          <p>Quick labor-market context to support better career decisions.</p>
        </div>
        <div className="card-grid triple">
          {WORLD_STATS.map((stat, index) => (
            <article
              key={stat.label}
              className="stat-card"
              data-reveal
              style={{ "--delay": `${index * 100 + 100}ms` }}
            >
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
              <p className="stat-source">{stat.source}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-card" data-reveal>
        <div className="section-heading">
          <h2>How Career Compass works</h2>
          <p>Minimal process. Clear output.</p>
        </div>
        <ol className="flow-list">
          {PROCESS.map((item, index) => (
            <li key={item} data-reveal style={{ "--delay": `${index * 75 + 40}ms` }}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
