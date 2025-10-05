import express from "express";
import cors from "cors";

// Import routes — use relative paths from `src/`
import authRoutes from "./routes/auth.routes";

const app = express();

// ------------------------
// Middleware
// ------------------------
app.use(cors());
app.use(express.json());

// ------------------------
// Health check route
// ------------------------
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ------------------------
// API Routes
// ------------------------
app.use("/api/auth", authRoutes);

// ------------------------
// Export the app
// ------------------------
export default app;
