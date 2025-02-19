/** @format */
const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middleware/verifyToken");
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
} = require("../controllers/transactionController");

// Protect all routes with JWT verification
router.use(verifyJWT);

// Transaction routes
router.post("/create", createTransaction);
router.get("/all", getTransactions);
router.put("/update/:id", updateTransaction);
router.delete("/delete/:id", deleteTransaction);
router.get("/stats", getTransactionStats);

module.exports = router;
