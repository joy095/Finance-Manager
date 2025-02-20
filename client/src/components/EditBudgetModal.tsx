/** @format */

import React from "react";
import { Budget } from "../types/budget";

interface EditBudgetModalProps {
  budget: Budget;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (e: React.FormEvent) => Promise<void>;
  spendingAmount: number;
  setSpendingAmount: React.Dispatch<React.SetStateAction<number>>;
}

export const EditBudgetModal: React.FC<EditBudgetModalProps> = ({
  budget,
  isOpen,
  onClose,
  onUpdate,
  spendingAmount,
  setSpendingAmount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Update Spending for {budget.category}
        </h2>
        <form onSubmit={onUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Spending Amount
            </label>
            <input
              type="number"
              value={spendingAmount}
              onChange={(e) => setSpendingAmount(parseFloat(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Update Spending
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
