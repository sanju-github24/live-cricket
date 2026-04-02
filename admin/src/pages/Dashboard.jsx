import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../App";
import { useNavigate } from "react-router-dom";

const s = {
  title: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: ".04em", marginBottom: "1.5rem" },
  grid:  { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" },
  stat:  {
    background: "var(--card)", border: "1px solid var(--border)",
    borderRadius: 12, padding: "1.2rem 1.4rem", animation: "fadeIn .3s ease",
  },
  statVal: { fontSize: "2rem", fontWeight: 700, color: "var(--accent)" },
  statLbl: { color: "var(--muted)", fontSize: ".82rem", marginTop: ".2rem" },
  section: { fontWeight: 600, marginBottom: "1rem", fontSize: "1rem" },
  table: {
    width: "100%", borderCollapse: "collapse",
    background: "var(--card)", borderRadius: 10,
    overflow: "hidden", border: "1px solid var(--border)",
  },
  th: { fontSize: ".75rem", color: "var(--muted)", padding: ".8rem 1rem", textAlign: "left", borderBottom: "1px solid var(--border)", background: "var(--bg2)" },
  td: { fontSize: ".85rem", padding: ".75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.04)" },
  live: { color: "var(--accent)", fontSize: ".7rem", fontWeight: 700 },
  off:  { color: "var(--muted)", fontSize: ".7rem" },
};

export default function Dashboard() {
  const [streams, setStreams]   = useState([]);
  const [matches, setMatches]   = useState([]);
  const { token } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    axios.get("/api/streams").then((r) => setStreams(r.data || []));
    axios.get("/api/cricket/matches").then((r) => setMatches(r.data?.data || []));
  }, []);

  const live = matches.filter((m) => m.status?.toLowerCase().includes("live")).length;

  return (
    <div>
      <h1 style={s.title}>Dashboard</h1>

      <div style={s.grid}>
        <div style={s.stat}><div style={s.statVal}>{live}</div><div style={s.statLbl}>Live Matches</div></div>
        <div style={s.stat}><div style={s.statVal}>{matches.length}</div><div style={s.statLbl}>Total Matches</div></div>
        <div style={s.stat}><div style={s.statVal}>{streams.length}</div><div style={s.statLbl}>Active Streams</div></div>
        <div style={s.stat}>
          <div style={{ ...s.statVal, color: "var(--accent2)" }}>
            {streams.filter(s => s.isLive).length}
          </div>
          <div style={s.statLbl}>Streams Online</div>
        </div>
      </div>

      <div style={s.section}>Recent Streams</div>
      <table style={s.table}>
        <thead>
          <tr>
            {["Match","Format","Stream Type","Status",""].map((h) => (
              <th key={h} style={s.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {streams.slice(0, 8).map((st) => (
            <tr key={st._id}>
              <td style={s.td}>{st.matchName}</td>
              <td style={s.td}>{st.matchFormat}</td>
              <td style={s.td}>{st.streamType}</td>
              <td style={s.td}>
                {st.isLive
                  ? <span style={s.live}>● LIVE</span>
                  : <span style={s.off}>○ Off</span>}
              </td>
              <td style={s.td}>
                <button
                  onClick={() => nav("/streams")}
                  style={{ background: "none", border: "none", color: "var(--accent)", fontSize: ".8rem", cursor: "pointer" }}
                >
                  Manage →
                </button>
              </td>
            </tr>
          ))}
          {streams.length === 0 && (
            <tr><td colSpan={5} style={{ ...s.td, color: "var(--muted)", textAlign: "center" }}>No streams yet. Add one!</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
