/** @format */

const mongoose = require("mongoose");
const logger = require("../utils/logger");

const dbConn = async () => {
  if (!process.env.MONGODB_URI) {
    logger.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    // Actually connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    logger.info("MongoDB Connected");

    // Set up event listeners after successful connection
    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected");
    });

    return mongoose.connection;
  } catch (error) {
    logger.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = dbConn;
