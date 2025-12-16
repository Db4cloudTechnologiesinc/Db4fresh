export function errorHandler(err, req, res, next) {
  console.error("❗ Error caught:", err);
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    status,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
}
