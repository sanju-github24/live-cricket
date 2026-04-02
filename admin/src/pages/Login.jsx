import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../App";

const s = {
  wrap: {
    minHeight: "100vh", display: "flex",
    alignItems: "center", justifyContent: "center",
    background: "radial-gradient(ellipse at 50% 0%, rgba(0,230,118,0.08) 0%, transparent 60%)",
  },
  box: {
    width: 380, background: "var(--bg2)",
    border: "1px solid var(--border)", borderRadius: 16,
    padding: "2.5rem", animation: "fadeIn .4s ease",
  },
  logo: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem",
    letterSpacing: ".05em", textAlign: "center", marginBottom: ".4rem",
    background: "linear-gradient(135deg,#00e676,#00bcd4)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  sub: { textAlign: "center", color: "var(--muted)", fontSize: ".85rem", marginBottom: "2rem" },
  field: { marginBottom: "1rem" },
  label: { fontSize: ".78rem", color: "var(--muted)", display: "block", marginBottom: ".4rem" },
  btn: {
    width: "100%", padding: ".75rem",
    background: "var(--accent)", color: "#000",
    border: "none", borderRadius: 8, fontWeight: 700,
    fontSize: ".95rem", marginTop: ".5rem",
    transition: "opacity .2s",
  },
  error: {
    background: "rgba(255,71,87,0.1)", border: "1px solid rgba(255,71,87,0.2)",
    color: "var(--red)", borderRadius: 7, padding: ".6rem .9rem",
    fontSize: ".82rem", marginBottom: ".8rem",
  },
};

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setErr] = useState("");
  const [loading, setLoad] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoad(true); setErr("");
    try {
      const { data } = await axios.post("/api/auth/login", form);
      login(data.token);
      nav("/");
    } catch {
      setErr("Invalid username or password");
    } finally {
      setLoad(false);
    }
  };

  return (
    <div style={s.wrap}>
      <div style={s.box}>
        <div style={s.logo}>CricLive</div>
        <div style={s.sub}>Admin Panel</div>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={submit}>
          <div style={s.field}>
            <label style={s.label}>Username</label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="admin"
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <button style={s.btn} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
