import { isDatabaseConnected } from '../db/db.js';

// Middleware to check database connection before processing requests
export const checkDatabaseConnection = (req, res, next) => {
  if (!isDatabaseConnected()) {
    return res.status(503).json({
      success: false,
      message: "Database connection failed",
      error: "Service temporarily unavailable. Please try again later."
    });
  }
  next();
};

// Middleware for optional database check (warns but doesn't block)
export const warnDatabaseConnection = (req, res, next) => {
  if (!isDatabaseConnected()) {
    console.warn("⚠️  Database not connected for request:", req.path);
  }
  next();
};
