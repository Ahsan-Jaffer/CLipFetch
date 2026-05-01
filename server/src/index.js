const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const analyzeRoutes = require("./routes/analyzeRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const errorHandler = require("./middleware/errorHandler");
const notFoundHandler = require("./middleware/notFoundHandler");
const {
  analyzeRateLimiter,
  downloadRateLimiter,
} = require("./middleware/rateLimiters");
const { startCleanupService } = require("./services/cleanupService");

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const NODE_ENV = process.env.NODE_ENV || "development";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ClipFetch API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "ClipFetch API",
    environment: NODE_ENV,
    limits: {
      maxVideoDurationSeconds: Number(
        process.env.MAX_VIDEO_DURATION_SECONDS || 7200
      ),
      tempFileMaxAgeMinutes: Number(
        process.env.TEMP_FILE_MAX_AGE_MINUTES || 30
      ),
      analyzeRateLimitPerMinute: Number(
        process.env.ANALYZE_RATE_LIMIT_PER_MINUTE || 30
      ),
      downloadRateLimitPerMinute: Number(
        process.env.DOWNLOAD_RATE_LIMIT_PER_MINUTE || 5
      ),
    },
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/analyze", analyzeRateLimiter, analyzeRoutes);
app.use("/api/download", downloadRateLimiter, downloadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startCleanupService();
});