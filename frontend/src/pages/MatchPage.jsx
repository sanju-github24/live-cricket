import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const s = {
  page: { maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" },
  back: {
    color: "var(--muted)", fontSize: ".85rem", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: ".4rem",
    marginBottom: "1.5rem", background: "none", border: "none",
  },
  header: {
    background: "var(--card)", border: "1px solid var(--border)",
    borderRadius: 14, padding: "1.8rem", marginBottom: "1.5rem",
  },
  matchName: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "1.8rem", letterSpacing: ".04em", marginBottom: ".5rem",
  },
  meta: { color: "var(--muted)", fontSize: ".85rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" },
  badge: {
    display: "inline-block", fontSize: ".65rem", fontWeight: 700,
    padding: "3px 8px", borderRadius: 4,
    background: "rgba(0,230,118,0.15)", color: "var(--accent)",
    marginBottom: ".8rem", letterSpacing: ".08em",
  },
  scoreBox: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem",
    marginTop: "1.2rem",
  },
  team: {
    background: "rgba(255,255,255,0.04)",
    borderRadius: 10, padding: "1rem 1.2rem",
  },
  teamName: { fontSize: ".8rem", color: "var(--muted)", marginBottom: ".3rem" },
  runs: { fontSize: "1.6rem", fontWeight: 700 },
  overs: { fontSize: ".8rem", color: "var(--muted)" },
  section: {
    background: "var(--card)", border: "1px solid var(--border)",
    borderRadius: 14, padding: "1.4rem", marginBottom: "1rem",
  },
  sectionTitle: {
    fontSize: ".72rem", fontWeight: 700, letterSpacing: ".1em",
    color: "var(--accent)", textTransform: "uppercase", marginBottom: "1rem",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    fontSize: ".72rem", color: "var(--muted)", fontWeight: 500,
    textAlign: "left", padding: ".5rem .4rem",
    borderBottom: "1px solid var(--border)",
  },
  td: { fontSize: ".85rem", padding: ".6rem .4rem", borderBottom: "1px solid rgba(255,255,255,0.04)" },
  loader: { display: "flex", justifyContent: "center", padding: "4rem" },
  spinner: {
    width: 36, height: 36,
    border: "3px solid var(--border)",
    borderTop: "3px solid var(--accent)",
    borderRadius: "50%", animation: "spin 0.8s linear infinite",
  },
};

export default function MatchPage() {
  const { id } = useParams();
  const nav    = useNavigate();
  const [data, setData]     = useState(null);
  const [loading, setLoad]  = useState(true);

  useEffect(() => {
    axios.get(`/api/cricket/score/${id}`)
      .then((r) => setData(r.data?.data))
      .catch(() => {})
      .finally(() => setLoad(false));
  }, [id]);

  if (loading) return <div style={s.loader}><div style={s.spinner} /></div>;
  if (!data)   return <div style={s.page}><p style={{ color: "var(--muted)" }}>Scorecard not available.</p></div>;

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => nav(-1)}>← Back</button>

      <div style={s.header}>
        <div style={s.badge}>SCORECARD</div>
        <div style={s.matchName}>{data.name || "Match"}</div>
        <div style={s.meta}>
          <span>📍 {data.venue || "N/A"}</span>
          <span>📅 {data.date || "N/A"}</span>
          <span>🏏 {data.matchType?.toUpperCase() || "T20"}</span>
        </div>
        <div style={s.scoreBox}>
          {data.score?.map((inn, i) => (
            <div key={i} style={s.team}>
              <div style={s.teamName}>{inn.inning}</div>
              <div style={s.runs}>{inn.r}/{inn.w}</div>
              <div style={s.overs}>{inn.o} overs</div>
            </div>
          ))}
        </div>
      </div>

      {/* Batting scorecard */}
      {data.scorecard?.map((inn, i) => (
        <div key={i} style={s.section}>
          <div style={s.sectionTitle}>🏏 {inn.inning} — Batting</div>
          <table style={s.table}>
            <thead>
              <tr>
                {["Batsman","R","B","4s","6s","SR"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inn.batting?.map((b, j) => (
                <tr key={j}>
                  <td style={s.td}>
                    <div style={{ fontWeight: 500 }}>{b.batsman?.name || b["batsman name"]}</div>
                    <div style={{ fontSize: ".72rem", color: "var(--muted)" }}>{b.dismissal}</div>
                  </td>
                  <td style={{ ...s.td, fontWeight: 600 }}>{b.r}</td>
                  <td style={s.td}>{b.b}</td>
                  <td style={s.td}>{b["4s"]}</td>
                  <td style={s.td}>{b["6s"]}</td>
                  <td style={s.td}>{b.sr}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ ...s.sectionTitle, marginTop: "1.2rem" }}>🎯 Bowling</div>
          <table style={s.table}>
            <thead>
              <tr>
                {["Bowler","O","M","R","W","Econ"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inn.bowling?.map((b, j) => (
                <tr key={j}>
                  <td style={{ ...s.td, fontWeight: 500 }}>{b.bowler?.name || b["bowler name"]}</td>
                  <td style={s.td}>{b.o}</td>
                  <td style={s.td}>{b.m}</td>
                  <td style={s.td}>{b.r}</td>
                  <td style={{ ...s.td, fontWeight: 600, color: b.w > 2 ? "var(--accent)" : "inherit" }}>{b.w}</td>
                  <td style={s.td}>{b.eco}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
