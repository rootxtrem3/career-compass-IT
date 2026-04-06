import { useEffect, useState } from "react";
import { Button, LinearProgress } from "@mui/material";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import GlassCard from "../components/GlassCard";
import Layout from "../components/Layout";
import { fetcher } from "../utils/api.js";

function formatPercent(value) {
  return typeof value === "number" ? `${value.toFixed(2)}%` : "—";
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        await fetcher("/auth/sync", { method: "POST" });
        const [userData, progressData, recs] = await Promise.all([
          fetcher("/users/me"),
          fetcher("/progress"),
          fetcher("/careers/recommendations", { method: "POST" })
        ]);
        if (!cancelled) {
          setProfile(userData);
          setProgress(progressData);
          setRecommendations(recs);
          setError("");
        }
      } catch (err) {
        if (!cancelled) setError("Unable to load profile data.");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const readiness =
    progress?.milestones?.length
      ? Number(
          (
          (progress.milestones.filter((item) => item.completed_at).length / progress.milestones.length) *
            100
          ).toFixed(2)
        )
      : 0;

  return (
    <Layout>
      <div className="page-stack">
        <GlassCard className="content-card fade-up" as="section">
          <p className="eyebrow">Profile Dashboard</p>
          <h1>History, progress, and current status</h1>
          {error ? <p className="muted">{error}</p> : null}
        </GlassCard>

        {profile ? (
          <section className="card-grid dual">
            <GlassCard className="content-card card-tilt fade-up">
              <div className="section-head-left">
                <BadgeRoundedIcon />
                <h2>Current status</h2>
              </div>
              <p>
                {profile.user.name || "User"} · {profile.user.email}
              </p>
              <p className="muted">
                MBTI: {profile.user.mbti_type || "Not set"} · RIASEC:{" "}
                {profile.user.riasec_code || "Not set"}
              </p>
              <p className="muted">Saved careers: {profile.saved_count}</p>
            </GlassCard>

            <GlassCard className="content-card card-tilt fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="section-head-left">
                <AutoGraphRoundedIcon />
                <h2>Progress</h2>
              </div>
              <p className="muted">
                Active goal: {progress?.goal?.title ? progress.goal.title : "No active goal"}
              </p>
              <LinearProgress variant="determinate" value={readiness} className="progress-bar" />
              <p className="muted">{formatPercent(readiness)} readiness</p>
            </GlassCard>
          </section>
        ) : null}

        <GlassCard className="content-card fade-up" as="section">
          <div className="section-head-left">
            <HistoryRoundedIcon />
            <h2>Recent assessment history</h2>
          </div>
          {profile?.recent_assessments?.length ? (
            <ul className="tag-list">
              {profile.recent_assessments.map((item, index) => (
                <li key={`${item.created_at}-${index}`}>
                  {item.mbti_result || "—"} · {item.riasec_result || "—"} ·{" "}
                  {new Date(item.created_at).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No assessments recorded yet.</p>
          )}
        </GlassCard>

        <GlassCard className="content-card fade-up" as="section">
          <div className="section-head-left">
            <AutoGraphRoundedIcon />
            <h2>Latest recommendations</h2>
          </div>
          {!recommendations.length ? (
            <p className="muted">Run the analysis to generate recommendations.</p>
          ) : (
            <div className="results-grid">
              {recommendations.slice(0, 4).map((item) => (
                <div key={item.id} className="glass-soft result-card">
                  <div className="section-head-row">
                    <h3>{item.title}</h3>
                    <span>{formatPercent(item.compatibility_score)}</span>
                  </div>
                  <p className="muted">{item.description}</p>
                </div>
              ))}
            </div>
          )}
          <Button variant="outlined" className="m3-btn soft" href="/analysis">
            Go to Analysis
          </Button>
        </GlassCard>
      </div>
    </Layout>
  );
}
