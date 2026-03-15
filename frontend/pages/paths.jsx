import { useEffect, useMemo, useState } from "react";
import { Button, LinearProgress } from "@mui/material";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";
import GlassCard from "../components/GlassCard";
import Layout from "../components/Layout";
import { fetcher } from "../utils/api.js";

export default function PathsPage() {
  const [paths, setPaths] = useState([]);
  const [goal, setGoal] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trackingId, setTrackingId] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        await fetcher("/auth/sync", { method: "POST" });
        const [pathsData, progress] = await Promise.all([
          fetcher("/careers"),
          fetcher("/progress")
        ]);
        if (!cancelled) {
          setPaths(pathsData);
          setGoal(progress.goal);
          setMilestones(progress.milestones || []);
          setError("");
        }
      } catch (err) {
        if (!cancelled) setError("Unable to load career paths.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const progressValue = useMemo(() => {
    if (!milestones.length) return 0;
    const completed = milestones.filter((item) => item.completed_at).length;
    return Math.round((completed / milestones.length) * 100);
  }, [milestones]);

  async function trackPath(careerId) {
    setTrackingId(careerId);
    await fetcher("/progress/goal", {
      method: "POST",
      body: JSON.stringify({ career_id: careerId })
    });
    const updated = await fetcher("/progress");
    setGoal(updated.goal);
    setMilestones(updated.milestones || []);
    setTrackingId("");
  }

  async function untrackPath() {
    setTrackingId("untrack");
    await fetcher("/progress/untrack", { method: "POST" });
    const updated = await fetcher("/progress");
    setGoal(updated.goal);
    setMilestones(updated.milestones || []);
    setTrackingId("");
  }

  async function toggleMilestone(milestoneId, completed) {
    await fetcher("/progress/milestone", {
      method: "POST",
      body: JSON.stringify({ milestone_id: milestoneId, completed })
    });
    const updated = await fetcher("/progress");
    setGoal(updated.goal);
    setMilestones(updated.milestones || []);
  }

  return (
    <Layout>
      <div className="page-stack">
        <GlassCard className="content-card fade-up" as="section">
          <p className="eyebrow">Career Paths</p>
          <h1>Skills, requirements, and your path checklist</h1>
          <p>
            Review requirements per role, then create a personal checklist to track progress for your
            selected path.
          </p>
          <input className="input-field" placeholder="Search paths (e.g. data, design, analyst)" />
          <p className="muted">
            {loading ? "Loading paths..." : `${paths.length} career path(s) found`}
          </p>
        </GlassCard>

        {error ? <p className="muted">{error}</p> : null}

        <section className="card-grid dual">
          {paths.map((path, index) => (
            <GlassCard
              key={path.id}
              className="content-card card-tilt fade-up"
              style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
            >
              <div className="section-head-row">
                <div className="section-head-left">
                  <WorkspacesRoundedIcon />
                  <h2>{path.title}</h2>
                </div>
                <span className="muted">{path.demand_level || "Standard"}</span>
              </div>
              <p>{path.description}</p>
              <p className="muted">
                Salary range:{" "}
                {path.salary_min && path.salary_max
                  ? `$${path.salary_min.toLocaleString()} - $${path.salary_max.toLocaleString()}`
                  : "Not specified"}
              </p>

              {goal?.id === path.id ? (
                <Button
                  type="button"
                  variant="contained"
                  className="m3-btn"
                  onClick={untrackPath}
                  disabled={trackingId === "untrack"}
                  startIcon={<RouteRoundedIcon />}
                >
                  Untrack path
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outlined"
                  className="m3-btn soft"
                  onClick={() => trackPath(path.id)}
                  disabled={trackingId === path.id}
                  startIcon={<RouteRoundedIcon />}
                >
                  Track this path
                </Button>
              )}
            </GlassCard>
          ))}
        </section>

        <GlassCard className="content-card fade-up" as="section">
          <div className="section-head-row">
            <div className="section-head-left">
              <CheckCircleRoundedIcon />
              <h2>My checklist ({progressValue}% complete)</h2>
            </div>
          </div>
          {goal ? (
            <>
              <p className="muted">Active path: {goal.title}</p>
              <LinearProgress variant="determinate" value={progressValue} className="progress-bar" />
              <ul className="tag-list">
                {milestones.map((item) => (
                  <li key={item.id}>
                    <label className="check-item">
                      <input
                        type="checkbox"
                        checked={Boolean(item.completed_at)}
                        onChange={(event) => toggleMilestone(item.id, event.target.checked)}
                      />
                      <span>{item.title}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="muted">Select a career path to begin tracking.</p>
          )}
        </GlassCard>
      </div>
    </Layout>
  );
}
