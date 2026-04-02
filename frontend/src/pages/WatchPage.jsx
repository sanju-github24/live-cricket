import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "";

const s = {
  page: { maxWidth: 1200, margin: "0 auto", padding: "1.5rem" },
  back: {
    color: "var(--muted)", fontSize: ".85rem", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: ".4rem",
    marginBottom: "1rem", background: "none", border: "none",
  },
  layout: { display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.2rem" },
  playerWrap: {
    background: "#000", borderRadius: 12, overflow: "hidden",
    aspectRatio: "16/9", position: "relative",
  },
  video: { width: "100%", height: "100%", display: "block" },
  iframe: { width: "100%", height: "100%", border: "none" },
  sidebar: { display: "flex", flexDirection: "column", gap: "1rem" },
  scoreCard: {
    background: "var(--card)", border: "1px solid var(--border)",
    borderRadius: 12, padding: "1.2rem", flex: 1,
  },
  sLabel: {
    fontSize: ".68rem", fontWeight: 700, letterSpacing: ".1em",
    color: "var(--accent)", textTransform: "uppercase", marginBottom: ".8rem",
    display: "flex", alignItems: "center", gap: ".4rem",
  },
  dot: {
    width: 6, height: 6, borderRadius: "50%",
    background: "var(--accent)", animation: "pulse 1.2s infinite",
  },
  matchTitle: { fontWeight: 600, fontSize: ".95rem", marginBottom: ".8rem" },
  scoreRow: {
    display: "flex", justifyContent: "space-between", alignItems: "baseline",
    padding: ".6rem 0", borderBottom: "1px solid var(--border)",
  },
  teamN: { fontSize: ".82rem", color: "var(--muted)" },
  score: { fontWeight: 700, fontSize: "1.1rem" },
  status: {
    fontSize: ".78rem", color: "var(--accent)",
    marginTop: ".7rem", padding: ".5rem .8rem",
    background: "rgba(0,230,118,0.08)", borderRadius: 6,
  },
  battersBox: {
    background: "var(--card)", border: "1px solid var(--border)",
    borderRadius: 12, padding: "1rem",
  },
  batter: {
    display: "flex", justifyContent: "space-between",
    fontSize: ".82rem", padding: ".4rem 0",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  noStream: {
    display: "flex", alignItems: "center", justifyContent: "center",
    flexDirection: "column", gap: "1rem", height: "100%",
    color: "var(--muted)",
  },
};

export default function WatchPage() {
  const { id }  = useParams();
  const nav     = useNavigate();
  const videoRef = useRef(null);
  const [stream,  setStream]  = useState(null);
  const [score,   setScore]   = useState(null);
  const [loading, setLoad]    = useState(true);

  // Load stream info + initial score
  useEffect(() => {
    Promise.all([
      axios.get(`${BASE}/api/streams/${id}`).catch(() => null),
      axios.get(`${BASE}/api/cricket/score/${id}`).catch(() => null),
    ]).then(([sRes, cRes]) => {
      setStream(sRes?.data);
      setScore(cRes?.data?.data);
      setLoad(false);
    });
  }, [id]);

  // Poll score every 15s
  useEffect(() => {
    const t = setInterval(() => {
      axios.get(`${BASE}/api/cricket/score/${id}`)
        .then((r) => setScore(r.data?.data))
        .catch(() => {});
    }, 15000);
    return () => clearInterval(t);
  }, [id]);

  // Add this helper at the top of the component
function extractSrc(raw) {
  if (!raw) return null;
  if (raw.trim().startsWith("<iframe")) {
    const match = raw.match(/src=["']([^"']+)["']/);
    return match ? match[1] : null;
  }
  return raw;
}

  // HLS player setup
  useEffect(() => {
    if (!stream || stream.streamType !== "hls" || !videoRef.current) return;
    import("hls.js").then(({ default: Hls }) => {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(stream.streamUrl);
        hls.attachMedia(videoRef.current);
        return () => hls.destroy();
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = stream.streamUrl;
      }
    });
  }, [stream]);

const renderPlayer = () => {
  if (!stream) return (
    <div style={s.noStream}>
      <span style={{ fontSize: "3rem" }}>📡</span>
      <p>Stream not available yet</p>
      <p style={{ fontSize: ".8rem" }}>Check back soon or view scorecard</p>
    </div>
  );

  if (stream.streamType === "iframe" || stream.streamType === "youtube") {
     let src = extractSrc(stream.streamUrl); 
     if (!src) return <div style={s.noStream}>Invalid stream URL</div>;

    if (stream.streamType === "youtube") {
      // Handle all YouTube URL formats
      if (src.includes("youtu.be/")) {
        const videoId = src.split("youtu.be/")[1].split("?")[0];
        src = `https://www.youtube.com/embed/${videoId}`;
      } else if (src.includes("watch?v=")) {
        const videoId = new URL(src).searchParams.get("v");
        src = `https://www.youtube.com/embed/${videoId}`;
      } else if (src.includes("/embed/")) {
        // Already an embed URL, use as-is
        src = src;
      }
      // Append autoplay + mute so browsers don't block it
      src += (src.includes("?") ? "&" : "?") + "autoplay=1&mute=1";
    }

    return (
      <iframe
        key={src}
        src={src}
        style={s.iframe}
        allowFullScreen
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return <video ref={videoRef} style={s.video} controls autoPlay playsInline />;
};

  const liveScore = score?.score;
  const batters   = score?.scorecard?.[score.scorecard.length - 1]?.batting?.filter(b => !b.dismissal || b.dismissal === "batting") || [];

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => nav(-1)}>← Back to matches</button>

      <div style={s.layout}>
        {/* Video Player */}
        <div>
          <div style={s.playerWrap}>{renderPlayer()}</div>
          {stream && (
            <div style={{ marginTop: ".8rem" }}>
              <div style={{ fontWeight: 600, fontSize: "1.05rem" }}>
                {stream.matchName}
              </div>
              <div style={{ color: "var(--muted)", fontSize: ".82rem", marginTop: ".2rem" }}>
                {stream.tournament} • {stream.matchFormat}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={s.sidebar}>
          {/* Live Score */}
          <div style={s.scoreCard}>
            <div style={s.sLabel}><span style={s.dot} /> Live Score</div>
            <div style={s.matchTitle}>{score?.name || "Loading..."}</div>
            {liveScore?.map((inn, i) => (
              <div key={i} style={s.scoreRow}>
                <span style={s.teamN}>{inn.inning?.split(" Inning")[0]}</span>
                <span style={s.score}>{inn.r}/{inn.w} <span style={{ fontSize: ".75rem", fontWeight: 400, color: "var(--muted)" }}>({inn.o})</span></span>
              </div>
            ))}
            {score?.status && <div style={s.status}>{score.status}</div>}
          </div>

          {/* Current Batters */}
          {batters.length > 0 && (
            <div style={s.battersBox}>
              <div style={{ ...s.sLabel, marginBottom: ".6rem" }}>🏏 At Crease</div>
              {batters.slice(0, 2).map((b, i) => (
                <div key={i} style={s.batter}>
                  <span>{b.batsman?.name || "Batsman"}</span>
                  <span style={{ fontWeight: 600 }}>{b.r}({b.b})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
