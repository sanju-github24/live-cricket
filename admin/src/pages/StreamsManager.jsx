import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";

const s = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" },
  title: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: ".04em" },
  addBtn: {
    background: "var(--accent)", color: "#000",
    border: "none", borderRadius: 8, padding: ".55rem 1.2rem",
    fontWeight: 700, fontSize: ".88rem",
  },
  table: {
    width: "100%", borderCollapse: "collapse",
    background: "var(--card)", borderRadius: 12,
    overflow: "hidden", border: "1px solid var(--border)",
  },
  th: {
    fontSize: ".72rem", color: "var(--muted)", padding: ".9rem 1rem",
    textAlign: "left", borderBottom: "1px solid var(--border)",
    background: "var(--bg2)", fontWeight: 600, letterSpacing: ".06em",
    textTransform: "uppercase",
  },
  td: { fontSize: ".85rem", padding: ".8rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.04)", verticalAlign: "middle" },
  liveTag: {
    fontSize: ".65rem", fontWeight: 700, padding: "2px 7px",
    borderRadius: 4, background: "rgba(0,230,118,0.12)", color: "var(--accent)",
  },
  offTag: {
    fontSize: ".65rem", fontWeight: 700, padding: "2px 7px",
    borderRadius: 4, background: "rgba(255,255,255,0.06)", color: "var(--muted)",
  },
  editBtn: {
    background: "rgba(0,188,212,0.1)", border: "1px solid rgba(0,188,212,0.2)",
    color: "#00bcd4", borderRadius: 6, padding: "4px 12px",
    fontSize: ".78rem", marginRight: ".4rem",
  },
  delBtn: {
    background: "rgba(255,71,87,0.1)", border: "1px solid rgba(255,71,87,0.2)",
    color: "var(--red)", borderRadius: 6, padding: "4px 12px", fontSize: ".78rem",
  },
  toggleBtn: {
    background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.2)",
    color: "var(--accent)", borderRadius: 6, padding: "4px 10px", fontSize: ".78rem",
    marginRight: ".4rem",
  },
  modal: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 999,
  },
  modalBox: {
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: 14, padding: "2rem", width: 520, maxHeight: "80vh",
    overflow: "auto", animation: "fadeIn .2s ease",
  },
  modalTitle: { fontWeight: 700, fontSize: "1.05rem", marginBottom: "1.2rem" },
  field: { marginBottom: ".9rem" },
  label: { fontSize: ".75rem", color: "var(--muted)", display: "block", marginBottom: ".3rem" },
  saveBtn: {
    background: "var(--accent)", color: "#000",
    border: "none", borderRadius: 7, padding: ".6rem 1.5rem",
    fontWeight: 700, fontSize: ".9rem", marginRight: ".6rem",
  },
  cancelBtn: {
    background: "transparent", border: "1px solid var(--border)",
    color: "var(--muted)", borderRadius: 7, padding: ".6rem 1.2rem", fontSize: ".9rem",
  },
  empty: { textAlign: "center", color: "var(--muted)", padding: "3rem" },
};

export default function StreamsManager() {
  const [streams, setStreams] = useState([]);
  const [editing, setEditing] = useState(null);
  const { token } = useAuth();
  const nav = useNavigate();

  const load = () =>
    axios.get("/api/streams").then((r) => setStreams(r.data || []));

  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!confirm("Delete this stream?")) return;
    await axios.delete(`/api/streams/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  const toggle = async (st) => {
    await axios.put(`/api/streams/${st._id}`, { ...st, isLive: !st.isLive }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  };

  const save = async () => {
    await axios.put(`/api/streams/${editing._id}`, editing, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEditing(null);
    load();
  };

  const set = (k) => (e) =>
    setEditing((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.title}>Streams ({streams.length})</h1>
        <button style={s.addBtn} onClick={() => nav("/add")}>➕ Add Stream</button>
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            {["Match","Format","Type","Status","Actions"].map((h) => (
              <th key={h} style={s.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {streams.map((st) => (
            <tr key={st._id}>
              <td style={s.td}>
                <div style={{ fontWeight: 500 }}>{st.matchName}</div>
                <div style={{ fontSize: ".72rem", color: "var(--muted)", marginTop: ".1rem" }}>{st.tournament}</div>
              </td>
              <td style={s.td}>{st.matchFormat}</td>
              <td style={s.td}>{st.streamType}</td>
              <td style={s.td}>
                {st.isLive
                  ? <span style={s.liveTag}>● LIVE</span>
                  : <span style={s.offTag}>○ Off</span>}
              </td>
              <td style={s.td}>
                <button style={s.toggleBtn} onClick={() => toggle(st)}>
                  {st.isLive ? "Off" : "On"}
                </button>
                <button style={s.editBtn} onClick={() => setEditing({ ...st })}>Edit</button>
                <button style={s.delBtn} onClick={() => del(st._id)}>Del</button>
              </td>
            </tr>
          ))}
          {streams.length === 0 && (
            <tr><td colSpan={5} style={s.empty}>No streams yet. Add one!</td></tr>
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editing && (
        <div style={s.modal}>
          <div style={s.modalBox}>
            <div style={s.modalTitle}>Edit Stream</div>
            {[
              ["matchName", "Match Name"],
              ["streamUrl",  "Stream URL"],
              ["tournament", "Tournament"],
            ].map(([k, lbl]) => (
              <div key={k} style={s.field}>
                <label style={s.label}>{lbl}</label>
                <input value={editing[k] || ""} onChange={set(k)} />
              </div>
            ))}
            <div style={s.field}>
              <label style={s.label}>Stream Type</label>
              <select value={editing.streamType} onChange={set("streamType")}>
                <option value="hls">HLS (.m3u8)</option>
                <option value="youtube">YouTube</option>
                <option value="iframe">iFrame Embed</option>
              </select>
            </div>
            <div style={s.field}>
              <label style={{ ...s.label, display: "flex", alignItems: "center", gap: ".5rem" }}>
                <input type="checkbox" checked={editing.isLive} onChange={set("isLive")} style={{ width: "auto" }} />
                Mark as Live
              </label>
            </div>
            <div>
              <button style={s.saveBtn} onClick={save}>Save</button>
              <button style={s.cancelBtn} onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
