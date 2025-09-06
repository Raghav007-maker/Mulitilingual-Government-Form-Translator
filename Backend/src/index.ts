import express from "express";
import cors from "cors";
import { translateRouter } from "./routes/translate.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    service: "multilingual-form-translator-backend"
  });
});

// API routes
app.use("/api", translateRouter);

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong"
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
