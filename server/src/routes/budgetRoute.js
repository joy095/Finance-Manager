/** @format */

const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");
const { verifyJWT } = require("../middleware/verifyToken");

// Apply auth middleware to all routes
router.use(verifyJWT);

// Budget routes
router.post("/", budgetController.createBudget);
router.get("/", budgetController.getUserBudgets);
router.put("/:id", budgetController.updateBudget);
router.delete("/:id", budgetController.deleteBudget);

module.exports = router;
