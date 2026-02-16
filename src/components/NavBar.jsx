const NAV_ITEMS = [
  { route: "home", label: "Home", href: "#/home" },
  { route: "analysis", label: "Analysis", href: "#/analysis" },
  { route: "about", label: "About Us", href: "#/about" }
];

export default function NavBar({ route, theme, onThemeToggle }) {
  return (
    <header className="site-header glass-card">
      <a className="brand-mark" href="#/home">
        <span className="brand-dot" />
        Career Compass
      </a>
      <nav className="top-nav" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.route}
            href={item.href}
            className={route === item.route ? "nav-link active" : "nav-link"}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <button
          className="theme-toggle"
          type="button"
          onClick={onThemeToggle}
          aria-pressed={theme === "dark"}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          Theme
        </button>
        <a className="header-cta" href="#/analysis">
          Get Started
        </a>
      </div>
    </header>
  );
}
