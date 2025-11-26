import React, { useEffect, useState } from "react";
import api from "../../api/api";

/**
 * NavBar1.jsx
 * - Appears in normal flow below LogoSection.
 * - Becomes fixed (sticky) after scrolling past LogoSection.
 * - Uses localStorage cache to avoid visible "Loading..." flash on refresh.
 * - Dropdowns styled to match green UI.
 */

const MENU_CACHE_KEY = "site_menus_v1";
const GREEN_SOLID = "#15683a"; // adjust if you prefer another green
const GREEN_TRANSPARENT = "rgba(21,104,58,0.12)"; // subtle tint over hero

const normalizeTree = (items = []) =>
  items.map((item) => ({
    ...item,
    children: item.children_recursive ? normalizeTree(item.children_recursive) : [],
  }));

export default function NavBar() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [collapsed, setCollapsed] = useState(true); // mobile
  const [openDropdown, setOpenDropdown] = useState(null); // desktop dropdown key
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);
  const [sticky, setSticky] = useState(false); // becomes true after scroll past LogoSection

  // Init from cache to avoid loading flash
  useEffect(() => {
    try {
      const raw = localStorage.getItem(MENU_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          setMenus(parsed);
        }
      }
    } catch (e) {
      // ignore parse errors
      console.warn("Menu cache parse error", e);
    }
  }, []);

  // window resize: desktop detection
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 992);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // sticky toggle based on LogoSection height
  useEffect(() => {
    const handler = () => {
      const logoEl = document.querySelector(".LogoSection");
      const logoHeight = logoEl ? logoEl.offsetHeight : 120; // fallback
      setSticky(window.scrollY >= logoHeight);
    };
    // run immediately to set initial state (if page already scrolled)
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // fetch menus (and update cache)
  useEffect(() => {
    let mounted = true;
    async function fetchMenus() {
      setLoading(true);
      setError(null);
      try {
        console.log("[NavBar1] fetching /menu-list …");
        const res = await api.get("/menu-list");
        console.log("[NavBar1] response:", res);
        const rawData = res?.data?.data ?? res?.data ?? [];
        const normalized = normalizeTree(Array.isArray(rawData) ? rawData : []);
        if (mounted) setMenus(normalized);
        try {
          localStorage.setItem(MENU_CACHE_KEY, JSON.stringify(normalized));
        } catch (e) {
          console.warn("Failed to cache menus", e);
        }
      } catch (err) {
        console.error("[NavBar1] fetch error:", err);
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchMenus();
    return () => {
      mounted = false;
    };
  }, []);

  // close open desktop dropdown when switching to mobile
  useEffect(() => {
    if (!isDesktop) setOpenDropdown(null);
  }, [isDesktop]);

  // Render helpers
  const renderMobileMenus = (items) =>
    items.map((item) => (
      <div key={item.id ?? item.title} className="NavBar1-mobile-block">
        {item.children && item.children.length ? (
          <details>
            <summary>{item.title}</summary>
            <div className="ps-3">
              {item.children.map((c) =>
                c.children && c.children.length ? (
                  <details key={c.id ?? c.title} className="mt-1">
                    <summary>{c.title}</summary>
                    <div className="ps-3">
                      {c.children.map((gc) => (
                        <a key={gc.id ?? gc.title} className="d-block py-1 NavBar1-dropdown-item" href={gc.url ?? "#"}>
                          {gc.title}
                        </a>
                      ))}
                    </div>
                  </details>
                ) : (
                  <a key={c.id ?? c.title} className="d-block py-1 NavBar1-dropdown-item" href={c.url ?? "#"}>
                    {c.title}
                  </a>
                )
              )}
            </div>
          </details>
        ) : (
          <a className="d-block py-1" href={item.url ?? "#"}>
            {item.title}
          </a>
        )}
      </div>
    ));

  const renderMenus = (items) =>
    items.map((item) => {
      const key = item.id ?? item.title;
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = openDropdown === key;

      if (hasChildren) {
        return (
          <li
            key={key}
            className={`nav-item dropdown ${isOpen ? "show" : ""}`}
            onMouseEnter={() => isDesktop && setOpenDropdown(key)}
            onMouseLeave={() => isDesktop && setOpenDropdown(null)}
          >
            <button
              className="nav-link dropdown-toggle btn btn-link text-white"
              id={`menu-${key}`}
              aria-expanded={isOpen}
              onClick={(e) => {
                if (isDesktop) {
                  setOpenDropdown((k) => (k === key ? null : key));
                } else {
                  // prevent navigation on mobile parent; expand mobile details below rather than this
                  e.preventDefault();
                }
              }}
            >
              {item.title}
            </button>

            <div className={`dropdown-menu ${isOpen ? "show" : ""}`} aria-labelledby={`menu-${key}`}>
              {item.children.map((c) =>
                c.children && c.children.length ? (
                  <div key={c.id ?? c.title} className="dropend">
                    <a className="dropdown-item dropdown-toggle" href={c.url ?? "#"}>
                      {c.title}
                    </a>
                    <ul className="dropdown-menu">
                      {c.children.map((gc) => (
                        <li key={gc.id ?? gc.title}>
                          <a className="dropdown-item" href={gc.url ?? "#"}>
                            {gc.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <a key={c.id ?? c.title} className="dropdown-item" href={c.url ?? "#"}>
                    {c.title}
                  </a>
                )
              )}
            </div>
          </li>
        );
      }

      return (
        <li key={key} className="nav-item">
          <a className="nav-link text-white" href={item.url ?? "#"}>
            {item.title}
          </a>
        </li>
      );
    });

  // Render: note we avoid showing a big "Loading" panel — cached menus or minimal fallback shown immediately
  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark NavBar1-root ${sticky ? "NavBar1-sticky" : "NavBar1-flow"}`}
      style={{ transition: "background 220ms ease, box-shadow 220ms ease" }}
    >
      <div className="container">
        <a className="navbar-brand text-white" href="/">
          {/* Replace text with logo img if you like */}
          {/* <img src="/images/logo.png" alt="logo" style={{ maxHeight: 56 }} onError={(e) => (e.target.style.display = "none")} />
          <span className="ms-2 d-none d-md-inline">District Portal</span> */}
        </a>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNavDropdown"
          aria-expanded={!collapsed}
          aria-label="Toggle navigation"
          onClick={() => setCollapsed((c) => !c)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* main collapse area */}
        <div className={`navbar-collapse justify-content-center ${!collapsed ? "show" : ""}`} id="navbarNavDropdown">
          <ul className="navbar-nav gap-lg-1">
            {/* if we have cached menus, render them instantly; if none, show a minimal static fallback */}
            {menus && menus.length ? (
              renderMenus(menus)
            ) : (
              // Minimal fallback to avoid empty navbar during first-ever load
              <>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    Contact
                  </a>
                </li>
              </>
            )}
          </ul>

          {/* Mobile expanded content (vertical) */}
          { !collapsed && (
            <div className="d-lg-none w-100 mt-2">
              {menus && menus.length ? renderMobileMenus(menus) : null}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}



