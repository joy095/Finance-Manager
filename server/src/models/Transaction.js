/** @format */

const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["expense", "income"], required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  isRecurring: { type: Boolean, default: false },
  recurringFrequency: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"],
    default: null,
  },
});

const TransactionSchema = mongoose.model(
  "TransactionSchema",
  transactionSchema
);
module.exports = TransactionSchema;
