import React, { useEffect, useState } from "react";
import axios from "axios";
import MatchCard from "../components/MatchCard";

const BASE = import.meta.env.VITE_API_URL || "";

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
  streamCard: {
    background: "var(--card)",
    border: "1px solid rgba(0,230,118,0.25)",
    borderRadius: 12,
    overflow: "hidden",
    animation: "fadeIn .4s ease both",
    position: "relative",
    cursor: "pointer",
    transition: "transform .2s, box-shadow .2s",
  },
  streamGlow: {
    position: "absolute", top: 0, left: 0, right: 0,
    height: 2, zIndex: 1,
    background: "linear-gradient(90deg,#00e676,#00bcd4)",
  },
  thumbnail: {
    width: "100%", aspectRatio: "16/9",
    objectFit: "cover", display: "block",
  },
  thumbnailPlaceholder: {
    width: "100%", aspectRatio: "16/9",
    background: "linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #091420 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "3rem", position: "relative", overflow: "hidden",
  },
  thumbnailOverlay: {
    position: "absolute", inset: 0,
    background: "radial-gradient(ellipse at center, rgba(0,230,118,0.06) 0%, transparent 70%)",
  },
  cardBody: { padding: "1rem 1.2rem 1.2rem" },
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

function StreamCard({ stream }) {
  const handleWatch = () => {
    window.location.href = `/watch/${stream.matchId}`;
  };

  return (
    <div
      style={s.streamCard}
      onClick={handleWatch}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,230,118,0.12)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={s.streamGlow} />

      {/* Thumbnail or placeholder */}
      {stream.thumbnail ? (
        <img
          src={stream.thumbnail}
          alt={stream.matchName}
          style={s.thumbnail}
          onError={(e) => {
            // If image fails, swap to placeholder div
            e.target.replaceWith((() => {
              const d = document.createElement("div");
              d.style.cssText = "width:100%;aspect-ratio:16/9;background:linear-gradient(135deg,#0a1628,#0d2137);display:flex;align-items:center;justify-content:center;font-size:3rem";
              d.textContent = "🏏";
              return d;
            })());
          }}
        />
      ) : (
        <div style={s.thumbnailPlaceholder}>
          <div style={s.thumbnailOverlay} />
          <span style={{ position: "relative", zIndex: 1 }}>🏏</span>
        </div>
      )}

      {/* Card body */}
      <div style={s.cardBody}>
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
        <button
          style={s.watchBtn}
          onClick={(e) => { e.stopPropagation(); handleWatch(); }}
          onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          ▶ Watch Stream
        </button>
      </div>
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
        const sRes = await axios.get(`${BASE}/api/streams`);
        setStreams(sRes.data || []);
        try {
          const mRes = await axios.get(`${BASE}/api/cricket/matches`);
          setMatches(mRes.data?.data || []);
        } catch {
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

  const liveStreams    = streams.filter(s => s.isLive);
  const offlineStreams = streams.filter(s => !s.isLive);
  const streamMatchIds = new Set(streams.map(s => s.matchId));

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

      {liveStreams.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <span style={s.dot} /> Live Streams ({liveStreams.length})
          </div>
          <div style={s.grid}>
            {liveStreams.map(st => <StreamCard key={st._id} stream={st} />)}
          </div>
        </div>
      )}

      {liveApiMatches.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <span style={s.dot} /> Live Matches ({liveApiMatches.length})
          </div>
          <div style={s.grid}>
            {liveApiMatches.map(m => <MatchCard key={m.id} match={m} hasStream={false} />)}
          </div>
        </div>
      )}

      {liveStreams.length === 0 && liveApiMatches.length === 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}><span style={s.dot} /> Live Now</div>
          <div style={s.empty}>No live streams right now. Check back soon! 🏏</div>
        </div>
      )}

      {offlineStreams.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>Available Streams</div>
          <div style={s.grid}>
            {offlineStreams.map(st => <StreamCard key={st._id} stream={st} />)}
          </div>
        </div>
      )}

      {upcomingMatches.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>Upcoming Matches</div>
          <div style={s.grid}>
            {upcomingMatches.slice(0, 6).map(m => <MatchCard key={m.id} match={m} hasStream={false} />)}
          </div>
        </div>
      )}
    </div>
  );
}