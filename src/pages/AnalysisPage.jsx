import { useMemo, useState } from "react";
import {
  MBTI_OPTIONS,
  RIASEC_OPTIONS,
  SKILL_OPTIONS,
  getRecommendations
} from "../data/careerEngine.js";

const MBTI_TEST_URL = "https://www.16personalities.com/free-personality-test";
const RIASEC_TEST_URL = "https://www.mynextmove.org/explore/ip";

export default function AnalysisPage() {
  const [selectedRiasec, setSelectedRiasec] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedMbti, setSelectedMbti] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  const skillOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return SKILL_OPTIONS;
    return SKILL_OPTIONS.filter((skill) => skill.toLowerCase().includes(normalized));
  }, [query]);

  const recommendations = useMemo(
    () => getRecommendations(selectedRiasec, selectedSkills, selectedMbti),
    [selectedRiasec, selectedSkills, selectedMbti]
  );

  function toggleRiasec(letter) {
    setSelectedRiasec((current) => {
      if (current.includes(letter)) return current.filter((item) => item !== letter);
      if (current.length >= 3) return [...current.slice(1), letter];
      return [...current, letter];
    });
  }

  function toggleSkill(skill) {
    setSelectedSkills((current) => {
      if (current.includes(skill)) return current.filter((item) => item !== skill);
      return [...current, skill];
    });
  }

  function handleGenerate() {
    if (!selectedRiasec.length || !selectedSkills.length || !selectedMbti) {
      setError("Please select at least one RIASEC item, one skill, and one MBTI type.");
      setHasGenerated(false);
      return;
    }
    setError("");
    setHasGenerated(true);
  }

  return (
    <div className="page-stack">
      <section className="glass-card analysis-top" data-reveal>
        <div className="section-heading">
          <h1>Career Analysis</h1>
          <p>
            Choose your RIASEC profile, skills, and MBTI to generate suitable job opportunities.
          </p>
        </div>
        <div className="hero-actions">
          <a className="btn btn-soft" href={RIASEC_TEST_URL} target="_blank" rel="noreferrer">
            Take RIASEC Test
          </a>
          <a className="btn btn-soft" href={MBTI_TEST_URL} target="_blank" rel="noreferrer">
            Take MBTI Test
          </a>
        </div>
      </section>

      <section className="analysis-grid">
        <article className="glass-card selector-card" data-reveal>
          <h2>1. RIASEC Selection</h2>
          <p className="muted">Pick up to 3 letters that best represent your interests.</p>
          <div className="choice-grid">
            {RIASEC_OPTIONS.map((item) => (
              <button
                type="button"
                key={item.letter}
                className={
                  selectedRiasec.includes(item.letter) ? "choice-chip active" : "choice-chip"
                }
                onClick={() => toggleRiasec(item.letter)}
              >
                <strong>{item.letter}</strong> {item.name}
              </button>
            ))}
          </div>
          <p className="muted">Selected: {selectedRiasec.join(", ") || "None"}</p>
        </article>

        <article className="glass-card selector-card" data-reveal>
          <h2>2. Skills Selection</h2>
          <p className="muted">Choose as many skills as you have confidence in.</p>
          <input
            className="input-field"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter skills..."
          />
          <div className="choice-grid skills-grid">
            {skillOptions.map((skill) => (
              <button
                type="button"
                key={skill}
                className={selectedSkills.includes(skill) ? "choice-chip active" : "choice-chip"}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
          <p className="muted">Selected: {selectedSkills.length}</p>
        </article>

        <article className="glass-card selector-card" data-reveal>
          <h2>3. MBTI Selection</h2>
          <p className="muted">Choose your MBTI type.</p>
          <div className="mbti-grid">
            {MBTI_OPTIONS.map((mbti) => (
              <button
                type="button"
                key={mbti}
                className={selectedMbti === mbti ? "choice-chip active" : "choice-chip"}
                onClick={() => setSelectedMbti(mbti)}
              >
                {mbti}
              </button>
            ))}
          </div>
          <p className="muted">Selected: {selectedMbti || "None"}</p>
        </article>
      </section>

      <section className="glass-card output-card" data-reveal>
        <div className="output-head">
          <h2>Suitable Opportunities</h2>
          <button className="btn btn-solid" type="button" onClick={handleGenerate}>
            Generate Opportunities
          </button>
        </div>

        {error ? <p className="error-text">{error}</p> : null}

        {hasGenerated && !recommendations.length ? (
          <p className="muted">
            No high-fit matches found from current selections. Try adding more skills or adjusting
            your RIASEC/MBTI choices.
          </p>
        ) : null}

        {hasGenerated && recommendations.length ? (
          <div className="results-grid">
            {recommendations.map((item) => (
              <article key={item.title} className="job-result glass-lite">
                <div className="result-top">
                  <h3>{item.title}</h3>
                  <span>{item.score}% fit</span>
                </div>
                <div className="score-track">
                  <div className="score-fill" style={{ width: `${item.score}%` }} />
                </div>
                <p>{item.summary}</p>
                <p className="muted">
                  RIASEC: {item.matchedRiasec.join(", ") || "none"} | Skills:{" "}
                  {item.matchedSkills.join(", ") || "none"} | MBTI: {item.matchedMbti || "none"}
                </p>
                <a className="result-link" href={item.link} target="_blank" rel="noreferrer">
                  View Openings
                </a>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
