import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE = import.meta.env.VITE_API_URL || "";

const s = {
  page: { maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" },
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "2.2rem", letterSpacing: ".04em", marginBottom: "1.5rem",
  },
  card: {
    background: "var(--card)", border: "1px solid var(--border)",
    borderRadius: 10, padding: "1rem 1.2rem", marginBottom: ".8rem",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    cursor: "pointer", transition: "border-color .2s",
    animation: "fadeIn .3s ease both",
  },
  teams: { fontWeight: 600, fontSize: ".95rem" },
  meta:  { color: "var(--muted)", fontSize: ".8rem", marginTop: ".2rem" },
  badge: {
    fontSize: ".7rem", padding: "3px 8px", borderRadius: 4,
    background: "rgba(255,255,255,0.06)", color: "var(--muted)",
    fontWeight: 600,
  },
  loader: { display: "flex", justifyContent: "center", padding: "4rem" },
  spinner: {
    width: 32, height: 32,
    border: "3px solid var(--border)",
    borderTop: "3px solid var(--accent)",
    borderRadius: "50%", animation: "spin 0.8s linear infinite",
  },
};

export default function SchedulePage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoad]    = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    axios.get(`${BASE}/api/cricket/matches`)
      .then((r) => setMatches(r.data?.data || []))
      .finally(() => setLoad(false));
  }, []);

  if (loading) return <div style={s.loader}><div style={s.spinner} /></div>;

  return (
    <div style={s.page}>
      <h1 style={s.title}>Match Schedule</h1>
      {matches.map((m) => (
        <div key={m.id} style={s.card} onClick={() => nav(`/match/${m.id}`)}>
          <div>
            <div style={s.teams}>{m.teams?.[0]} vs {m.teams?.[1]}</div>
            <div style={s.meta}>
              📍 {m.venue?.slice(0, 35) || "TBD"} &nbsp;·&nbsp;
              📅 {m.date || "TBD"}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={s.badge}>{m.matchType?.toUpperCase()}</div>
            <div style={{ ...s.meta, marginTop: ".4rem" }}>{m.status?.slice(0, 30)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
