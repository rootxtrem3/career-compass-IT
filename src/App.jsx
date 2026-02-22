import { useEffect, useState } from 'react';
import { NavBar } from './components/layout/NavBar.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { useHashRoute } from './hooks/useHashRoute.js';
import { AboutPage } from './pages/AboutPage.jsx';
import { AnalysisPage } from './pages/AnalysisPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { PathsPage } from './pages/PathsPage.jsx';

const THEME_KEY = 'career_compass_theme';

function getInitialTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const { route } = useHashRoute();
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <div className="site-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <NavBar
        route={route}
        user={user}
        onLogout={logout}
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      />

      <main className="page-wrap">
        {route === 'analysis' ? <AnalysisPage /> : null}
        {route === 'paths' ? <PathsPage /> : null}
        {route === 'about' ? <AboutPage /> : null}
        {route === 'login' ? <LoginPage /> : null}
        {route === 'home' ? <HomePage /> : null}
      </main>

      <footer className="site-footer">
        <p>Career Compass · Intelligent job matching with MBTI, RIASEC, and skills.</p>
      </footer>
    </div>
  );
}
