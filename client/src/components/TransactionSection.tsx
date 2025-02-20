/** @format */

import React, { useState } from "react";
import {
  useCreateTransactionMutation,
  useGetTransactionsQuery,
  useDeleteTransactionMutation,
} from "../services/api";

interface TransactionForm {
  description: string;
  amount: number;
  type: "expense" | "income";
  category: string;
  date: string;
  isRecurring: boolean;
  recurringFrequency: "daily" | "weekly" | "monthly" | "yearly" | null;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "expense" | "income";
  category: string;
  date: string;
  isRecurring: boolean;
  recurringFrequency: "daily" | "weekly" | "monthly" | "yearly" | null;
}

export const TransactionSection = () => {
  const [createTransaction, { isLoading: isCreating }] =
    useCreateTransactionMutation();
  const { data: transactions = [] } = useGetTransactionsQuery({}) as {
    data: Transaction[];
  };
  const [deleteTransaction] = useDeleteTransactionMutation();

  const [formData, setFormData] = useState<TransactionForm>({
    description: "",
    amount: 0,
    type: "expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
    isRecurring: false,
    recurringFrequency: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTransaction(formData).unwrap();
    setFormData({
      description: "",
      amount: 0,
      type: "expense",
      category: "",
      date: new Date().toISOString().split("T")[0],
      isRecurring: false,
      recurringFrequency: null,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Transactions</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  type: e.target.value as "income" | "expense",
                }))
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

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
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Recurring Transaction
            </label>
            <div className="mt-2">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isRecurring: e.target.checked,
                  }))
                }
                className="mr-2"
              />
              <span className="text-sm text-gray-600">
                Make this a recurring transaction
              </span>
            </div>
          </div>

          {formData.isRecurring && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Frequency
              </label>
              <select
                value={formData.recurringFrequency ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    recurringFrequency: e.target.value as
                      | "daily"
                      | "weekly"
                      | "monthly"
                      | "yearly"
                      | null,
                  }))
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                required={formData.isRecurring}
              >
                <option value="">Select frequency</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isCreating}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          {isCreating ? "Adding Transaction..." : "Add Transaction"}
        </button>
      </form>

      <div className="space-y-4">
        {Array.isArray(transactions) &&
          transactions.map((transaction: Transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">{transaction.category}</p>
                {transaction.isRecurring && (
                  <p className="text-xs text-indigo-600">
                    Recurring: {transaction.recurringFrequency}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`font-medium ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ${transaction.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => deleteTransaction(transaction.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
