import React, { useEffect, useState } from "react";
import { Nav, Navbar, Dropdown, IconButton } from "rsuite";
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

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);
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

  /* Desktop/mobile detection */
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 992);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Render Desktop Menu */
  const renderDesktopMenu = (items) =>
    items.map((item) =>
      item.children && item.children.length ? (
        <Dropdown title={item.title} key={item.id ?? item.title}>
          {item.children.map((sub) =>
            sub.children && sub.children.length ? (
              <Dropdown.Menu key={sub.id ?? sub.title} title={sub.title}>
                {sub.children.map((c) => (
                  <Dropdown.Item href={c.url ?? "#"} key={c.id ?? c.title}>
                    {c.title}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            ) : (
              <Dropdown.Item href={sub.url ?? "#"} key={sub.id ?? sub.title}>
                {sub.title}
              </Dropdown.Item>
            )
          )}
        </Dropdown>
      ) : (
        <Nav.Item href={item.url ?? "#"} key={item.id ?? item.title}>
          {item.title}
        </Nav.Item>
      )
    );

  /* Render Mobile Menu */
  const renderMobileMenu = (items) =>
    items.map((item) =>
      item.children && item.children.length ? (
        <Dropdown.Menu key={item.id ?? item.title} title={item.title}>
          {item.children.map((sub) =>
            sub.children && sub.children.length ? (
              <Dropdown.Menu key={sub.id ?? sub.title} title={sub.title}>
                {sub.children.map((gc) => (
                  <Dropdown.Item href={gc.url ?? "#"} key={gc.id ?? gc.title}>
                    {gc.title}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            ) : (
              <Dropdown.Item href={sub.url ?? "#"} key={sub.id ?? sub.title}>
                {sub.title}
              </Dropdown.Item>
            )
          )}
        </Dropdown.Menu>
      ) : (
        <Nav.Item href={item.url ?? "#"} key={item.id ?? item.title}>
          {item.title}
        </Nav.Item>
      )
    );

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
            onClick={() => setMobileOpen(!mobileOpen)}
            appearance="subtle"
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
            <Nav>{renderDesktopMenu(menus)}</Nav>
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
          {renderMobileMenu(menus)}
        </Nav>
      )}
    </div>
    
  );
}
