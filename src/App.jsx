import { useEffect, useMemo, useState } from "react";
import NavBar from "./components/NavBar.jsx";
import HomePage from "./pages/HomePage.jsx";
import AnalysisPage from "./pages/AnalysisPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";

const VALID_ROUTES = new Set(["home", "analysis", "about"]);

function getRouteFromHash() {
  const hash = window.location.hash.replace(/^#\/?/, "").toLowerCase().trim();
  if (!hash) return "home";
  return VALID_ROUTES.has(hash) ? hash : "home";
}

export default function App() {
  const [route, setRoute] = useState(getRouteFromHash());

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const revealNodes = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!revealNodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
    );

    revealNodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [route]);

  const currentPage = useMemo(() => {
    if (route === "analysis") return <AnalysisPage />;
    if (route === "about") return <AboutPage />;
    return <HomePage />;
  }, [route]);

  return (
    <div className="site-shell">
      <div className="backdrop-glow backdrop-glow-a" />
      <div className="backdrop-glow backdrop-glow-b" />
      <NavBar route={route} />
      <main className="page-wrap">{currentPage}</main>
    </div>
  );
}
