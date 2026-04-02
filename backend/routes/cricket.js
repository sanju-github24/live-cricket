const express = require("express");
const axios = require("axios");
const router = express.Router();

const BASE = process.env.CRICKET_API_BASE;
const KEY  = process.env.CRICKET_API_KEY;

// ── GET /api/cricket/matches  →  all current matches
router.get("/matches", async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE}/currentMatches?apikey=${KEY}&offset=0`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch matches", details: err.message });
  }
});

// ── GET /api/cricket/score/:id  →  live scorecard
router.get("/score/:id", async (req, res) => {
  try {
    const { data } = await axios.get(
      `${BASE}/match_scorecard?apikey=${KEY}&id=${req.params.id}`
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch scorecard", details: err.message });
  }
});

// ── GET /api/cricket/series  →  series list
router.get("/series", async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE}/series?apikey=${KEY}&offset=0`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch series" });
  }
});

// ── GET /api/cricket/info/:id  →  match info
router.get("/info/:id", async (req, res) => {
  try {
    const { data } = await axios.get(
      `${BASE}/match_info?apikey=${KEY}&id=${req.params.id}`
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch match info" });
  }
});

module.exports = router;
