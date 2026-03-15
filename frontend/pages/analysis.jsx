import { useEffect, useMemo, useState } from "react";
import { Button, LinearProgress } from "@mui/material";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import GradeRoundedIcon from "@mui/icons-material/GradeRounded";
import HandymanRoundedIcon from "@mui/icons-material/HandymanRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import GlassCard from "../components/GlassCard";
import Layout from "../components/Layout";
import { fetcher } from "../utils/api.js";

const riasec = [
  {
    code: "R",
    name: "Realistic",
    description: "Hands-on, practical, and tool-oriented work.",
    icon: <HandymanRoundedIcon className="chip-icon" />
  },
  {
    code: "I",
    name: "Investigative",
    description: "Research, analysis, and scientific problem-solving.",
    icon: <ScienceRoundedIcon className="chip-icon" />
  },
  {
    code: "A",
    name: "Artistic",
    description: "Creative, expressive, and design-centered work.",
    icon: <PaletteRoundedIcon className="chip-icon" />
  },
  {
    code: "S",
    name: "Social",
    description: "Helping, teaching, and people-focused work.",
    icon: <GroupsRoundedIcon className="chip-icon" />
  },
  {
    code: "E",
    name: "Enterprising",
    description: "Leadership, persuasion, and business strategy.",
    icon: <RocketLaunchRoundedIcon className="chip-icon" />
  },
  {
    code: "C",
    name: "Conventional",
    description: "Organized, detail-oriented, and structured work.",
    icon: <Inventory2RoundedIcon className="chip-icon" />
  }
];

const mbti = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP"
].map((code) => ({ code, title: code }));

const fallbackLookups = {
  riasec,
  mbti,
  skills: []
};

export default function AnalysisPage() {
  const [lookups, setLookups] = useState(fallbackLookups);
  const [selectedRiasec, setSelectedRiasec] = useState([]);
  const [selectedMbti, setSelectedMbti] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetcher("/skills")
      .then((data) => {
        if (!cancelled) setLookups((current) => ({ ...current, skills: data }));
      })
      .catch(() => {
        if (!cancelled) setLookups((current) => ({ ...current, skills: [] }));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const progress = useMemo(() => {
    const riasecScore = Math.min(selectedRiasec.length / 3, 1);
    const mbtiScore = selectedMbti ? 1 : 0;
    const skillsScore = Math.min(selectedSkills.length / 5, 1);
    return Math.round((riasecScore * 0.4 + mbtiScore * 0.2 + skillsScore * 0.4) * 100);
  }, [selectedRiasec, selectedMbti, selectedSkills]);

  function toggleRiasec(code) {
    setSelectedRiasec((current) => {
      if (current.includes(code)) return current.filter((item) => item !== code);
      if (current.length >= 3) return [...current.slice(1), code];
      return [...current, code];
    });
  }

  function toggleSkill(id) {
    setSelectedSkills((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  const filteredSkills = useMemo(() => {
    const query = skillSearch.trim().toLowerCase();
    if (!query) return lookups.skills.slice(0, 5);
    return lookups.skills.filter((item) => item.name.toLowerCase().includes(query));
  }, [skillSearch, lookups.skills]);

  async function runAnalysis() {
    setError("");

    if (!selectedRiasec.length || !selectedMbti || !selectedSkills.length) {
      setError("Please choose at least one RIASEC code, one MBTI type, and one skill.");
      return;
    }

    setLoading(true);
    try {
      const riasecCode = selectedRiasec.join("");
      await fetcher("/assessments", {
        method: "POST",
        body: JSON.stringify({ mbti_result: selectedMbti, riasec_result: riasecCode })
      });

      await fetcher("/skills/user", {
        method: "POST",
        body: JSON.stringify({
          skills: selectedSkills.map((id) => ({ skill_id: id, level: 3 }))
        })
      });

      const data = await fetcher("/careers/recommendations", { method: "POST" });
      setResults(data);
    } catch (err) {
      setError(err?.message || "Unable to analyze career fit.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="page-stack">
        <GlassCard className="content-card fade-up" as="section">
          <p className="eyebrow">Hybrid Scoring Engine</p>
          <h1>Career fit analysis</h1>
          <p>
            Weighted scoring combines skills, RIASEC alignment, and MBTI signals to output ranked
            matches. Results include fit scores and skill gaps.
          </p>
          <div className="hero-actions">
            <Button
              component="a"
              href="https://www.16personalities.com/"
              target="_blank"
              rel="noreferrer"
              variant="outlined"
              className="m3-btn soft"
            >
              Take MBTI Test
            </Button>
            <Button
              component="a"
              href="https://www.truity.com/test/holland-code-career-test"
              target="_blank"
              rel="noreferrer"
              variant="outlined"
              className="m3-btn soft"
            >
              Take RIASEC Test
            </Button>
          </div>
        </GlassCard>

        <section className="card-grid dual">
          <GlassCard className="content-card card-tilt fade-up">
            <div className="section-head-row">
              <h2>1. Choose RIASEC (max 3)</h2>
              <PsychologyRoundedIcon />
            </div>
            <div className="choice-grid">
              {lookups.riasec.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={selectedRiasec.includes(item.code) ? "choice-chip active" : "choice-chip"}
                  onClick={() => toggleRiasec(item.code)}
                  aria-pressed={selectedRiasec.includes(item.code)}
                  data-tooltip={`${item.code} · ${item.name}: ${item.description}`}
                >
                  {item.icon}
                  {item.code} · {item.name}
                </button>
              ))}
            </div>
            <p className="muted">Selected: {selectedRiasec.join(", ") || "None"}</p>
          </GlassCard>

          <GlassCard className="content-card card-tilt fade-up" style={{ animationDelay: "0.1s" }}>
            <div className="section-head-row">
              <h2>2. Choose MBTI</h2>
            </div>
            <div className="choice-grid">
              {lookups.mbti.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={selectedMbti === item.code ? "choice-chip active" : "choice-chip"}
                  onClick={() => setSelectedMbti(item.code)}
                  aria-pressed={selectedMbti === item.code}
                >
                  {item.title}
                </button>
              ))}
            </div>
            <p className="muted">Selected: {selectedMbti || "None"}</p>
          </GlassCard>
        </section>

        <GlassCard className="content-card fade-up" as="section">
          <div className="section-head-row">
            <div>
              <p className="eyebrow">Skillset</p>
              <h2>3. Choose Skills</h2>
            </div>
            <AutoGraphRoundedIcon />
          </div>
          <input
            className="input-field"
            placeholder="Filter skills"
            value={skillSearch}
            onChange={(event) => setSkillSearch(event.target.value)}
          />
          <div className="choice-grid">
            {filteredSkills.map((item) => (
              <button
                key={item.id}
                type="button"
                className={selectedSkills.includes(item.id) ? "choice-chip active" : "choice-chip"}
                onClick={() => toggleSkill(item.id)}
                aria-pressed={selectedSkills.includes(item.id)}
              >
                <GradeRoundedIcon className="chip-icon" />
                {item.name}
              </button>
            ))}
          </div>
          <p className="muted">Selected: {selectedSkills.length} skill(s)</p>
        </GlassCard>

        <GlassCard className="content-card fade-up" as="section">
          <div className="section-head-row">
            <div className="section-head-left">
              <h2>Recommendations</h2>
              <InsightsRoundedIcon />
            </div>
            <Button
              type="button"
              variant="contained"
              className="m3-btn"
              onClick={runAnalysis}
            >
              {loading ? "Analyzing..." : "Generate"}
            </Button>
          </div>
          {error ? <p className="muted">{error}</p> : null}
          {!results.length && !error ? (
            <p className="muted">No recommendations yet. Use Generate to run analysis.</p>
          ) : null}
          <div className="results-grid">
            {results.slice(0, 6).map((item) => (
              <div key={item.id} className="glass-soft result-card">
                <div className="section-head-row">
                  <h3>{item.title}</h3>
                  <span>{item.compatibility_score ?? "—"}%</span>
                </div>
                <p className="muted">{item.description}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="content-card fade-up" as="section">
          <div className="section-head-row">
            <div>
              <p className="eyebrow">Progress tracker</p>
              <h2>Readiness score</h2>
            </div>
            <TrackChangesRoundedIcon />
          </div>
          <LinearProgress variant="determinate" value={progress} className="progress-bar" />
          <p className="muted">
            {progress}% complete based on selected RIASEC codes, MBTI, and skillset coverage.
          </p>
        </GlassCard>
      </div>
    </Layout>
  );
}
