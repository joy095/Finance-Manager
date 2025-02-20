/** @format */

import React from "react";
import { BudgetSummary as BudgetSummaryType } from "../types/budget";

interface BudgetSummaryProps {
  summary: BudgetSummaryType;
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Monthly Budgets</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Budget:</span>
            <span>₹{summary.monthly.totalBudget.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Spent:</span>
            <span>₹{summary.monthly.totalSpent.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Remaining:</span>
            <span
              className={
                summary.monthly.totalBudget - summary.monthly.totalSpent < 0
                  ? "text-red-600"
                  : "text-green-600"
              }
            >
              ₹
              {(
                summary.monthly.totalBudget - summary.monthly.totalSpent
              ).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Yearly Budgets</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Budget:</span>
            <span>₹{summary.yearly.totalBudget.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Spent:</span>
            <span>₹{summary.yearly.totalSpent.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Remaining:</span>
            <span
              className={
                summary.yearly.totalBudget - summary.yearly.totalSpent < 0
                  ? "text-red-600"
                  : "text-green-600"
              }
            >
              ₹
              {(summary.yearly.totalBudget - summary.yearly.totalSpent).toFixed(
                2
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
