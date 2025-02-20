/** @format */

import React from "react";
import { Budget } from "../types/budget";

interface BudgetCardProps {
  budget: Budget;
  utilization: {
    totalSpent: number;
    percentageUsed: number;
  };
  onDelete: (id: string) => void;
  onEdit: (budget: Budget) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  utilization,
  onDelete,
  onEdit,
}) => {
  const isNearLimit = utilization.percentageUsed >= budget.alertThreshold;

  return (
    <div
      className={`p-4 rounded-lg border ${
        isNearLimit ? "border-red-500 bg-red-50" : "border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{budget.category}</h3>
          <p className="text-sm text-gray-600">{budget.period} budget</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(budget)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit Spending
          </button>
          <button
            onClick={() => onDelete(budget._id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm">
          <span>Spent: ₹{utilization.totalSpent.toFixed(2)}</span>
          <span>Budget: ₹{budget.amount.toFixed(2)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div
            className={`h-2.5 rounded-full ${
              utilization.percentageUsed >= 90
                ? "bg-red-600"
                : utilization.percentageUsed >= 75
                ? "bg-yellow-500"
                : "bg-green-600"
            }`}
            style={{ width: `${Math.min(utilization.percentageUsed, 100)}%` }}
          ></div>
        </div>
        {isNearLimit && (
          <p className="text-red-600 text-sm mt-2">
            Alert: {utilization.percentageUsed.toFixed(1)}% of budget used!
          </p>
        )}
      </div>
    </div>
  );
};
