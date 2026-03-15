import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import GlassCard from "../components/GlassCard";
import Layout from "../components/Layout";
import { auth, googleProvider } from "../utils/firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  getRedirectResult,
  signInWithRedirect
} from "firebase/auth";
import { fetcher } from "../utils/api.js";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isFirebaseConfigured =
    Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) &&
    Boolean(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) &&
    Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

  async function syncUser(token) {
    await fetcher("/auth/sync", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    getRedirectResult(auth)
      .then(async (result) => {
        if (!result?.user) return;
        const token = await result.user.getIdToken();
        window.localStorage.setItem("cc-token", token);
        await syncUser(token);
        window.location.href = "/profile";
      })
      .catch(() => {
        // Ignore redirect errors (popup flow may be used)
      });
  }, [isFirebaseConfigured]);

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);
    try {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const token = await result.user.getIdToken();
        window.localStorage.setItem("cc-token", token);
        await syncUser(token);
        window.location.href = "/profile";
      } catch {
        await signInWithRedirect(auth, googleProvider);
      }
    } catch (err) {
      setError(err?.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      let userCredential;
      if (mode === "register") {
        userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        if (form.fullName) {
          await updateProfile(userCredential.user, { displayName: form.fullName });
        }
      } else {
        userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      }

      const token = await userCredential.user.getIdToken();
      window.localStorage.setItem("cc-token", token);
      await syncUser(token);
      window.location.href = "/profile";
    } catch (err) {
      setError(err?.message || "Email sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="login-wrap">
        <GlassCard className="content-card login-hero fade-up" as="section">
          <p className="eyebrow">Authentication</p>
          <h1>Welcome back to Career Compass</h1>
          <p>
            Use Google sign-in for the fastest access, or continue with email and password as a
            fallback.
          </p>

          {!isFirebaseConfigured ? (
            <p className="muted">Firebase is not configured. Set `NEXT_PUBLIC_FIREBASE_*` vars.</p>
          ) : null}

          <Button
            type="button"
            variant="contained"
            className="m3-btn google-btn"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            disabled={!isFirebaseConfigured || loading}
          >
            {loading ? "Signing in..." : "Continue with Google"}
          </Button>

          <div className="login-divider">or continue with email</div>

          <div className="choice-grid">
            <button
              type="button"
              className={mode === "login" ? "choice-chip active" : "choice-chip"}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === "register" ? "choice-chip active" : "choice-chip"}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          <form className="login-form" onSubmit={handleEmailSubmit}>
            {mode === "register" ? (
              <label className="muted">
                Full name
                <input
                  className="input-field"
                  type="text"
                  placeholder="Your name"
                  value={form.fullName}
                  onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                />
              </label>
            ) : null}
            <label className="muted">
              Email
              <input
                className="input-field"
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                required
              />
            </label>
            <label className="muted">
              Password
              <input
                className="input-field"
                type="password"
                placeholder="••••••••"
                minLength={8}
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                required
              />
            </label>

            {error ? <p className="muted">{error}</p> : null}

            <Button
              type="submit"
              variant="outlined"
              className="m3-btn soft"
              disabled={!isFirebaseConfigured || loading}
            >
              {mode === "register" ? "Register with Email" : "Login with Email"}
            </Button>
          </form>
        </GlassCard>
      </div>
    </Layout>
  );
}
