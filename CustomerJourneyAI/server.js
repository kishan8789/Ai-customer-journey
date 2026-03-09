require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Fix: Production mein issues avoid karne ke liye
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Body Parser with limit (Kabhi kabhi bada data aane par fail ho jata hai)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* =========================
    DATABASE CONNECTION
========================= */
const MONGO_URI = process.env.MONGO_URI; 

if (!MONGO_URI) {
  console.error("❌ CRITICAL: MONGO_URI is not defined in Environment Variables!");
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected: Neural Matrix Online"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

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

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "Active", database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected" });
});

// Create Customer (Inject Node)
app.post("/api/customers", async (req, res) => {
  try {
    const { name, email, visits, purchases } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ message: "Identity and Email are required for injection." });
    }

    // Advanced Matrix Calculation
    const v = Number(visits) || 0;
    const p = Number(purchases) || 0;
    const score = Math.min(100, (v * 6) + (p * 25));
    const stage = p > 0 ? "Purchase" : (v >= 5 ? "Consideration" : "Awareness");

    const customer = await Customer.create({ 
      name, 
      email, 
      visits: v, 
      purchases: p, 
      engagementScore: score, 
      stage 
    });

    res.status(201).json(customer);
  } catch (err) {
    console.error("❌ Post Error:", err.message);
    res.status(500).json({ message: "Injection Protocol Failed", error: err.message });
  }
});

// Get All Customers
app.get("/api/customers", async (req, res) => {
  try {
    const data = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Matrix Retrieval Failed" });
  }
});

// Analytics
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
    res.status(500).json({ message: "Analytics processing failed" });
  }
});

/* =========================
    SERVE REACT FRONTEND
========================= */
// Ye part sabse imp hai Render ke liye
const frontendBuildPath = path.join(__dirname, "frontend", "dist");

if (fs.existsSync(frontendBuildPath)) {
    app.use(express.static(frontendBuildPath));
    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendBuildPath, "index.html"));
    });
} else {
    // Agar local pe chala rahe ho bina build ke
    app.get("/", (req, res) => {
        res.send("Backend is running. Please build frontend to see the UI.");
    });
}

app.listen(PORT, () => {
  console.log(`🚀 Neural Server Live on Port ${PORT}`);
});
