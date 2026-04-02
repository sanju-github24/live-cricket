const express = require("express");
const jwt     = require("jsonwebtoken");
const router  = express.Router();
const Admin   = require("../models/Admin");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await admin.comparePassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, username: admin.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/register  (run once to create admin)
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await Admin.findOne({ username });
    if (existing) return res.status(400).json({ error: "Admin already exists" });
    const admin = new Admin({ username, password });
    await admin.save();
    res.status(201).json({ message: "Admin created", username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
