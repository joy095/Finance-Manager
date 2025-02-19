/** @format */

const TransactionSchema = require("../models/Transaction");
const BudgetSchema = require("../models/Budget");
const logger = require("../utils/logger");

// Create new transaction
const createTransaction = async (req, res) => {
  logger.info("Create Transaction endpoint hit...");
  try {
    const {
      description,
      amount,
      type,
      category,
      date,
      isRecurring,
      recurringFrequency,
    } = req.body;

    const transaction = await TransactionSchema.create({
      userId: req.user.id,
      description,
      amount,
      type,
      category,
      date: new Date(date),
      isRecurring,
      recurringFrequency,
    });

    // Check budget limits if it's an expense
    if (type === "expense") {
      const budget = await BudgetSchema.findOne({
        userId: req.user.id,
        category,
      });

      if (budget) {
        const monthlyTransactions = await TransactionSchema.aggregate([
          {
            $match: {
              userId: req.user.id,
              category,
              type: "expense",
              date: {
                $gte: new Date(new Date().setDate(1)), // First day of current month
                $lte: new Date(),
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]);

        const totalSpent = monthlyTransactions[0]?.total || 0;
        const percentageUsed = (totalSpent / budget.amount) * 100;

        if (percentageUsed >= budget.alertThreshold) {
          // Add alert to response
          logger.warn(
            `Budget alert: You have used ${percentageUsed.toFixed(
              2
            )}% of your ${category} budget`
          );

          return res.status(201).json({
            success: true,
            data: transaction,
            alert: `Budget alert: You have used ${percentageUsed.toFixed(
              2
            )}% of your ${category} budget`,
          });
        }
      }
    }

    logger.info("Create Transaction successful");

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    logger.error("Error creating transaction:", error);
    res.status(500).json({
      success: false,
      message: "Error creating transaction",
    });
  }
};

// Get all transactions for a user
const getTransactions = async (req, res) => {
  logger.info("Get Transaction endpoint hit...");

  try {
    const { startDate, endDate, type, category } = req.query;
    let query = { userId: req.user.id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (type) query.type = type;
    if (category) query.category = category;

    const transactions = await TransactionSchema.find(query).sort({ date: -1 });

    logger.info("Getting Transaction successful");

    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    logger.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching transactions",
    });
  }
};

// Update transaction
const updateTransaction = async (req, res) => {
  logger.info("Update Transaction endpoint hit...");

  try {
    const { id } = req.params;
    const updates = req.body;

    const transaction = await TransactionSchema.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updates,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    logger.info("Updating Transaction successful");

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    logger.error("Error updating transaction:", error);
    res.status(500).json({
      success: false,
      message: "Error updating transaction",
    });
  }
};

// Delete transaction
const deleteTransaction = async (req, res) => {
  logger.info("Delete Transaction endpoint hit...");

  try {
    const { id } = req.params;

    const transaction = await TransactionSchema.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    logger.warn("Transaction not found");

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    logger.info("Deleting Transaction successful");

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting transaction:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting transaction",
    });
  }
};

// Get transaction statistics
const getTransactionStats = async (req, res) => {
  logger.info("Get Transaction Stats endpoint hit...");

  try {
    const { period } = req.query;
    const startDate =
      period === "yearly"
        ? new Date(new Date().getFullYear(), 0, 1)
        : new Date(new Date().setDate(1));

    const stats = await TransactionSchema.aggregate([
      {
        $match: {
          userId: req.user.id,
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            type: "$type",
            category: "$category",
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    logger.warn("Get Transaction Statistics found");

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error("Error fetching transaction statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching transaction statistics",
    });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
};
