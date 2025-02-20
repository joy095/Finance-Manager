/** @format */

const allowedOrigins = "https://finance-manager-xxjq.vercel.app";

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // If using cookies/auth headers
  })
);
module.exports = corsOptions;
