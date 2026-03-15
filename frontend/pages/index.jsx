import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button } from "@mui/material";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import PsychologyIcon from "@mui/icons-material/Psychology";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import GlassCard from "../components/GlassCard";
import Layout from "../components/Layout";
import { fetcher } from "../utils/api.js";

const goals = [
  {
    title: "Personality-guided direction",
    body: "Translate MBTI and RIASEC preferences into practical job paths you can apply for now.",
    icon: <PsychologyIcon />
  },
  {
    title: "Skill-first recommendations",
    body: "Prioritize roles where your existing skills are strongest and identify missing requirements.",
    icon: <AutoGraphIcon />
  },
  {
    title: "Application acceleration",
    body: "Attach live openings from aggregated sources to every career recommendation.",
    icon: <WorkOutlineIcon />
  }
];

const stats = [
  { label: "Avg. salary uplift", value: "24%" },
  { label: "Roles tracked", value: "1.2k+" },
  { label: "New postings / day", value: "6,400" }
];

const fallbackJobs = [
  { title: "Data Analyst", company: "Northwind Labs", location: "Remote", posted_at: "2026-03-01" },
  { title: "Product Manager", company: "Skyline Health", location: "Austin, TX", posted_at: "2026-03-02" },
  { title: "UX Designer", company: "Studio Nova", location: "Seattle, WA", posted_at: "2026-03-03" }
];

const roadmap = [
  "Select your RIASEC profile (up to 3 dimensions).",
  "Choose your MBTI personality type.",
  "Select your strongest skills.",
  "Review weighted career matches and skill gaps.",
  "Open linked opportunities and apply with confidence."
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
      setJobsError("Unable to sync jobs from Adzuna.");
    } finally {
      setSyncing(false);
    }
  }

  async function trackJob(jobId) {
    try {
      await fetcher(`/jobs/${jobId}/track`, { method: "POST" });
      window.location.href = "/paths";
    } catch {
      setJobsError("Unable to track this job yet.");
    }
  }

  return (
    <Layout>
      <div className="page-stack">
        <GlassCard className="content-card hero fade-up" as="section">
          <p className="eyebrow">Career Compass Platform</p>
          <h1>Navigate careers with personality intelligence and skill evidence.</h1>
          <p>
            Career Compass is a guidance platform designed to improve job-search quality by combining
            MBTI, RIASEC, and skill matching into clear, ranked recommendations.
          </p>
          <div className="hero-actions">
            <Button component={Link} href="/analysis" variant="contained" className="m3-btn">
              Analyze My Career Fit
            </Button>
            <Button component={Link} href="/about" variant="outlined" className="m3-btn soft">
              About Career Compass
            </Button>
          </div>
        </GlassCard>

        <section className="card-grid triple" aria-label="Platform goals">
          {goals.map((goal, index) => (
            <GlassCard
              key={goal.title}
              className="content-card card-tilt fade-up"
              style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {goal.icon}
                <h2>{goal.title}</h2>
              </Box>
              <p>{goal.body}</p>
            </GlassCard>
          ))}
        </section>

        <GlassCard className="content-card fade-up" as="section">
          <div className="section-head-row">
            <div>
              <p className="eyebrow">Global Snapshot</p>
              <h2>Current world career statistics</h2>
            </div>
          </div>
          <div className="card-grid triple">
            {stats.map((item) => (
              <div key={item.label} className="glass-soft content-card">
                <h3>{item.value}</h3>
                <p className="muted">{item.label}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="content-card fade-up" as="section">
          <div className="section-head-row">
            <div>
              <p className="eyebrow">Live Opportunities</p>
              <h2>Aggregated job listings</h2>
            </div>
            <Button type="button" variant="outlined" className="m3-btn soft" onClick={syncJobs}>
              {syncing ? "Syncing..." : "Sync Jobs API"}
            </Button>
          </div>
          {jobsError ? <p className="muted">{jobsError}</p> : null}
          <div className="job-list">
            {jobs.map((job) => (
              <article key={`${job.title}-${job.company}`} className="job-row glass-soft">
                <div>
                  <h3>{job.title}</h3>
                  <p className="muted">
                    {job.company} · {job.location}
                  </p>
                  {job.posted_at ? (
                    <p className="muted">
                      Posted: <strong>{new Date(job.posted_at).toLocaleDateString()}</strong>
                    </p>
                  ) : null}
                </div>
                <div className="job-actions">
                  <Button component={Link} href="/paths" variant="outlined" className="m3-btn soft">
                    View Path
                  </Button>
                  <Button component={Link} href="/analysis" variant="outlined" className="m3-btn soft">
                    Analyze Fit
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    className="m3-btn"
                    onClick={() => trackJob(job.id)}
                  >
                    Track
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="content-card fade-up" as="section">
          <p className="eyebrow">How it works</p>
          <h2>Minimal process, high-signal output</h2>
          <ol className="flow-list">
            {roadmap.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </GlassCard>
      </div>
    </Layout>
  );
}
