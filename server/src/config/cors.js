/** @format */

const corsOptions = {
  origin: "https://finance-manager-xxjq.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-refresh-token",
    "Access-Control-Allow-Origin",
  ],
};

module.exports = corsOptions;
