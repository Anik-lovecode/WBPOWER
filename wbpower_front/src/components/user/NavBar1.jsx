import React, { useEffect, useState } from "react";

/**
 * NavBar1
 * - Desktop: dropdown opens on mouseenter and closes on mouseleave (also click toggles)
 * - Mobile: top-level hamburger toggles mobile panel; submenus use <details>
 * - No bootstrap JS required
 */

const DROPDOWNS = [
  { key: "policy", label: "Policy", items: ["Policy 1", "Policy 2", "Policy 3"] },
  { key: "acts", label: "Acts & Rules / Guidelines", items: ["Acts", "Rules", "Guidelines"] },
  { key: "schemes", label: "Schemes & Projects", items: ["Scheme 1", "Scheme 2", "Scheme 3"] },
  { key: "units", label: "Departmental Units", items: ["Unit 1", "Unit 2", "Unit 3"] },
  { key: "citizen", label: "Citizen Corner", items: ["Service 1", "Service 2", "Service 3"] },
];

export default function NavBar1() {
  const [open, setOpen] = useState(false); // mobile panel
  const [openDropdown, setOpenDropdown] = useState(null); // which dropdown is open on desktop (key)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 992);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // close desktop dropdown when switching to mobile
  useEffect(() => {
    if (!isDesktop) setOpenDropdown(null);
  }, [isDesktop]);

  const handleMouseEnter = (key) => {
    if (isDesktop) setOpenDropdown(key);
  };
  const handleMouseLeave = () => {
    if (isDesktop) setOpenDropdown(null);
  };
  const handleDropdownClick = (key) => {
    // on desktop: toggle on click too (accessible)
    if (isDesktop) {
      setOpenDropdown((k) => (k === key ? null : key));
    }
  };

  return (
    <nav className={`NavBar1 ${open ? "open" : ""} ${isDesktop ? "desktop" : "mobile"}`}>
      <div className="NavBar1-inner container">
        <a className="NavBar1-brand" href="/">MyApp</a>

        <button
          className="NavBar1-toggler"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
        >
          <span className="NavBar1-toggler-icon" />
        </button>

        {/* Desktop menu */}
        <div className="NavBar1-menu">
          <ul className="NavBar1-list">
            <li className="NavBar1-item"><a className="NavBar1-link" href="#">Home</a></li>
            <li className="NavBar1-item"><a className="NavBar1-link" href="#">About Us</a></li>

            {DROPDOWNS.map((dd) => (
              <li
                key={dd.key}
                className={`NavBar1-item NavBar1-dropdown ${openDropdown === dd.key ? "show" : ""}`}
                onMouseEnter={() => handleMouseEnter(dd.key)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className="NavBar1-link NavBar1-dropdown-toggle"
                  onClick={() => handleDropdownClick(dd.key)}
                  aria-expanded={openDropdown === dd.key}
                >
                  {dd.label}
                </button>

                <ul className="NavBar1-dropdown-menu" role="menu" aria-hidden={openDropdown !== dd.key}>
                  {dd.items.map((it, i) => (
                    <li key={i}><a className="NavBar1-dropdown-item" href="#">{it}</a></li>
                  ))}
                </ul>
              </li>
            ))}

            <li className="NavBar1-item"><a className="NavBar1-link" href="#">Achievement</a></li>
            <li className="NavBar1-item"><a className="NavBar1-link" href="#">Announcement</a></li>
            <li className="NavBar1-item"><a className="NavBar1-link" href="#">Contact Us</a></li>
          </ul>
        </div>

        {/* Mobile panel (visible when open) */}
        <div className="NavBar1-mobile" style={{ display: open ? "block" : "none" }}>
          <a className="NavBar1-mobile-link" href="#">Home</a>
          <a className="NavBar1-mobile-link" href="#">About Us</a>

          {DROPDOWNS.map((dd) => (
            <details key={dd.key} className="NavBar1-mobile-dropdown">
              <summary>{dd.label}</summary>
              {dd.items.map((it, i) => (
                <a key={i} className="NavBar1-dropdown-item" href="#">{it}</a>
              ))}
            </details>
          ))}

          <a className="NavBar1-mobile-link" href="#">Achievement</a>
          <a className="NavBar1-mobile-link" href="#">Announcement</a>
          <a className="NavBar1-mobile-link" href="#">Contact Us</a>
        </div>
      </div>
    </nav>
  );
}
