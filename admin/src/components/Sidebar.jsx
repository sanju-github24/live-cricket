import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../App";

const s = {
  sidebar: {
    width: 220, background: "var(--bg2)",
    borderRight: "1px solid var(--border)",
    display: "flex", flexDirection: "column",
    padding: "1.5rem 0",
    position: "sticky", top: 0, height: "100vh",
  },
  logo: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem",
    letterSpacing: ".05em", padding: "0 1.4rem 1.5rem",
    borderBottom: "1px solid var(--border)", marginBottom: "1rem",
    background: "linear-gradient(135deg,#00e676,#00bcd4)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  link: {
    display: "flex", alignItems: "center", gap: ".7rem",
    padding: ".65rem 1.4rem", fontSize: ".88rem", color: "var(--muted)",
    transition: "all .15s", borderLeft: "2px solid transparent",
    textDecoration: "none",
  },
  activeLink: {
    color: "var(--accent)", borderLeftColor: "var(--accent)",
    background: "rgba(0,230,118,0.05)",
  },
  logout: {
    marginTop: "auto", padding: "1rem 1.4rem",
    borderTop: "1px solid var(--border)",
  },
  logoutBtn: {
    background: "rgba(255,71,87,0.1)", border: "1px solid rgba(255,71,87,0.2)",
    color: "var(--red)", borderRadius: 7, padding: ".5rem 1rem",
    fontSize: ".85rem", width: "100%",
  },
};

const links = [
  { to: "/",       icon: "📊", label: "Dashboard" },
  { to: "/streams",icon: "📡", label: "Streams" },
  { to: "/add",    icon: "➕", label: "Add Stream" },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const nav = useNavigate();

  return (
    <div style={s.sidebar}>
      <div style={s.logo}>CricLive Admin</div>
      {links.map((l) => (
        <NavLink
          key={l.to} to={l.to} end={l.to === "/"}
          style={({ isActive }) => ({ ...s.link, ...(isActive ? s.activeLink : {}) })}
        >
          {l.icon} {l.label}
        </NavLink>
      ))}
      <div style={s.logout}>
        <button style={s.logoutBtn} onClick={() => { logout(); nav("/login"); }}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
