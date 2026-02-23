const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- MOCK DATABASE (For Demo) ---
// Placement grade project ke liye proper models yahan aayenge
const mockAnalytics = {
  awareness: 12500,
  consideration: 4200,
  purchase: 850,
  churnRisk: 12,
  topChannel: "Instagram Ads"
};

// --- API ROUTES ---
app.get("/api/dashboard-stats", (req, res) => {
  res.json(mockAnalytics);
});

// --- ⭐ THE MAGIC: SERVE REACT FRONTEND IN PRODUCTION ---
// Yeh line aapke Vite React app ko backend ke saath jod deti hai
app.use(express.static(path.join(__dirname, "frontend", "dist")));

// Agar koi bhi aisi route aati hai jo API nahi hai, toh React ko bhej do
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 AI Engine running on port ${PORT}`);
});