import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { fetchPageConfig } from "../services/pageService";
import NavNew from "../components/user/NavNew";
import Footer from "../components/user/Footer";
import MapSection from "../components/user/contact_us/MapSection";

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
  const [loading, setLoading] = useState(true);
  const resolvedSlug = slug || "home";

  
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    // alert(resolvedSlug)
    fetchPageConfig(resolvedSlug)
      .then((c) => {
        if (!mounted) return;
        if (!c) {
          // page not found
          console.log(c)
          setConfig([{ type: "Hero", props: { data: { title: "404 - Page not found" } } }]);
        } else {
          setConfig(c);
        }
      })
      .catch((err) => {
        console.error("fetch page error", err);
        //setConfig([{ type: "Hero", props: { data: { title: "Error loading page" } } }]);
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [resolvedSlug, location.pathname]);

  // Optionally, prefetch certain components on hover or link focus.

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div>
      <Suspense fallback={<div style={{ padding: 40 }}>Loading block…</div>}>
        {config.map((block, i) => {
          const BlockComp = ComponentRegistry[block.type];
          // alert(block?.type)
          if (!BlockComp) {
            return <div key={i}>Unknown block: {block.type}</div>;
          }
          return <BlockComp key={i} {...(block.props || {})} />;
        })}
      </Suspense>
    </div>
  );
}
