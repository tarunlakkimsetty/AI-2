const ApiError = require('../utils/ApiError');

// Catches unmatched routes
function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
}

// Centralized error handler - always returns consistent JSON shape
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message
  });
}

module.exports = { notFound, errorHandler };
