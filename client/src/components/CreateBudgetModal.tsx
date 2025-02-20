/** @format */

import React from "react";
import { BudgetForm } from "../types/budget";

interface CreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (e: React.FormEvent) => Promise<void>;
  formData: BudgetForm;
  setFormData: React.Dispatch<React.SetStateAction<BudgetForm>>;
  isCreating: boolean;
}

export const CreateBudgetModal: React.FC<CreateBudgetModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  formData,
  setFormData,
  isCreating,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create New Budget</h2>
        <form onSubmit={onCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  amount: parseFloat(e.target.value),
                }))
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Period
            </label>
            <select
              value={formData.period}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  period: e.target.value as "monthly" | "yearly",
                }))
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Alert Threshold (%)
            </label>
            <input
              type="number"
              value={formData.alertThreshold}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  alertThreshold: parseInt(e.target.value),
                }))
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              min="0"
              max="100"
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
              disabled={isCreating}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50"
            >
              {isCreating ? "Creating..." : "Create Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
