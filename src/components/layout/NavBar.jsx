const navItems = [
  { id: 'home', label: 'Home', href: '#/home' },
  { id: 'analysis', label: 'Analysis', href: '#/analysis' },
  { id: 'paths', label: 'Paths', href: '#/paths' },
  { id: 'about', label: 'About', href: '#/about' },
  { id: 'login', label: 'Login', href: '#/login' }
];

export function NavBar({ route, user, onLogout, theme, onToggleTheme }) {
  return (
    <header className="site-header glass-card">
      <a className="brand" href="#/home" aria-label="Career Compass home">
        <span className="brand-orb" />
        <span>
          Career Compass
          <small>Career Navigation Platform</small>
        </span>
      </a>

      <nav className="top-nav" aria-label="Primary">
        {navItems.map((item) => (
          <a key={item.id} className={route === item.id ? 'nav-link active' : 'nav-link'} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="auth-actions">
        <button type="button" className="btn btn-soft theme-toggle" onClick={onToggleTheme}>
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
        {user ? (
          <>
            <p className="user-pill">{user.email}</p>
            <button type="button" className="btn btn-soft" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <a href="#/login" className="btn btn-soft">Sign In</a>
        )}
        <a href="#/analysis" className="btn btn-solid">
          Start Analysis
        </a>
      </div>
    </header>
  );
}
