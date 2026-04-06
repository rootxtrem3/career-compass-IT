import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import GlassCard from "../components/GlassCard";
import Layout from "../components/Layout";
import { fetcher } from "../utils/api.js";

const pillars = [
  {
    title: "Discovery Engine",
    body: "Combine MBTI, RIASEC, and skills into ranked career matches with explainable scoring.",
    icon: <PsychologyIcon />
  },
  {
    title: "Actionable Path Cards",
    body: "Break every role into requirements, salary signals, demand levels, and next steps.",
    icon: <HubRoundedIcon />
  },
  {
    title: "Persistent Progress",
    body: "Turn gaps into a living checklist users can revisit across sessions and devices.",
    icon: <ChecklistRoundedIcon />
  }
];

const problemPoints = [
  "Blind applications and career mismatch",
  "Fragmented information across many websites",
  "No persistent progress once research sessions end"
];

const architecture = [
  { label: "Hybrid matching", value: "50/30/20", note: "Skills, RIASEC, MBTI" },
  { label: "Core stack", value: "React + Express", note: "Decoupled client and API" },
  { label: "Data layer", value: "PostgreSQL", note: "Relational scoring and persistence" },
  { label: "Auth layer", value: "Firebase", note: "JWT-based secure access" }
];

const timeline = [
  "Weeks 1-2: proposal, architecture, wireframes, and ERD.",
  "Weeks 3-4: scaffold frontend/backend and build the assessment flow.",
  "Weeks 5-8: implement recommendation logic, API integration, and persistence.",
  "Weeks 9-12: testing, optimization, documentation, and deployment readiness."
];

const fallbackJobs = [
  { title: "Junior Data Analyst", location: "Remote", posted_at: "2026-03-01" },
  { title: "UX Research Assistant", location: "Addis Ababa", posted_at: "2026-03-02" },
  { title: "Operations Associate", location: "Hybrid", posted_at: "2026-03-03" }
];

export default function HomePage() {
  const [jobs, setJobs] = useState(fallbackJobs);
  const [jobsError, setJobsError] = useState("");
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetcher("/jobs?limit=6");
        if (!cancelled) setJobs(data);
      } catch {
        if (!cancelled) setJobsError("Unable to load live job data.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function syncJobs() {
    setSyncing(true);
    setJobsError("");
    try {
      await fetcher("/jobs/sync", { method: "POST" });
      const data = await fetcher("/jobs?limit=6");
      setJobs(data);
    } catch {
      setJobsError("Unable to sync jobs from the external jobs API.");
    } finally {
      setSyncing(false);
    }
  }

  function buildSearchUrl(job) {
    const query = encodeURIComponent(`${job.title} ${job.location || ""}`.trim());
    return `https://www.google.com/search?q=${query}`;
  }

  return (
    <Layout>
      <div className="page-stack">
        <GlassCard className="content-card hero fade-up" as="section">
          <p className="eyebrow">Career Compass Proposal Site</p>
          <h1>Career direction built from personality, skills, and live labor-market evidence.</h1>
          <p>
            This platform is designed for high school students, university students, and graduates
            who need more than a static job board. Career Compass addresses mismatch, fragmented
            research, and lost progress by turning assessment data into practical, trackable paths.
          </p>
          <div className="hero-actions">
            <Button component={Link} href="/analysis" variant="contained" className="m3-btn">
              Start the analysis
            </Button>
            <Button component={Link} href="/about" variant="outlined" className="m3-btn soft">
              Read the project brief
            </Button>
          </div>
        </GlassCard>

        <section className="card-grid triple" aria-label="Core solution pillars">
          {pillars.map((pillar, index) => (
            <GlassCard
              key={pillar.title}
              className="content-card card-tilt fade-up"
              style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
            >
              <div className="section-head-left">
                {pillar.icon}
                <h2>{pillar.title}</h2>
              </div>
              <p>{pillar.body}</p>
            </GlassCard>
          ))}
        </section>

        <section className="card-grid dual">
          <GlassCard className="content-card fade-up" as="section">
            <p className="eyebrow">Problem statement</p>
            <h2>Why the project exists</h2>
            <ul className="flow-list">
              {problemPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="muted">
              The proposal frames Career Compass as a response to underemployment and uninformed job
              targeting, both in Ethiopia and beyond.
            </p>
          </GlassCard>

          <GlassCard className="content-card fade-up" as="section" style={{ animationDelay: "0.1s" }}>
            <p className="eyebrow">Main objective</p>
            <h2>Deliver a production-ready MVP</h2>
            <p>
              The proposed MVP centralizes personality assessment, skill matching, live jobs,
              explainable recommendations, and secure long-term progress tracking in one platform.
            </p>
            <Button component={Link} href="/paths" variant="outlined" className="m3-btn soft">
              View action paths
            </Button>
          </GlassCard>
        </section>

        <GlassCard className="content-card fade-up" as="section">
          <div className="section-head-row">
            <div>
              <p className="eyebrow">Technical shape</p>
              <h2>Architecture from the proposal</h2>
            </div>
            <TimelineRoundedIcon />
          </div>
          <div className="card-grid triple">
            {architecture.map((item) => (
              <div key={item.label} className="glass-soft content-card compact-card">
                <h3>{item.value}</h3>
                <p>{item.label}</p>
                <p className="muted">{item.note}</p>
              </div>
            ))}
          </div>
          <div className="tag-row">
            <span className="info-pill"><StorageRoundedIcon fontSize="inherit" /> Persistent data</span>
            <span className="info-pill"><SecurityRoundedIcon fontSize="inherit" /> Secure auth flow</span>
            <span className="info-pill"><HubRoundedIcon fontSize="inherit" /> Decoupled client-server</span>
          </div>
        </GlassCard>

        <GlassCard className="content-card fade-up" as="section">
          <div className="section-head-row">
            <div>
              <p className="eyebrow">Live opportunities</p>
              <h2>Job listings used to ground the recommendations</h2>
            </div>
            <Button type="button" variant="outlined" className="m3-btn soft" onClick={syncJobs}>
              {syncing ? "Syncing..." : "Refresh jobs"}
            </Button>
          </div>
          <p className="muted">
            These entries are role search prompts, not direct employer postings. Use them to search
            the market and compare openings yourself.
          </p>
          {jobsError ? <p className="muted">{jobsError}</p> : null}
          <div className="job-list">
            {jobs.map((job) => (
              <article key={`${job.title}-${job.location}`} className="job-row glass-soft">
                <div>
                  <h3>{job.title}</h3>
                  <p className="muted">Search market demand for this role in {job.location || "your region"}.</p>
                  {job.posted_at ? (
                    <p className="muted">
                      Reference date: <strong>{new Date(job.posted_at).toLocaleDateString()}</strong>
                    </p>
                  ) : null}
                </div>
                <div className="job-actions">
                  <Button
                    component="a"
                    href={buildSearchUrl(job)}
                    target="_blank"
                    rel="noreferrer"
                    variant="contained"
                    className="m3-btn"
                  >
                    Search this role
                  </Button>
                  <Button component={Link} href="/analysis" variant="outlined" className="m3-btn soft">
                    Analyze fit
                  </Button>
                  <Button component={Link} href="/paths" variant="outlined" className="m3-btn soft">
                    Open paths
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="content-card fade-up" as="section">
          <p className="eyebrow">12-week agile plan</p>
          <h2>Implementation roadmap</h2>
          <ol className="flow-list">
            {timeline.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </GlassCard>
      </div>
    </Layout>
  );
}
