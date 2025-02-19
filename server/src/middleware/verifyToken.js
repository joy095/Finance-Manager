/** @format */
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const verifyJWT = (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];

  const token = authHeader.split(" ")[1];

  if (!token) {
    logger.warn("Access attempt without valid token!");

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.error("JWT verification failed:", err);
      return res.status(403).json({
        success: false,
        message: "Invalid token",
      });
    }

    // req.user = user;
    req.user = {
      id: decoded.userId,
      username: decoded.username,
    };
    next();
  });
};

module.exports = { verifyJWT };
