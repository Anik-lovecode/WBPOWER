import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { fetchPageConfig } from "../services/pageService";

// Component registry: lazy imports (code-splitting)
const ComponentRegistry = {
  Footer: React.lazy(()=> import("../components/user/Footer")),
  NavNew: React.lazy(()=> import("../blocks/NavNew")),
  OfficeInfo: React.lazy(() => import("../blocks/OfficeInfo")),
  ContactTable: React.lazy(() => import("../blocks/ContactTable")),
  MapSection: React.lazy(()=> import("../components/user/contact_us/MapSection"))
  // ContactForm: React.lazy(() => import("../blocks/ContactForm")),
  // add more as you create them...
};

export default function DynamicPage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [PageComponent, setPageComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const resolvedSlug = slug || "home";

  
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    // alert(resolvedSlug)
    // First attempt: look for a React page component file under src/pages/user matching the slug.
    // We use Vite's import.meta.glob to enumerate available files.
    const userPages = import.meta.glob("../pages/user/*.jsx");

    const toPascal = (s) =>
      s
        .split(/[-_\s]+/)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join("");

    const candidates = [
      // direct PascalCase: acts -> Acts
      toPascal(resolvedSlug),
      // original slug as-is (if file used lowercase)
      resolvedSlug,
      // hyphen/underscore variations
      resolvedSlug.replace(/[-\s]/g, ""),
    ];

    // try to find matching module path
    const matchedKey = Object.keys(userPages).find((k) => {
      // k example: '../pages/user/Acts.jsx'
      const base = k.split('/').pop().replace(/\.jsx?$/i, '');
      return candidates.some((c) => String(base).toLowerCase() === String(c).toLowerCase());
    });

    if (matchedKey) {
      // dynamic import the matching page component
      userPages[matchedKey]().then((mod) => {
        if (!mounted) return;
        setPageComponent(() => mod.default || null);
        setLoading(false);
      }).catch((err) => {
        console.error('Failed to load page component', err);
        // fallback to block based config
        fetchPageConfig(resolvedSlug)
          .then((c) => {
            if (!mounted) return;
            setConfig(c || [{ type: "Hero", props: { data: { title: "404 - Page not found" } } }]);
          })
          .catch((e) => console.error('fetch page error', e))
          .finally(() => mounted && setLoading(false));
      });
    } else {
      // No direct component file found — fallback to existing page config approach
      fetchPageConfig(resolvedSlug)
        .then((c) => {
          if (!mounted) return;
          if (!c) {
            setConfig([{ type: "Hero", props: { data: { title: "404 - Page not found" } } }]);
          } else {
            setConfig(c);
          }
        })
        .catch((err) => {
          console.error("fetch page error", err);
        })
        .finally(() => mounted && setLoading(false));
    }
    return () => (mounted = false);
  }, [resolvedSlug, location.pathname]);

  // Optionally, prefetch certain components on hover or link focus.

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  // If we resolved a page component file, render it directly
  if (PageComponent) {
    const Comp = PageComponent;
    return (
      <Suspense fallback={<div style={{ padding: 40 }}>Loading page…</div>}>
        <Comp />
      </Suspense>
    );
  }

  // otherwise render the block-based config
  return (
    <div>
      <Suspense fallback={<div style={{ padding: 40 }}>Loading block…</div>}>
        {Array.isArray(config)
          ? config.map((block, i) => {
              const BlockComp = ComponentRegistry[block.type];
              if (!BlockComp) return <div key={i}>Unknown block: {block.type}</div>;
              return <BlockComp key={i} {...(block.props || {})} />;
            })
          : <div>Page not found</div>}
      </Suspense>
    </div>
  );
}
