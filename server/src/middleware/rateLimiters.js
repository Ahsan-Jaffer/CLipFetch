const rateLimit = require("express-rate-limit");

const analyzeLimit = Number(process.env.ANALYZE_RATE_LIMIT_PER_MINUTE || 30);
const downloadLimit = Number(process.env.DOWNLOAD_RATE_LIMIT_PER_MINUTE || 5);

const analyzeRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: analyzeLimit,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many analyze requests. Please wait a moment and try again.",
  },
});

const downloadRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: downloadLimit,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many download requests. Please wait a moment before starting another download.",
  },
});

module.exports = {
  analyzeRateLimiter,
  downloadRateLimiter,
};