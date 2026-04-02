const express = require("express");
const router  = express.Router();
const Stream  = require("../models/Stream");
const auth    = require("../middleware/auth");

// GET all streams (public)
router.get("/", async (req, res) => {
  try {
    const streams = await Stream.find().sort({ createdAt: -1 });
    res.json(streams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET stream by matchId (public)
router.get("/:matchId", async (req, res) => {
  try {
    const stream = await Stream.findOne({ matchId: req.params.matchId });
    if (!stream) return res.status(404).json({ error: "Stream not found" });
    res.json(stream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create stream (admin only)
router.post("/", auth, async (req, res) => {
  try {
    console.log("📡 Create stream body:", req.body);

    const { matchId, matchName, team1, team2, streamUrl } = req.body;

    // Validate required fields
    if (!matchId)   return res.status(400).json({ error: "matchId is required" });
    if (!matchName) return res.status(400).json({ error: "matchName is required" });
    if (!streamUrl) return res.status(400).json({ error: "streamUrl is required" });
    if (!team1)     return res.status(400).json({ error: "team1 is required" });
    if (!team2)     return res.status(400).json({ error: "team2 is required" });

    // Check if stream for this matchId already exists
    const existing = await Stream.findOne({ matchId });
    if (existing) {
      return res.status(400).json({ error: `Stream for matchId "${matchId}" already exists. Update it instead.` });
    }

    const stream = new Stream(req.body);
    await stream.save();

    console.log("✅ Stream saved:", stream._id);
    res.status(201).json({ success: true, stream });
  } catch (err) {
    console.error("❌ Stream create error:", err.message);
    // Mongoose validation error
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT update stream (admin only)
router.put("/:id", auth, async (req, res) => {
  try {
    const stream = await Stream.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!stream) return res.status(404).json({ error: "Stream not found" });
    res.json({ success: true, stream });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE stream (admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    await Stream.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Stream deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;