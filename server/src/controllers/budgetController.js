/** @format */

const Budget = require("../models/Budget");
const logger = require("../utils/logger");

// Create new budget
const createBudget = async (req, res) => {
  logger.info("Create Budget endpoint hit...");

  try {
    const { category, amount, period, alertThreshold } = req.body;
    const userId = req.user.id;

    const budget = await Budget.create({
      userId,
      category,
      amount,
      period,
      alertThreshold,
    });

    logger.info("Create Budget successful");

    res.status(201).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    logger.error("Error creating budget:", error);
    res.status(500).json({
      success: false,
      message: "Error creating budget",
    });
  }
};

// Get all budgets for a user
const getUserBudgets = async (req, res) => {
  logger.info("Get Budgets endpoint hit...");

  try {
    const userId = req.user.id;
    const budgets = await Budget.find({ userId });

    logger.info("Getting Budgets successful");

    res.status(200).json({
      success: true,
      data: budgets,
    });
  } catch (error) {
    logger.error("Error fetching budgets:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching budgets",
    });
  }
};

// Update budget
const updateBudget = async (req, res) => {
  logger.info("Update Budget endpoint hit...");

  try {
    const { category, amount, period, alertThreshold } = req.body;
    const budgetId = req.params.id;
    const userId = req.user.id;

    const budget = await Budget.findOneAndUpdate(
      { _id: budgetId, userId },
      { category, amount, period, alertThreshold },
      { new: true }
    );

    if (!budget) {
      logger.warn("Budget not found");
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    logger.info("Updating Budget successful");

    res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    logger.error("Error updating budget:", error);
    res.status(500).json({
      success: false,
      message: "Error updating budget",
    });
  }
};

// Delete budget
const deleteBudget = async (req, res) => {
  logger.info("Delete Budget endpoint hit...");

  try {
    const budgetId = req.params.id;
    const userId = req.user.id;

    const budget = await Budget.findOneAndDelete({
      _id: budgetId,
      userId,
    });

    if (!budget) {
      logger.warn("Budget not found");
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    logger.info("Deleting Budget successful");

    res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting budget:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting budget",
    });
  }
};

module.exports = {
  createBudget,
  getUserBudgets,
  updateBudget,
  deleteBudget,
};
