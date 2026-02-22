import { useEffect, useMemo, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard.jsx';
import { SectionReveal } from '../components/ui/SectionReveal.jsx';
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

export function PathsPage() {
  const { token, isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeCareerId, setActiveCareerId] = useState(null);
  const [checklistItems, setChecklistItems] = useState([]);
  const [checklistLoading, setChecklistLoading] = useState(false);
  const [checklistError, setChecklistError] = useState('');

  useSeo({
    title: 'Career Compass | Career Paths',
    description: 'Explore career path requirements including skills, certifications, and experience levels.'
  });

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    apiClient
      .getCareerPaths({ q: search })
      .then((data) => {
        if (!cancelled) {
          setPaths(data);
          setError('');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load career paths.');
          setPaths([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search]);

  const resultsCountLabel = useMemo(() => {
    if (loading) return 'Loading paths...';
    return `${paths.length} career path${paths.length === 1 ? '' : 's'} found`;
  }, [loading, paths.length]);

  const checklistProgress = useMemo(() => {
    if (!checklistItems.length) return 0;
    const completed = checklistItems.filter((item) => item.completed).length;
    return Math.round((completed / checklistItems.length) * 100);
  }, [checklistItems]);

  async function loadChecklist(careerId) {
    if (!isAuthenticated || !token) {
      setChecklistError('Sign in with Firebase to track your checklist.');
      return;
    }

    setChecklistLoading(true);
    setChecklistError('');
    setActiveCareerId(careerId);

    try {
      await apiClient.bootstrapChecklist({ token, careerId });
      const items = await apiClient.getChecklist({ token, careerId });
      setChecklistItems(items);
    } catch (err) {
      setChecklistError(err.message || 'Failed to load checklist.');
      setChecklistItems([]);
    } finally {
      setChecklistLoading(false);
    }
  }

  async function toggleChecklistItem(itemId, completed) {
    if (!token) return;

    try {
      const updated = await apiClient.updateChecklistItem({ token, itemId, completed });
      setChecklistItems((current) =>
        current.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
      );
    } catch (err) {
      setChecklistError(err.message || 'Failed to update checklist item.');
    }
  }

  return (
    <div className="page-stack">
      <SectionReveal>
        <GlassCard className="content-card" as="section">
          <p className="eyebrow">Career Paths</p>
          <h1>Skills, requirements, and your path checklist</h1>
          <p>
            Review requirements per role, then create a personal checklist to track progress for your
            selected path.
          </p>
          <input
            className="input-field"
            placeholder="Search paths (e.g. data, design, analyst)"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <p className="muted">{resultsCountLabel}</p>
          {!isAuthenticated ? (
            <p className="muted">Sign in to save and track your personalized path checklist.</p>
          ) : null}
        </GlassCard>
      </SectionReveal>

      {error ? <p className="error-text">{error}</p> : null}

      <section className="paths-grid">
        {paths.map((path, index) => (
          <SectionReveal key={path.careerId} delay={index * 70}>
            <GlassCard className="content-card path-card">
              <div className="result-head">
                <h2>{path.title}</h2>
                <span>{path.experienceLevel}</span>
              </div>
              <p>{path.description}</p>
              <p className="muted">
                Median salary: <strong>{formatCurrency(path.medianSalaryUsd)}</strong>
              </p>

              <div className="requirements-block">
                <h3>Required Skills</h3>
                {path.requiredSkills.length ? (
                  <ul className="tag-list">
                    {path.requiredSkills.map((skill) => (
                      <li key={skill.skillId}>
                        {skill.name} · {skill.minLevel} · {Math.round(skill.importance * 100)}% importance
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted">No mapped skill requirements.</p>
                )}
              </div>

              <div className="requirements-block">
                <h3>Certifications</h3>
                {path.certifications.length ? (
                  <ul className="tag-list">
                    {path.certifications.map((cert) => (
                      <li key={cert.certificationId}>
                        {cert.name} ({cert.provider}) {cert.isRequired ? '- Required' : '- Recommended'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted">No specific certifications listed.</p>
                )}
              </div>

              <button
                type="button"
                className="btn btn-soft"
                onClick={() => loadChecklist(path.careerId)}
                disabled={checklistLoading && activeCareerId === path.careerId}
              >
                {checklistLoading && activeCareerId === path.careerId ? 'Loading checklist...' : 'Track this path'}
              </button>

              {activeCareerId === path.careerId ? (
                <div className="requirements-block">
                  <h3>My Checklist ({checklistProgress}% complete)</h3>
                  {checklistError ? <p className="error-text">{checklistError}</p> : null}
                  {checklistItems.length ? (
                    <ul className="checklist-list">
                      {checklistItems.map((item) => (
                        <li key={item.id} className={item.completed ? 'check-item done' : 'check-item'}>
                          <label>
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={(event) => toggleChecklistItem(item.id, event.target.checked)}
                            />
                            <span>{item.label}</span>
                          </label>
                          <small>{item.itemType}</small>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="muted">No checklist items yet for this path.</p>
                  )}
                </div>
              ) : null}
            </GlassCard>
          </SectionReveal>
        ))}
      </section>
    </div>
  );
}
