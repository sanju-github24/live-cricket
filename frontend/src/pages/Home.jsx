import React, { useEffect, useState } from "react";
import axios from "axios";
import MatchCard from "../components/MatchCard";

const s = {
  page: { maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" },
  hero: {
    textAlign: "center", padding: "3rem 0 2rem",
    borderBottom: "1px solid var(--border)", marginBottom: "2.5rem",
  },
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
    letterSpacing: ".04em", lineHeight: 1,
    background: "linear-gradient(135deg, #fff 30%, #00e676)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  sub: { color: "var(--muted)", marginTop: ".6rem", fontSize: ".95rem" },
  section: { marginBottom: "2.5rem" },
  sectionTitle: {
    fontSize: ".75rem", fontWeight: 700, letterSpacing: ".12em",
    color: "var(--accent)", textTransform: "uppercase",
    marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: ".5rem",
  },
  dot: {
    width: 7, height: 7, borderRadius: "50%",
    background: "var(--accent)", animation: "pulse 1.2s infinite",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "1rem",
  },
  loader: { display: "flex", justifyContent: "center", padding: "4rem" },
  spinner: {
    width: 36, height: 36,
    border: "3px solid var(--border)",
    borderTop: "3px solid var(--accent)",
    borderRadius: "50%", animation: "spin 0.8s linear infinite",
  },
  empty: {
    textAlign: "center", color: "var(--muted)",
    padding: "3rem", border: "1px dashed var(--border)", borderRadius: 12,
  },
  error: {
    background: "rgba(255,61,61,0.08)", border: "1px solid rgba(255,61,61,0.2)",
    borderRadius: 10, padding: "1rem 1.5rem", color: "#ff6b6b",
    marginBottom: "1.5rem", fontSize: ".9rem",
  },
  // Stream card — admin uploaded
  streamCard: {
    background: "var(--card)",
    border: "1px solid rgba(0,230,118,0.25)",
    borderRadius: 12, padding: "1.2rem 1.4rem",
    animation: "fadeIn .4s ease both",
    position: "relative", overflow: "hidden",
    cursor: "pointer", transition: "all .2s",
  },
  streamGlow: {
    position: "absolute", top: 0, left: 0, right: 0,
    height: 2,
    background: "linear-gradient(90deg,#00e676,#00bcd4)",
  },
  streamBadge: {
    display: "inline-flex", alignItems: "center", gap: 5,
    background: "rgba(0,230,118,0.15)", color: "var(--accent)",
    fontSize: ".65rem", fontWeight: 700, padding: "3px 8px",
    borderRadius: 4, letterSpacing: ".06em", marginBottom: ".8rem",
  },
  liveDot: {
    width: 6, height: 6, borderRadius: "50%",
    background: "var(--accent)", animation: "pulse 1.2s infinite",
  },
  streamTeams: { fontSize: "1.05rem", fontWeight: 600, marginBottom: ".4rem" },
  streamVs: { color: "var(--muted)", margin: "0 .4rem", fontSize: ".85rem" },
  streamMeta: { fontSize: ".8rem", color: "var(--muted)", marginBottom: ".9rem" },
  watchBtn: {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: "var(--accent)", color: "#000",
    border: "none", borderRadius: 7, padding: "7px 16px",
    fontSize: ".82rem", fontWeight: 700, cursor: "pointer",
    transition: "opacity .2s",
  },
};

// Card for admin-uploaded streams
function StreamCard({ stream }) {
  const handleWatch = () => {
    window.location.href = `/watch/${stream.matchId}`;
  };

  return (
    <div style={s.streamCard} onClick={handleWatch}>
      <div style={s.streamGlow} />
      <div style={s.streamBadge}>
        <span style={s.liveDot} />
        {stream.isLive ? "LIVE NOW" : "STREAM AVAILABLE"}
      </div>
      <div style={s.streamTeams}>
        {stream.team1}
        <span style={s.streamVs}>vs</span>
        {stream.team2}
      </div>
      <div style={s.streamMeta}>
        {stream.tournament && <span>{stream.tournament} · </span>}
        <span>{stream.matchFormat}</span>
        {stream.matchName && <span> · {stream.matchName}</span>}
      </div>
      <button style={s.watchBtn} onClick={handleWatch}>
        ▶ Watch Stream
      </button>
    </div>
  );
}

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Always load streams from admin — these are guaranteed to work
        const sRes = await axios.get("/api/streams");
        setStreams(sRes.data || []);

        // Try cricket API for scores — non-critical, may fail if no API key
        try {
          const mRes = await axios.get("/api/cricket/matches");
          setMatches(mRes.data?.data || []);
        } catch {
          // Cricket API failed (no key etc.) — streams still show fine
          setMatches([]);
        }
      } catch (e) {
        setError("Could not connect to server. Make sure backend is running on port 5001.");
      } finally {
        setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  // Streams uploaded by admin
  const liveStreams    = streams.filter(s => s.isLive);
  const offlineStreams = streams.filter(s => !s.isLive);

  // Match IDs that already have an admin stream
  const streamMatchIds = new Set(streams.map(s => s.matchId));

  // Cricket API matches — only show ones that DON'T have an admin stream
  // (avoid duplicates — admin stream card is better than a plain match card)
  const liveApiMatches = matches.filter(m =>
    !streamMatchIds.has(m.id) &&
    (m.status?.toLowerCase().includes("live") || m.status?.toLowerCase().includes("progress"))
  );
  const upcomingMatches = matches.filter(m =>
    !streamMatchIds.has(m.id) &&
    !m.status?.toLowerCase().includes("live") &&
    !m.status?.toLowerCase().includes("progress")
  );

  if (loading) return <div style={s.loader}><div style={s.spinner} /></div>;

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <h1 style={s.title}>Live Cricket Streaming</h1>
        <p style={s.sub}>Watch live matches • Ball-by-ball scores • HD streams</p>
      </div>

      {error && <div style={s.error}>⚠ {error}</div>}

      {/* ── ADMIN UPLOADED LIVE STREAMS (shown first) ── */}
      {liveStreams.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <span style={s.dot} /> Live Streams ({liveStreams.length})
          </div>
          <div style={s.grid}>
            {liveStreams.map(st => (
              <StreamCard key={st._id} stream={st} />
            ))}
          </div>
        </div>
      )}

      {/* ── LIVE FROM CRICKET API (no admin stream yet) ── */}
      {liveApiMatches.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <span style={s.dot} /> Live Matches ({liveApiMatches.length})
          </div>
          <div style={s.grid}>
            {liveApiMatches.map(m => (
              <MatchCard key={m.id} match={m} hasStream={false} />
            ))}
          </div>
        </div>
      )}

      {/* ── NOTHING LIVE ── */}
      {liveStreams.length === 0 && liveApiMatches.length === 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <span style={s.dot} /> Live Now
          </div>
          <div style={s.empty}>
            No live streams right now. Check back soon! 🏏
          </div>
        </div>
      )}

      {/* ── OFFLINE STREAMS (admin uploaded, not live) ── */}
      {offlineStreams.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>Available Streams</div>
          <div style={s.grid}>
            {offlineStreams.map(st => (
              <StreamCard key={st._id} stream={st} />
            ))}
          </div>
        </div>
      )}

      {/* ── UPCOMING FROM CRICKET API ── */}
      {upcomingMatches.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>Upcoming Matches</div>
          <div style={s.grid}>
            {upcomingMatches.slice(0, 6).map(m => (
              <MatchCard key={m.id} match={m} hasStream={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}