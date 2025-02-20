/** @format */

require("dotenv").config();
const logger = require("./utils/logger");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { RateLimiterMongo } = require("rate-limiter-flexible");
const { rateLimit } = require("express-rate-limit");
const MongoStore = require("rate-limit-mongo");
const authRoutes = require("./routes/userRoute");
const transactionRoutes = require("./routes/transactionRoute");
const budgetRoutes = require("./routes/budgetRoute");
const errorHandler = require("./middleware/errorHandler");
const dbConn = require("./config/dbConn");
const corsOptions = require("./config/cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

async function waitForConnection(timeoutMs = 30000) {
  // Same implementation as before
  return new Promise((resolve, reject) => {
    if (mongoose.connection.readyState === 1) {
      return resolve();
    }

    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error("MongoDB connection timeout"));
    }, timeoutMs);

    function cleanup() {
      mongoose.connection.removeListener("connected", onConnect);
      mongoose.connection.removeListener("error", onError);
      clearTimeout(timeoutId);
    }

    function onConnect() {
      cleanup();
      resolve();
    }

    function onError(err) {
      cleanup();
      reject(err);
    }

    mongoose.connection.once("connected", onConnect);
    mongoose.connection.once("error", onError);
  });
}

async function startServer() {
  // Same implementation as before
  try {
    logger.info("Starting server initialization...");

    // Database connection
    await dbConn();
    logger.info("Initial database connection established");

    // Wait for MongoDB to be fully connected
    logger.info(
      `Current MongoDB connection state: ${mongoose.connection.readyState}`
    );
    if (mongoose.connection.readyState !== 1) {
      logger.info("Waiting for MongoDB connection to be ready...");
      await waitForConnection();
      logger.info("MongoDB connection is now fully established");
    }

    // Verify connection again
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB connection not ready after waiting");
    }

    // Initialize rate limiter
    logger.info("Initializing rate limiter...");
    const rateLimiter = new RateLimiterMongo({
      storeClient: mongoose.connection,
      keyPrefix: "middleware",
      points: 10,
      duration: 1,
      tableName: "rateLimits",
      timeoutMs: 5000,
    });
    logger.info("Rate limiter initialized");

    // Middleware setup
    logger.info("Setting up middleware...");

    app.use(helmet());
    app.use(cors(corsOptions));
    app.use(express.json());

    // Rate limiter middleware
    app.use(async (req, res, next) => {
      try {
        await rateLimiter.consume(req.ip);
        next();
      } catch (error) {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({ success: false, message: "Too many requests" });
      }
    });

    // Logging middleware
    app.use((req, res, next) => {
      logger.info(`Received ${req.method} request to ${req.url}`);
      if (Object.keys(req.body).length > 0) {
        logger.info("Request body:", req.body);
      }
      next();
    });

    // Setup rate limiting for sensitive endpoints
    logger.info("Setting up sensitive endpoints rate limiting...");
    const sensitiveEndpointsLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 50,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({ success: false, message: "Too many requests" });
      },
      store: new MongoStore({
        uri: process.env.MONGODB_URI,
        collectionName: "sensitiveRateLimit",
        expireTimeMs: 15 * 60 * 1000,
      }),
    });

    app.get("/health", (req, res) => {
      res.send("OK");
    });

    // Apply rate limiting to specific routes
    app.use("/api/auth/register", sensitiveEndpointsLimiter);

    // Setup routes
    logger.info("Setting up routes...");
    app.use("/api/auth", authRoutes);
    app.use("/api/transaction", transactionRoutes);
    app.use("/api/budget", budgetRoutes);

    // Error handler
    app.use(errorHandler);

    // Start the server
    const server = app.listen(PORT, () => {
      logger.info(`Identity service running on port ${PORT}`);
    });

    // Add connection error handler
    mongoose.connection.on("error", (error) => {
      logger.error("MongoDB connection error:", error);
      process.exit(1);
    });

    // Add disconnection handler
    mongoose.connection.on("disconnected", () => {
      logger.error("MongoDB disconnected");
      process.exit(1);
    });

    return server;
  } catch (error) {
    logger.error("Server startup failed:", error);
    process.exit(1);
  }
}

// Only start the server when this file is run directly (not imported)
if (require.main === module) {
  startServer().catch((error) => {
    logger.error("Failed to start server:", error);
    process.exit(1);
  });
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", {
    error: error.message || error,
    stack: error.stack,
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection:", {
    reason: reason.message || reason,
    stack: reason.stack,
  });
  process.exit(1);
});

// Export for testing
module.exports = { app, startServer };
