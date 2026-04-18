import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, IconButton } from "@mui/material";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Navigation from "./Navigation";
import { auth } from "../utils/firebase.js";

export default function Layout({ children }) {
  const [theme, setTheme] = useState("light");
  const [activeModal, setActiveModal] = useState(null);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("cc-theme") : null;
    const initial = saved || "light";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);

    const cookies = window.localStorage.getItem("cc-cookies-accepted");
    setCookiesAccepted(cookies === "true");
  }, []);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, (user) => {
      setViewer(user);
      if (!user && typeof window !== "undefined") {
        window.localStorage.removeItem("cc-token");
      }
    });
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem("cc-theme", next);
  }

  function openModal(type) {
    setActiveModal(type);
  }

  function closeModal() {
    setActiveModal(null);
  }

  function acceptPolicy(type) {
    window.localStorage.setItem(`cc-${type}-accepted`, "true");
    setActiveModal(null);
  }

  function acceptCookies() {
    window.localStorage.setItem("cc-cookies-accepted", "true");
    setCookiesAccepted(true);
  }

  async function handleLogout() {
    if (auth) {
      await signOut(auth);
    }
    window.localStorage.removeItem("cc-token");
    window.location.href = "/";
  }

  return (
    <Box className="site-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <header className="site-header glass-soft">
        <div className="brand">
          <img src="/file.svg" alt="Career Compass Logo" style={{ width: '1.8rem', height: '1.8rem', objectFit: 'contain' }} />
          <div>
            Career Compass
            <small>Persona + Skills Intelligence</small>
          </div>
        </div>
        <Navigation />
        <div className="nav-actions">
          <IconButton
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="icon-toggle"
            size="small"
          >
            {theme === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
          </IconButton>
          {viewer ? (
            <>
              <Button
                component={Link}
                href="/profile"
                variant="outlined"
                className="m3-btn soft"
                startIcon={<PersonRoundedIcon />}
              >
                {viewer.displayName || viewer.email || "Profile"}
              </Button>
              <Button
                type="button"
                variant="contained"
                className="m3-btn"
                startIcon={<LogoutRoundedIcon />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button component={Link} href="/login" variant="contained" className="m3-btn">
              Login
            </Button>
          )}
        </div>
      </header>

      <main className="page-wrap">{children}</main>

      <footer className="site-footer">
        <button type="button" className="footer-link" onClick={() => openModal("privacy")}>
          Privacy Policy
        </button>
        <button type="button" className="footer-link" onClick={() => openModal("terms")}>
          Terms of Usage
        </button>
      </footer>

      {activeModal ? (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-card glass-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <h2>{activeModal === "privacy" ? "Privacy Policy" : "Terms of Usage"}</h2>
              <IconButton aria-label="Close" size="small" onClick={closeModal}>
                <CloseRoundedIcon />
              </IconButton>
            </div>
            <div className="modal-body">
            {activeModal === "privacy" ? (
              <>
                <p>
                  Career Compass collects profile, assessment, and skills data to generate
                  personalized career recommendations. Your assessment responses, saved careers, and
                  progress milestones are stored in Firebase-backed services for this build.
                </p>
                <p>
                  Authentication credentials are handled by Firebase Authentication. We never store
                  passwords on our servers. We use secure token verification for protected API
                  routes.
                </p>
                <p>
                  Job-market insights are sourced from public APIs. We cache market data to reduce
                  latency and provide faster insights. You may request deletion of your stored data
                  by contacting support.
                </p>
                <p>
                  Cookies are used to remember your theme preference and consent choices. You can
                  revoke consent by clearing local storage in your browser settings.
                </p>
              </>
            ) : (
              <>
                <p>
                  Career Compass provides informational guidance and does not guarantee employment
                  outcomes. You are responsible for verifying any career decisions and application
                  actions you take based on platform outputs.
                </p>
                <p>
                  By using the platform, you agree to provide accurate data and keep your account
                  secure. You are responsible for maintaining the confidentiality of any login
                  credentials.
                </p>
                <p>
                  You agree not to misuse the service, reverse engineer the recommendation logic, or
                  attempt to access restricted systems. We may suspend access for violations.
                </p>
                <p>
                  These terms may evolve as the platform changes. We will make reasonable efforts to
                  notify users of material updates.
                </p>
              </>
            )}
            </div>
            <div className="modal-actions">
              <Button variant="outlined" className="m3-btn soft" onClick={closeModal}>
                Close
              </Button>
              <Button
                variant="contained"
                className="m3-btn"
                onClick={() => acceptPolicy(activeModal)}
              >
                Accept &amp; Comply
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {!cookiesAccepted ? (
        <div className="cookie-banner glass-soft">
          <div>
            <strong>Cookie usage permission</strong>
            <p className="muted">
              We use cookies to remember your theme and consent preferences. By accepting, you agree
              to our cookie usage.
            </p>
          </div>
          <Button variant="contained" className="m3-btn" onClick={acceptCookies}>
            Accept Cookies
          </Button>
        </div>
      ) : null}
    </Box>
  );
}
