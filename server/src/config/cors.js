/** @format */

const corsOptions = {
  origin: "https://finance-manager-xxjq.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-refresh-token",
  ],
};

module.exports = corsOptions;
