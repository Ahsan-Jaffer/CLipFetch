function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  const isProduction = process.env.NODE_ENV === "production";

  const response = {
    success: false,
    message:
      statusCode === 500 && isProduction
        ? "Something went wrong on the server. Please try again later."
        : err.message || "Something went wrong on the server.",
  };

  if (err.details) {
    response.details = err.details;
  }

  if (!isProduction) {
    response.stack = err.stack;
  }

  console.error("API Error:", {
    message: err.message,
    statusCode,
    method: req.method,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });

  return res.status(statusCode).json(response);
}

module.exports = errorHandler;