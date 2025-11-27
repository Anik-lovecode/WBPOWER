import React, { useEffect, useState } from "react";
import { Nav, Navbar, IconButton } from "rsuite";
import MenuIcon from "@rsuite/icons/Menu";
import "rsuite/dist/rsuite.min.css";
import api from "../../api/api";

const MENU_CACHE_KEY = "site_menus_v1_rsuite";

// Convert backend children_recursive into children
const normalizeTree = (items = []) =>
  items.map((item) => ({
    ...item,
    children: item.children_recursive ? normalizeTree(item.children_recursive) : [],
  }));

export default function NavNew() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sticky, setSticky] = useState(false);

  // Avoid reading window at module evaluation to prevent SSR/hydration mismatch.
  const [isDesktop, setIsDesktop] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Load from localStorage */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(MENU_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMenus(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to parse cache", e);
    }
  }, []);

  /* Fetch menus */
  useEffect(() => {
    let mounted = true;
    async function fetchMenus() {
      setLoading(true);
      try {
        const res = await api.get("/menu-list");
        const rawData = res?.data?.data ?? res?.data ?? [];
        const normalized = normalizeTree(Array.isArray(rawData) ? rawData : []);

        if (mounted) setMenus(normalized);

        try {
          localStorage.setItem(MENU_CACHE_KEY, JSON.stringify(normalized));
        } catch (e) {
          console.warn("Cache failed", e);
        }
      } catch (err) {
        console.error("Menu fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchMenus();
    return () => {
      mounted = false;
    };
  }, []);

  /* Sticky behavior */
  useEffect(() => {
    const handler = () => {
      const logoEl = document.querySelector(".LogoSection");
      const logoHeight = logoEl ? logoEl.offsetHeight : 120;
      setSticky(window.scrollY >= logoHeight);
    };
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* Desktop/mobile detection (set after mount to avoid hydration mismatch) */
  useEffect(() => {
    const setFromWindow = () => setIsDesktop(window.innerWidth >= 992);
    setFromWindow();
    const onResize = () => setFromWindow();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Helper: render nested Nav.Menu/Nav.Item for arbitrary depth */
  const renderMenuTree = (items = [], level = 0) =>
    items.map((item) => {
      const key = item.id ?? `${item.title}-${level}-${Math.random().toString(36).slice(2, 7)}`;
      const hasChildren = item.children && item.children.length > 0;

      if (hasChildren) {
        return (
          <Nav.Menu
            key={key}
            title={item.title}
            eventKey={key}
            aria-label={`${item.title} submenu`}
          >
            {renderMenuTree(item.children, level + 1)}
          </Nav.Menu>
        );
      }

      return (
        <Nav.Item
          key={key}
          href={item.url ?? "#"}
          eventKey={key}
          as="a"
          aria-label={item.title}
        >
          {item.title}
        </Nav.Item>
      );
    });

  return (
    <div
      style={{
        position: sticky ? "fixed" : "relative",
        top: 0,
        width: "100%",
        zIndex: 999,
        background: sticky ? "#d6d330ff" : "white",
        transition: "all 0.25s ease",
        boxShadow: sticky ? "0px 2px 8px rgba(0,0,0,0.15)" : "none",
      }}
    >
      <Navbar appearance="subtle" style={{ padding: "8px 20px" }}>
        {/* MOBILE BUTTON */}
        {!isDesktop && (
          <IconButton
            icon={<MenuIcon />}
            onClick={() => setMobileOpen((s) => !s)}
            appearance="subtle"
            aria-label="Toggle menu"
          />
        )}

        {/* DESKTOP MENU CENTERED */}
        {isDesktop && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Nav>{renderMenuTree(menus)}</Nav>
          </div>
        )}
      </Navbar>

      {/* MOBILE MENU */}
      {!isDesktop && mobileOpen && (
        <Nav
          vertical
          style={{
            background: "#f9f9f9",
            padding: 10,
            borderBottom: "1px solid #ddd",
          }}
        >
          {renderMenuTree(menus)}
        </Nav>
      )}
    </div>
  );
}
