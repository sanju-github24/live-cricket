import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

const s = {
  page: { maxWidth: 700, margin: "0 auto" },
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "2rem", letterSpacing: ".04em", marginBottom: "1.5rem",
  },
  form: {
    background: "var(--card)", border: "1px solid var(--border)",
    borderRadius: 14, padding: "2rem",
    animation: "fadeIn .3s ease",
  },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  field: { marginBottom: "1rem" },
  label: {
    fontSize: ".78rem", color: "var(--muted)",
    display: "block", marginBottom: ".4rem", fontWeight: 500,
  },
  required: { color: "#ff4757", marginLeft: 3 },
  full: { gridColumn: "1 / -1" },
  hint: { fontSize: ".7rem", color: "var(--muted)", marginTop: ".3rem", opacity: .7 },
  btn: {
    padding: ".75rem 2rem", background: "var(--accent)", color: "#000",
    border: "none", borderRadius: 8, fontWeight: 700, fontSize: ".95rem",
    marginTop: ".5rem", transition: "opacity .2s", cursor: "pointer",
    fontFamily: "inherit",
  },
  cancel: {
    padding: ".75rem 1.5rem", background: "transparent",
    border: "1px solid var(--border)", color: "var(--muted)",
    borderRadius: 8, fontSize: ".9rem", marginLeft: ".8rem",
    cursor: "pointer", fontFamily: "inherit",
  },
  success: {
    background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.25)",
    color: "var(--accent)", borderRadius: 8, padding: ".9rem 1rem",
    fontSize: ".88rem", marginBottom: "1rem",
  },
  error: {
    background: "rgba(255,71,87,0.1)", border: "1px solid rgba(255,71,87,0.25)",
    color: "#ff6b6b", borderRadius: 8, padding: ".9rem 1rem",
    fontSize: ".88rem", marginBottom: "1rem", whiteSpace: "pre-wrap",
  },
  debugBox: {
    background: "rgba(0,0,0,.3)", border: "1px solid #333",
    borderRadius: 7, padding: ".7rem 1rem", marginTop: "1rem",
    fontSize: ".72rem", color: "#888", fontFamily: "monospace",
  },
  sectionLabel: {
    fontSize: ".68rem", fontWeight: 700, letterSpacing: ".1em",
    color: "var(--accent)", textTransform: "uppercase",
    margin: "1.2rem 0 .8rem", borderBottom: "1px solid var(--border)",
    paddingBottom: ".4rem",
  },
  autoFillBar: {
    background: "rgba(255,255,255,.04)", border: "1px solid var(--border)",
    borderRadius: 9, padding: ".8rem 1rem", marginBottom: "1.2rem",
    display: "flex", alignItems: "center", gap: ".8rem", flexWrap: "wrap",
  },
  autoLabel: { fontSize: ".8rem", color: "var(--muted)", flexShrink: 0 },
};

const INIT = {
  matchId: "", matchName: "", team1: "", team2: "",
  streamUrl: "", streamType: "hls", thumbnail: "",
  isLive: true, matchFormat: "T20", tournament: "",
};

export default function AddStream() {
  const [form,    setForm]    = useState(INIT);
  const [matches, setMatches] = useState([]);
  const [msg,     setMsg]     = useState({ type: "", text: "" });
  const [loading, setLoad]    = useState(false);
  const [debug,   setDebug]   = useState("");
  const { token } = useAuth();
  const nav = useNavigate();

  // Load live matches for auto-fill
  useEffect(() => {
    axios.get(`${API}/api/cricket/matches`)
      .then(r => setMatches(r.data?.data || []))
      .catch(err => console.warn("Could not load matches:", err.message));
  }, []);

  const set = (k) => (e) => setForm(f => ({
    ...f,
    [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
  }));

  // Auto-fill from a live match
  const pickMatch = (e) => {
    const m = matches.find(x => x.id === e.target.value);
    if (!m) return;
    setForm(f => ({
      ...f,
      matchId:   m.id || "",
      matchName: m.name || `${m.teams?.[0]} vs ${m.teams?.[1]}` || "",
      team1:     m.teams?.[0] || "",
      team2:     m.teams?.[1] || "",
      matchFormat: (m.matchType || "T20").toUpperCase(),
    }));
    setMsg({ type: "", text: "" });
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    setDebug("");

    // Client-side validation
    if (!form.matchId.trim())   return setMsg({ type: "error", text: "❌ Match ID is required" });
    if (!form.matchName.trim()) return setMsg({ type: "error", text: "❌ Match Name is required" });
    if (!form.team1.trim())     return setMsg({ type: "error", text: "❌ Team 1 is required" });
    if (!form.team2.trim())     return setMsg({ type: "error", text: "❌ Team 2 is required" });
    if (!form.streamUrl.trim()) return setMsg({ type: "error", text: "❌ Stream URL is required" });

    if (!token || token === "null") {
      return setMsg({ type: "error", text: "❌ Not logged in. Please log in as admin first." });
    }

    setLoad(true);

    const payload = {
      matchId:     form.matchId.trim(),
      matchName:   form.matchName.trim(),
      team1:       form.team1.trim(),
      team2:       form.team2.trim(),
      streamUrl:   form.streamUrl.trim(),
      streamType:  form.streamType,
      thumbnail:   form.thumbnail.trim(),
      isLive:      form.isLive,
      matchFormat: form.matchFormat,
      tournament:  form.tournament.trim(),
    };

    setDebug(`POST ${API}/api/streams\nToken: ${token.slice(0,20)}...\nBody: ${JSON.stringify(payload, null, 2)}`);

    try {
      const res = await axios.post(`${API}/api/streams`, payload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      setMsg({ type: "success", text: `✅ Stream added successfully! ID: ${res.data.stream?._id || "saved"}` });
      setForm(INIT);
      setDebug("");
      setTimeout(() => nav("/streams"), 2000);
    } catch (err) {
      const serverMsg = err.response?.data?.error || err.message || "Unknown error";
      const status    = err.response?.status || "No response";
      setMsg({
        type: "error",
        text: `❌ Error ${status}: ${serverMsg}`,
      });
      setDebug(`Status: ${status}\nResponse: ${JSON.stringify(err.response?.data, null, 2)}`);
    } finally {
      setLoad(false);
    }
  };

  return (
    <div style={s.page}>
      <h1 style={s.title}>Add Stream</h1>

      <div style={s.form}>
        {msg.text && (
          <div style={msg.type === "success" ? s.success : s.error}>
            {msg.text}
          </div>
        )}

        {/* Auto-fill from live match */}
        <div style={s.autoFillBar}>
          <span style={s.autoLabel}>⚡ Auto-fill from live match:</span>
          <select
            onChange={pickMatch}
            defaultValue=""
            style={{ flex: 1, minWidth: 200, fontSize: ".82rem" }}
          >
            <option value="">-- Select a match to auto-fill fields --</option>
            {matches.map(m => (
              <option key={m.id} value={m.id}>
                {m.teams?.[0]} vs {m.teams?.[1]} ({(m.matchType||"T20").toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={submit}>

          {/* ── MATCH INFO ── */}
          <div style={s.sectionLabel}>Match Info</div>
          <div style={s.grid}>

            <div style={s.field}>
              <label style={s.label}>Match ID <span style={s.required}>*</span></label>
              <input
                value={form.matchId}
                onChange={set("matchId")}
                placeholder="e.g. abc123-def456"
              />
              <div style={s.hint}>From CricketData.org API response</div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Format</label>
              <select value={form.matchFormat} onChange={set("matchFormat")}>
                {["T20","ODI","Test","T10"].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>

            <div style={{ ...s.field, ...s.full }}>
              <label style={s.label}>Match Name <span style={s.required}>*</span></label>
              <input
                value={form.matchName}
                onChange={set("matchName")}
                placeholder="e.g. India vs Australia, 1st T20I"
              />
            </div>

            <div style={s.field}>
              <label style={s.label}>Team 1 <span style={s.required}>*</span></label>
              <input value={form.team1} onChange={set("team1")} placeholder="India" />
            </div>

            <div style={s.field}>
              <label style={s.label}>Team 2 <span style={s.required}>*</span></label>
              <input value={form.team2} onChange={set("team2")} placeholder="Australia" />
            </div>

            <div style={s.field}>
              <label style={s.label}>Tournament</label>
              <input value={form.tournament} onChange={set("tournament")} placeholder="IPL 2026, World Cup..." />
            </div>
          </div>

          {/* ── STREAM INFO ── */}
          <div style={s.sectionLabel}>Stream Info</div>
          <div style={s.grid}>

            <div style={{ ...s.field, ...s.full }}>
              <label style={s.label}>Stream URL <span style={s.required}>*</span></label>
              <input
                value={form.streamUrl}
                onChange={set("streamUrl")}
                placeholder="https://... (.m3u8 for HLS | youtube.com/watch?v= | iframe embed URL)"
              />
            </div>

            <div style={s.field}>
              <label style={s.label}>Stream Type</label>
              <select value={form.streamType} onChange={set("streamType")}>
                <option value="hls">HLS (.m3u8)</option>
                <option value="youtube">YouTube</option>
                <option value="iframe">iFrame Embed</option>
              </select>
            </div>

            <div style={s.field}>
              <label style={s.label}>Thumbnail URL (optional)</label>
              <input value={form.thumbnail} onChange={set("thumbnail")} placeholder="https://..." />
            </div>

            <div style={{ ...s.field, ...s.full }}>
              <label style={{ ...s.label, display: "flex", alignItems: "center", gap: ".5rem" }}>
                <input
                  type="checkbox"
                  checked={form.isLive}
                  onChange={set("isLive")}
                  style={{ width: "auto" }}
                />
                Mark as Live (shows on homepage immediately)
              </label>
            </div>
          </div>

          <div>
            <button style={s.btn} type="submit" disabled={loading}>
              {loading ? "⏳ Saving..." : "➕ Add Stream"}
            </button>
            <button type="button" style={s.cancel} onClick={() => nav("/streams")}>
              Cancel
            </button>
          </div>
        </form>

        {/* Debug info */}
        {debug && (
          <div style={s.debugBox}>
            <strong>Debug Info:</strong>
            <pre>{debug}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
