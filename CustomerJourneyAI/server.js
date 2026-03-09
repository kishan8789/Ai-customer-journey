require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ✅ Port Logic
const PORT = process.env.PORT || 5000;

// ✅ Optimized CORS (Frontend aur Backend ke beech communication gap khatam karne ke liye)
app.use(cors()); 
app.use(express.json());

/* =========================
    DATABASE CONNECTION
========================= */
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/customerAI";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected: Neural Matrix Online"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    // process.exit(1) ko hata diya hai taaki server crash na ho, retry kare
  });

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

// Prevent model overwrite error (Production safe)
const Customer = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

/* =========================
    ROUTES
========================= */

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "Nexus AI Engine Running",
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// ➕ Add Customer (Node Injection)
app.post("/api/customers", async (req, res) => {
  try {
    const { name, email, visits = 0, purchases = 0 } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and Email are required" });
    }

    // Advanced Digital Marketing Logic
    const score = Math.min(100, (Number(visits) * 6) + (Number(purchases) * 25));
    const stage = purchases > 0 
      ? "Purchase" 
      : (visits >= 5 ? "Consideration" : "Awareness");

    const customer = await Customer.create({
      name,
      email,
      visits,
      purchases,
      engagementScore: score,
      stage
    });

    console.log(`📈 New Node Added: ${name} (${stage})`);
    res.status(201).json(customer);

  } catch (err) {
    console.error("Post Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 📥 Get All Customers
app.get("/api/customers", async (req, res) => {
  try {
    // Sorting by newest first
    const data = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch data from Matrix" });
  }
});

// 📊 Analytics Data
app.get("/api/analytics", async (req, res) => {
  try {
    const customers = await Customer.find();
    const stats = { Awareness: 0, Consideration: 0, Purchase: 0 };

    customers.forEach(c => {
      if (stats[c.stage] !== undefined) {
        stats[c.stage]++;
      }
    });

    res.json({
      totalCustomers: customers.length,
      stageDistribution: stats,
      averageEngagement: customers.length > 0 
        ? (customers.reduce((acc, curr) => acc + curr.engagementScore, 0) / customers.length).toFixed(2)
        : 0
    });
  } catch (err) {
    res.status(500).json({ message: "Analytics synchronization failed" });
  }
});

/* =========================
    SERVE REACT FRONTEND
========================= */
// Ye logic tabhi kaam karega jab aap 'npm run build' frontend folder mein chalayenge
const buildPath = path.join(__dirname, "frontend", "build");
app.use(express.static(buildPath));

app.get("*", (req, res) => {
  // Check if build exists, else send a JSON message (helpful for debugging)
  const indexFile = path.join(buildPath, "index.html");
  res.sendFile(indexFile, (err) => {
    if (err) {
      res.status(200).json({ message: "API is running. Frontend build not found." });
    }
  });
});

/* =========================
    SERVER START
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Nexus AI Engine running on port ${PORT}`);
});
