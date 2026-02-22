import { useEffect, useState } from 'react';
import { StatsChart } from '../components/charts/StatsChart.jsx';
import { GlassCard } from '../components/ui/GlassCard.jsx';
import { SectionReveal } from '../components/ui/SectionReveal.jsx';
import { fallbackStats } from '../data/fallback.js';
import { useSeo } from '../hooks/useSeo.js';
import { apiClient } from '../services/apiClient.js';

const goals = [
  {
    title: 'Personality-guided direction',
    body: 'Translate MBTI and RIASEC preferences into practical job paths you can apply for now.'
  },
  {
    title: 'Skill-first recommendations',
    body: 'Prioritize roles where your existing skills are strongest and clearly identify missing requirements.'
  },
  {
    title: 'Application acceleration',
    body: 'Attach live openings from aggregated sources to every career recommendation.'
  }
];

const roadmap = [
  'Select your RIASEC profile (up to 3 dimensions).',
  'Choose your MBTI personality type.',
  'Select your strongest skills.',
  'Review weighted career matches and skill gaps.',
  'Open linked opportunities and apply with confidence.'
];

export function HomePage() {
  const [stats, setStats] = useState(fallbackStats);
  const [jobs, setJobs] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState('');

  useSeo({
    title: 'Career Compass | Home',
    description:
      'Career Compass enhances job searching and applications by matching careers to personality and skills.'
  });

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([apiClient.getWorldStats(), apiClient.getJobs({ limit: 6 })]).then((results) => {
      if (cancelled) return;

      if (results[0].status === 'fulfilled' && Array.isArray(results[0].value)) {
        setStats(results[0].value);
      }

      if (results[1].status === 'fulfilled' && Array.isArray(results[1].value)) {
        setJobs(results[1].value);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  async function syncJobs() {
    setError('');
    setIsSyncing(true);

    try {
      await apiClient.syncJobs({ limit: 40 });
      const refreshed = await apiClient.getJobs({ limit: 6 });
      setJobs(refreshed);
    } catch (err) {
      setError(err.message || 'Failed to sync jobs');
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <div className="page-stack">
      <SectionReveal>
        <GlassCard className="hero" as="section">
          <p className="eyebrow">Career Compass Platform</p>
          <h1>Navigate careers with personality intelligence and skill evidence.</h1>
          <p>
            Career Compass is a full-stack guidance platform designed to improve job-search quality,
            confidence, and outcomes by combining your MBTI, RIASEC profile, and skills into clear
            recommendations.
          </p>
          <div className="hero-actions">
            <a href="#/analysis" className="btn btn-solid">
              Analyze My Career Fit
            </a>
            <a href="#/about" className="btn btn-soft">
              About Career Compass
            </a>
          </div>
        </GlassCard>
      </SectionReveal>

      <section className="card-grid triple" aria-label="Platform goals">
        {goals.map((goal, index) => (
          <SectionReveal key={goal.title} delay={index * 110}>
            <GlassCard className="content-card">
              <h2>{goal.title}</h2>
              <p>{goal.body}</p>
            </GlassCard>
          </SectionReveal>
        ))}
      </section>

      <SectionReveal>
        <GlassCard className="content-card" as="section">
          <div className="section-head-row">
            <div>
              <p className="eyebrow">Global Snapshot</p>
              <h2>Current world career statistics</h2>
            </div>
          </div>
          <StatsChart items={stats} />
        </GlassCard>
      </SectionReveal>

      <SectionReveal>
        <GlassCard className="content-card" as="section">
          <div className="section-head-row">
            <div>
              <p className="eyebrow">Live Opportunities</p>
              <h2>Aggregated job listings</h2>
            </div>
            <button type="button" className="btn btn-soft" onClick={syncJobs} disabled={isSyncing}>
              {isSyncing ? 'Syncing...' : 'Sync Jobs API'}
            </button>
          </div>
          {error ? <p className="error-text">{error}</p> : null}

          <div className="job-list">
            {jobs.length ? (
              jobs.map((job) => (
                <article key={`${job.source}-${job.id}`} className="job-row glass-soft">
                  <div>
                    <h3>{job.title}</h3>
                    <p>
                      {job.company} · {job.location || 'Remote'}
                    </p>
                  </div>
                  <div className="job-actions">
                    <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-soft">
                      Apply
                    </a>
                    <a
                      href={job.linkedinUrl || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${job.title} ${job.company || ''}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-soft"
                    >
                      LinkedIn
                    </a>
                  </div>
                </article>
              ))
            ) : (
              <p className="muted">No jobs synced yet. Use "Sync Jobs API" to load listings.</p>
            )}
          </div>
        </GlassCard>
      </SectionReveal>

      <SectionReveal>
        <GlassCard className="content-card" as="section">
          <p className="eyebrow">How it works</p>
          <h2>Minimal process, high-signal output</h2>
          <ol className="flow-list">
            {roadmap.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </GlassCard>
      </SectionReveal>
    </div>
  );
}
