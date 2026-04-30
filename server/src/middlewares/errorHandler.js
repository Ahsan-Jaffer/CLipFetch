function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message:
      statusCode === 500
        ? "Something went wrong on the server. Please try again later."
        : err.message,
  };

  if (err.details) {
    response.details = err.details;
  }

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  console.error("Error:", {
    message: err.message,
    statusCode,
    path: req.originalUrl,
    method: req.method,
  });

  return res.status(statusCode).json(response);
}

module.exports = errorHandler;