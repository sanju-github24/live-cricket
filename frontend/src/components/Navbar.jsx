import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const s = {
  nav: {
    position: "sticky", top: 0, zIndex: 100,
    background: "rgba(8,12,16,0.95)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--border)",
    padding: "0 1.5rem",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    height: 60,
  },
  logo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "1.8rem", letterSpacing: "0.05em",
    background: "linear-gradient(135deg, #00e676, #00bcd4)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  links: { display: "flex", gap: "2rem", alignItems: "center" },
  link: { fontSize: ".9rem", fontWeight: 500, color: "var(--muted)", transition: "color .2s" },
  liveTag: {
    background: "var(--red)", color: "#fff",
    fontSize: ".65rem", fontWeight: 700,
    padding: "2px 7px", borderRadius: 4,
    letterSpacing: ".06em", marginLeft: 6,
    animation: "pulse 1.5s infinite",
    display: "inline-block",
  },
};

export default function Navbar() {
  const loc = useLocation();
  const active = (path) => ({ ...s.link, color: path === loc.pathname ? "var(--accent)" : "var(--muted)" });

  return (
    <nav style={s.nav}>
      <Link to="/" style={s.logo}>CricLive</Link>
      <div style={s.links}>
        <Link to="/" style={active("/")}>
          Live <span style={s.liveTag}>LIVE</span>
        </Link>
        <Link to="/schedule" style={active("/schedule")}>Schedule</Link>
      </div>
    </nav>
  );
}
