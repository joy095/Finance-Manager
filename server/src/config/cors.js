/** @format */

const whitelist = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://finance-manager-xxjq.vercel.app",
  "https://finance-manager-kzz6.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if origin is in whitelist or if it's a development request (no origin)
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-refresh-token"],
  exposedHeaders: ["set-cookie", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400,
};

module.exports = corsOptions;
