/** @format */

const whitelist = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://finance-manager-xxjq.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // For development and testing - allow requests with no origin (like mobile apps or curl requests)
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
  ],
  exposedHeaders: ["set-cookie"],
  preflightContinue: true,
  optionsSuccessStatus: 204,
};

module.exports = corsOptions;
