import React from "react";
import { useNavigate } from "react-router-dom";


export default function MatchCard({ match, hasStream }) {
  const nav = useNavigate();

  const status = match.status || "Upcoming";
  const isLive = status.toLowerCase().includes("live") ||
                 status.toLowerCase().includes("progress");

  const s = {
    card: {
      background: "var(--card)",
      border: `1px solid ${isLive ? "rgba(0,230,118,0.2)" : "var(--border)"}`,
      borderRadius: 12,
      padding: "1.2rem 1.4rem",
      cursor: "pointer",
      transition: "all .2s",
      animation: "fadeIn .4s ease both",
      position: "relative",
      overflow: "hidden",
    },
    glow: {
      position: "absolute", top: 0, left: 0, right: 0,
      height: 2,
      background: isLive ? "linear-gradient(90deg,#00e676,#00bcd4)" : "transparent",
    },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".8rem" },
    badge: {
      fontSize: ".65rem", fontWeight: 700, letterSpacing: ".07em",
      padding: "3px 8px", borderRadius: 4,
      background: isLive ? "rgba(0,230,118,0.15)" : "rgba(255,255,255,0.06)",
      color: isLive ? "var(--accent)" : "var(--muted)",
      display: "flex", alignItems: "center", gap: 5,
    },
    dot: {
      width: 6, height: 6, borderRadius: "50%",
      background: "var(--accent)",
      animation: "pulse 1.2s infinite",
    },
    teams: { fontSize: "1.05rem", fontWeight: 600, marginBottom: ".5rem" },
    vs: { color: "var(--muted)", margin: "0 .5rem", fontSize: ".85rem" },
    score: { fontSize: ".82rem", color: "var(--muted)", marginBottom: ".9rem" },
    footer: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    format: {
      fontSize: ".7rem", color: "var(--muted)",
      background: "rgba(255,255,255,0.05)",
      padding: "2px 8px", borderRadius: 4,
    },
    watchBtn: {
      fontSize: ".78rem", fontWeight: 600,
      padding: "6px 14px", borderRadius: 6,
      border: "none", cursor: "pointer",
      background: hasStream ? "var(--accent)" : "var(--bg3)",
      color: hasStream ? "#000" : "var(--muted)",
      transition: "opacity .2s",
    },
  };

  const handleClick = () => {
    if (hasStream) nav(`/watch/${match.id}`);
    else nav(`/match/${match.id}`);
  };

  return (
    <div style={s.card} onClick={handleClick}>
      <div style={s.glow} />
      <div style={s.header}>
        <span style={s.badge}>
          {isLive && <span style={s.dot} />}
          {isLive ? "LIVE" : status.slice(0, 20)}
        </span>
        <span style={s.format}>{match.matchType?.toUpperCase() || "T20"}</span>
      </div>
      <div style={s.teams}>
        {match.teams?.[0] || "Team A"}
        <span style={s.vs}>vs</span>
        {match.teams?.[1] || "Team B"}
      </div>
      <div style={s.score}>
        {match.score?.map((s, i) => (
          <span key={i}>{s.r}/{s.w} ({s.o} ov) &nbsp;</span>
        )) || "Match yet to begin"}
      </div>
      <div style={s.footer}>
        <span style={{ fontSize: ".75rem", color: "var(--muted)" }}>
          {match.venue?.slice(0, 30) || "Venue TBD"}
        </span>
        <button style={s.watchBtn}>
          {hasStream ? "▶ Watch Live" : "Scorecard"}
        </button>
      </div>
    </div>
  );
}
