/** @format */

const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  period: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
  alertThreshold: { type: Number, default: 80 }, // percentage
});

const BudgetSchema = mongoose.model("BudgetSchema", budgetSchema);
module.exports = BudgetSchema;
