const mongoose = require("mongoose");

const StreamSchema = new mongoose.Schema(
  {
    matchId:     { type: String, required: [true, "matchId is required"] },
    matchName:   { type: String, required: [true, "matchName is required"] },
    team1:       { type: String, required: [true, "team1 is required"] },
    team2:       { type: String, required: [true, "team2 is required"] },
    streamUrl:   { type: String, required: [true, "streamUrl is required"] },
    streamType:  { type: String, enum: ["hls", "iframe", "youtube"], default: "hls" },
    thumbnail:   { type: String, default: "" },
    isLive:      { type: Boolean, default: true },
    matchDate:   { type: Date, default: Date.now },
    matchFormat: { type: String, enum: ["T20", "ODI", "Test", "T10"], default: "T20" },
    tournament:  { type: String, default: "" },
    addedBy:     { type: String, default: "admin" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stream", StreamSchema);