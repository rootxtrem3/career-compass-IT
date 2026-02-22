import { useMemo, useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard.jsx';
import { SectionReveal } from '../components/ui/SectionReveal.jsx';
import { EXTERNAL_LINKS } from '../constants/externalLinks.js';
import { fallbackLookups } from '../data/fallback.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSeo } from '../hooks/useSeo.js';
import { apiClient } from '../services/apiClient.js';

function formatCurrency(value) {
  if (!value) return 'Not specified';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

export function AnalysisPage() {
  const { token } = useAuth();
  const [lookups, setLookups] = useState(fallbackLookups);
  const [selectedRiasec, setSelectedRiasec] = useState([]);
  const [selectedMbti, setSelectedMbti] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchSkill, setSearchSkill] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  useSeo({
    title: 'Career Compass | Analysis',
    description:
      'Run weighted hybrid career matching using skills, MBTI, and RIASEC, with skill-gap analysis.'
  });

  useEffect(() => {
    let cancelled = false;

    apiClient
      .getLookups()
      .then((data) => {
        if (!cancelled) setLookups(data);
      })
      .catch(() => {
        if (!cancelled) setLookups(fallbackLookups);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!token) {
      setHistory([]);
      setHistoryError('');
      return;
    }

    let cancelled = false;
    setHistoryLoading(true);

    apiClient
      .getAnalysisHistory({ token, limit: 10 })
      .then((data) => {
        if (!cancelled) {
          setHistory(data);
          setHistoryError('');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setHistoryError(err.message || 'Could not load your history.');
          setHistory([]);
        }
      })
      .finally(() => {
        if (!cancelled) setHistoryLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const visibleSkills = useMemo(() => {
    const query = searchSkill.trim().toLowerCase();
    if (!query) return lookups.skills;
    return lookups.skills.filter((skill) => skill.name.toLowerCase().includes(query));
  }, [searchSkill, lookups.skills]);

  function toggleRiasec(code) {
    setSelectedRiasec((current) => {
      if (current.includes(code)) return current.filter((item) => item !== code);
      if (current.length >= 3) return [...current.slice(1), code];
      return [...current, code];
    });
  }

  function toggleSkill(skillId) {
    setSelectedSkills((current) =>
      current.includes(skillId) ? current.filter((item) => item !== skillId) : [...current, skillId]
    );
  }

  async function runAnalysis() {
    setError('');

    if (!selectedRiasec.length || !selectedMbti || !selectedSkills.length) {
      setError('Please choose at least one RIASEC code, one MBTI type, and one skill.');
      return;
    }

    setLoading(true);
    try {
      const data = await apiClient.getRecommendations({
        riasecCodes: selectedRiasec,
        mbtiCode: selectedMbti,
        skillIds: selectedSkills,
        token
      });
      setResults(data);
    } catch (err) {
      setError(err.message || 'Unable to analyze career fit.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-stack">
      <SectionReveal>
        <GlassCard className="content-card" as="section">
          <p className="eyebrow">Hybrid Scoring Engine</p>
          <h1>Career fit analysis</h1>
          <p>
            Weighted scoring = Skill match (50%) + RIASEC alignment (30%) + MBTI alignment (20%).
            Results include role fit and live opportunities. Detailed path requirements are available
            on the Paths page.
          </p>
          <div className="hero-actions">
            <a href={EXTERNAL_LINKS.riasecTest} target="_blank" rel="noopener noreferrer" className="btn btn-soft">
              Take RIASEC Test
            </a>
            <a href={EXTERNAL_LINKS.mbtiTest} target="_blank" rel="noopener noreferrer" className="btn btn-soft">
              Take MBTI Test
            </a>
          </div>
        </GlassCard>
      </SectionReveal>

      <section className="analysis-grid">
        <SectionReveal>
          <GlassCard className="content-card">
            <h2>1. Choose RIASEC (max 3)</h2>
            <div className="choice-grid">
              {lookups.riasec.map((item) => (
                <button
                  type="button"
                  key={item.code}
                  className={selectedRiasec.includes(item.code) ? 'choice-chip active' : 'choice-chip'}
                  onClick={() => toggleRiasec(item.code)}
                  title={item.description}
                >
                  {item.code} · {item.name}
                </button>
              ))}
            </div>
            <p className="muted">Selected: {selectedRiasec.join(', ') || 'None'}</p>
          </GlassCard>
        </SectionReveal>

        <SectionReveal delay={100}>
          <GlassCard className="content-card">
            <h2>2. Choose MBTI</h2>
            <div className="choice-grid mbti-grid">
              {lookups.mbti.map((item) => (
                <button
                  type="button"
                  key={item.code}
                  className={selectedMbti === item.code ? 'choice-chip active' : 'choice-chip'}
                  onClick={() => setSelectedMbti(item.code)}
                >
                  {item.code}
                </button>
              ))}
            </div>
            <p className="muted">Selected: {selectedMbti || 'None'}</p>
          </GlassCard>
        </SectionReveal>

        <SectionReveal delay={200}>
          <GlassCard className="content-card">
            <h2>3. Choose Skills</h2>
            <input
              className="input-field"
              placeholder="Filter skills"
              value={searchSkill}
              onChange={(event) => setSearchSkill(event.target.value)}
            />
            <div className="choice-grid skills-grid">
              {visibleSkills.map((skill) => (
                <button
                  type="button"
                  key={skill.id}
                  className={selectedSkills.includes(skill.id) ? 'choice-chip active' : 'choice-chip'}
                  onClick={() => toggleSkill(skill.id)}
                >
                  {skill.name}
                </button>
              ))}
            </div>
            <p className="muted">Selected: {selectedSkills.length} skill(s)</p>
          </GlassCard>
        </SectionReveal>
      </section>

      <SectionReveal>
        <GlassCard className="content-card" as="section">
          <div className="section-head-row">
            <h2>Recommendations</h2>
            <button type="button" className="btn btn-solid" onClick={runAnalysis} disabled={loading}>
              {loading ? 'Analyzing...' : 'Generate'}
            </button>
          </div>

          {error ? <p className="error-text">{error}</p> : null}

          {!results.length ? <p className="muted">No results yet. Run analysis to view recommendations.</p> : null}

          <div className="results-grid">
            {results.map((item) => (
              <article key={item.careerId} className="result-card glass-soft">
                <div className="result-head">
                  <h3>{item.title}</h3>
                  <span>{item.score}% fit</span>
                </div>
                <p>{item.description}</p>

                <div className="score-track">
                  <span className="score-fill" style={{ width: `${item.score}%` }} />
                </div>

                <div className="mini-metrics">
                  <p>
                    Skill Coverage <strong>{item.breakdown.skillCoverage}%</strong>
                  </p>
                  <p>
                    RIASEC Coverage <strong>{item.breakdown.riasecCoverage}%</strong>
                  </p>
                  <p>
                    MBTI Alignment <strong>{item.breakdown.mbtiAlignment}%</strong>
                  </p>
                  <p>
                    Experience <strong>{item.experienceLevel}</strong>
                  </p>
                  <p>
                    Median Salary <strong>{formatCurrency(item.medianSalaryUsd)}</strong>
                  </p>
                </div>

                <a className="btn btn-soft" href={`#/paths`}>
                  View skills and requirements
                </a>

                <div>
                  <h4>Opportunities</h4>
                  {item.opportunities.length ? (
                    <ul className="links-list">
                      {item.opportunities.map((job) => (
                        <li key={job.id}>
                          <div className="opportunity-links">
                            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                              {job.title} · {job.company}
                            </a>
                            <a
                              href={
                                job.linkedinUrl ||
                                `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
                                  `${job.title} ${job.company || ''}`
                                )}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              LinkedIn
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <a
                      className="btn btn-soft"
                      href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(item.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Search {item.title} openings
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </GlassCard>
      </SectionReveal>

      <SectionReveal>
        <GlassCard className="content-card" as="section">
          <h2>My Analysis History</h2>
          {!token ? <p className="muted">Sign in with Firebase to persist your analysis history.</p> : null}
          {historyLoading ? <p className="muted">Loading history...</p> : null}
          {historyError ? <p className="error-text">{historyError}</p> : null}
          {token && !historyLoading && !history.length ? (
            <p className="muted">No saved analysis yet. Generate recommendations to create your first record.</p>
          ) : null}
          {history.length ? (
            <ul className="history-list">
              {history.map((item) => (
                <li key={item.id}>
                  <p>
                    {new Date(item.createdAt).toLocaleString()} · MBTI {item.mbtiCode} · RIASEC{' '}
                    {item.riasecCodes.join(', ')}
                  </p>
                  <small>
                    Top careers:{' '}
                    {Array.isArray(item.topSnapshot)
                      ? item.topSnapshot.map((career) => `${career.title} (${career.score}%)`).join(', ')
                      : 'N/A'}
                  </small>
                </li>
              ))}
            </ul>
          ) : null}
        </GlassCard>
      </SectionReveal>
    </div>
  );
}
