const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "public")));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/blogdb";
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Models
const User = require("./models/User");
const Post = require("./models/Post");

// Auth middleware
const { authenticateToken } = require("./middleware/auth");

// Routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

app.use("/api/auth", authRoutes);
app.use("/api/posts", authenticateToken, postRoutes);

// Serve frontend index.html for all other routes (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
