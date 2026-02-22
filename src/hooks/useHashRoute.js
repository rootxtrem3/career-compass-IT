import { useEffect, useMemo, useState } from 'react';

const VALID_ROUTES = new Set(['home', 'analysis', 'paths', 'about', 'login']);

function getRouteFromHash() {
  const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
  if (!hash) return 'home';
  return VALID_ROUTES.has(hash) ? hash : 'home';
}

export function useHashRoute() {
  const [route, setRoute] = useState(getRouteFromHash);

  useEffect(() => {
    const handleRouteChange = () => setRoute(getRouteFromHash());
    window.addEventListener('hashchange', handleRouteChange);
    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, []);

  const navigate = useMemo(
    () => (value) => {
      const nextRoute = VALID_ROUTES.has(value) ? value : 'home';
      window.location.hash = `/${nextRoute}`;
    },
    []
  );

  return { route, navigate };
}
