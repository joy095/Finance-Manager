/** @format */

const whitelist = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://finance-manager-xxjq.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // For development and testing - allow requests with no origin
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-refresh-token",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Headers",
  ],
  exposedHeaders: ["set-cookie", "Authorization"],
  preflightContinue: false, // Changed to false to handle OPTIONS automatically
  optionsSuccessStatus: 200, // Changed to 200 for better compatibility
  maxAge: 86400, // Add cache for preflight requests (24 hours)
};

module.exports = corsOptions;
