require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS ko update kiya taaki production mein problem na aaye
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

/* =========================
    DATABASE CONNECTION
========================= */
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/customerAI";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

/* =========================
    MODELS
========================= */
const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  visits: { type: Number, default: 0 },
  purchases: { type: Number, default: 0 },
  engagementScore: { type: Number, default: 0 },
  stage: { 
    type: String, 
    enum: ["Awareness", "Consideration", "Purchase", "Unknown"], 
    default: "Awareness" 
  },
}, { timestamps: true });

const Customer = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

/* =========================
    ROUTES (API)
========================= */

app.get("/api/health", (req, res) => {
  res.json({ status: "Online", uptime: process.uptime() });
});

app.post("/api/customers", async (req, res) => {
  try {
    const { name, email, visits = 0, purchases = 0 } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Missing fields" });

    const score = Math.min(100, (Number(visits) * 6) + (Number(purchases) * 25));
    const stage = purchases > 0 ? "Purchase" : (visits >= 5 ? "Consideration" : "Awareness");

    const customer = await Customer.create({ name, email, visits, purchases, engagementScore: score, stage });
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/customers", async (req, res) => {
  try {
    const data = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

app.get("/api/analytics", async (req, res) => {
  try {
    const customers = await Customer.find();
    const stats = { Awareness: 0, Consideration: 0, Purchase: 0 };
    customers.forEach(c => { if (stats[c.stage] !== undefined) stats[c.stage]++; });
    res.json({
      totalCustomers: customers.length,
      stageDistribution: stats,
      averageEngagement: customers.length > 0 
        ? (customers.reduce((acc, curr) => acc + curr.engagementScore, 0) / customers.length).toFixed(2)
        : 0
    });
  } catch (err) {
    res.status(500).json({ message: "Analytics failed" });
  }
});

/* =========================
    SERVE REACT FRONTEND
========================= */
// Render par path setup
const frontendPath = fs.existsSync(path.join(__dirname, "frontend", "dist")) 
  ? path.join(__dirname, "frontend", "dist") 
  : path.join(__dirname, "frontend", "build");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  const indexFile = path.join(frontendPath, "index.html");
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.status(404).json({ message: "Frontend build not found at " + indexFile });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
