/** @format */

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  useCreateBudgetMutation,
  useGetBudgetsQuery,
  useDeleteBudgetMutation,
  useUpdateBudgetMutation,
  useGetTransactionsQuery,
} from "../services/api";
import type { Budget, BudgetForm, Transaction } from "../types/budget";
import { BudgetCard } from "./BudgetCard";
import { BudgetSummary } from "./BudgetSummary";
import { CreateBudgetModal } from "./CreateBudgetModal";
import { EditBudgetModal } from "./EditBudgetModal";

export const BudgetSection = () => {
  const [createBudget, { isLoading: isCreating }] = useCreateBudgetMutation();
  const { data: transactionsResponse } = useGetTransactionsQuery({});
  const { data: budgetResponse, isLoading } = useGetBudgetsQuery({});
  const [deleteBudget] = useDeleteBudgetMutation();
  const [updateBudget] = useUpdateBudgetMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [spendingAmount, setSpendingAmount] = useState(0);
  const [formData, setFormData] = useState<BudgetForm>({
    category: "",
    amount: 0,
    period: "monthly",
    alertThreshold: 80,
  });

  const budgets = budgetResponse?.data || [];
  const transactions = transactionsResponse?.data || [];

  const calculateBudgetUtilization = (budget: Budget) => {
    const currentDate = new Date();
    const filteredTransactions = transactions.filter(
      (transaction: Transaction) => {
        if (transaction.type !== "expense") return false;

        const transactionDate = new Date(transaction.date);
        if (budget.period === "monthly") {
          return (
            transactionDate.getMonth() === currentDate.getMonth() &&
            transactionDate.getFullYear() === currentDate.getFullYear() &&
            transaction.category === budget.category
          );
        }
        return (
          transactionDate.getFullYear() === currentDate.getFullYear() &&
          transaction.category === budget.category
        );
      }
    );
    const totalSpent = filteredTransactions.reduce(
      (sum: number, transaction: Transaction) => sum + transaction.amount,
      0
    );

    const percentageUsed = (totalSpent / budget.amount) * 100;
    return { totalSpent, percentageUsed };
  };

  const summary = useMemo(() => {
    const result = budgets.reduce(
      (
        acc: {
          monthly: { totalBudget: number; totalSpent: number };
          yearly: { totalBudget: number; totalSpent: number };
        },
        budget: Budget
      ) => {
        const { totalSpent } = calculateBudgetUtilization(budget);
        const key = budget.period as "monthly" | "yearly";
        acc[key].totalBudget += budget.amount;
        acc[key].totalSpent += totalSpent;
        return acc;
      },
      {
        monthly: { totalBudget: 0, totalSpent: 0 },
        yearly: { totalBudget: 0, totalSpent: 0 },
      }
    );
    const totalBudget = result.monthly.totalBudget + result.yearly.totalBudget;
    const totalSpent = result.monthly.totalSpent + result.yearly.totalSpent;

    return {
      ...result,
      totalBudget,
      totalSpent,
      remainingBudget: totalBudget - totalSpent,
      percentageSpent: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
    };
  }, [budgets, transactions]);

  useEffect(() => {
    budgets.forEach((budget: Budget) => {
      const { percentageUsed } = calculateBudgetUtilization(budget);
      if (percentageUsed >= budget.alertThreshold) {
        toast.error(
          `Alert: ${
            budget.category
          } budget has reached ${percentageUsed.toFixed(1)}% of limit!`,
          {
            duration: 5000,
            position: "top-right",
            id: `budget-alert-${budget._id}`,
          }
        );
      }
    });
  }, [budgets, transactions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.amount <= 0) {
        toast.error("Amount must be greater than 0");
        return;
      }
      if (formData.alertThreshold < 0 || formData.alertThreshold > 100) {
        toast.error("Alert threshold must be between 0 and 100");
        return;
      }

      await createBudget(formData).unwrap();
      setIsModalOpen(false);
      setFormData({
        category: "",
        amount: 0,
        period: "monthly",
        alertThreshold: 80,
      });
      toast.success("Budget created successfully!");
    } catch (error) {
      toast.error("Failed to create budget");
      console.error("Failed to create budget:", error);
    }
  };

  const handleUpdateSpending = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBudget) return;

    try {
      await updateBudget({
        id: selectedBudget._id,
        budget: { currentSpending: spendingAmount },
      }).unwrap();
      setIsEditModalOpen(false);
      setSelectedBudget(null);
      setSpendingAmount(0);
      toast.success("Spending updated successfully!");
    } catch (error) {
      toast.error("Failed to update spending");
      console.error("Failed to update spending:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBudget(id).unwrap();
      toast.success("Budget deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete budget");
      console.error("Failed to delete budget:", error);
    }
  };

  const calculateSpendingPercentage = (budget: Budget) => {
    const spending = budget.currentSpending ?? 0;
    return (spending / budget.amount) * 100;
  };

  const renderBudgetCard = (budget: Budget) => {
    const spendingPercentage = calculateSpendingPercentage(budget);
    const isNearLimit = spendingPercentage >= budget.alertThreshold;

    return (
      <div
        key={budget._id}
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
              onClick={() => {
                setSelectedBudget(budget);
                setSpendingAmount(budget.currentSpending ?? 0);
                setIsEditModalOpen(true);
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              Edit Spending
            </button>
            <button
              onClick={() => handleDelete(budget._id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span>Spent: ₹{(budget.currentSpending ?? 0).toFixed(2)}</span>
            <span>Budget: ₹{budget.amount.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className={`h-2.5 rounded-full ${
                isNearLimit ? "bg-red-600" : "bg-green-600"
              }`}
              style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
            ></div>
          </div>
          {isNearLimit && (
            <p className="text-red-600 text-sm mt-2">
              Alert: Budget alert threshold reached!
            </p>
          )}
        </div>
      </div>
    );
  };
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Budgets</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
        >
          Add Budget
        </button>
      </div>

      <BudgetSummary summary={summary} />

      {isLoading ? (
        <div className="text-center py-4">Loading budgets...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget: Budget) => (
            <BudgetCard
              key={budget._id}
              budget={budget}
              utilization={calculateBudgetUtilization(budget)}
              onDelete={handleDelete}
              onEdit={(budget) => {
                setSelectedBudget(budget);
                const { totalSpent } = calculateBudgetUtilization(budget);
                setSpendingAmount(totalSpent);
                setIsEditModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateBudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isCreating={isCreating}
      />

      {isEditModalOpen && selectedBudget && (
        <EditBudgetModal
          budget={selectedBudget}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedBudget(null);
          }}
          onUpdate={handleUpdateSpending}
          spendingAmount={spendingAmount}
          setSpendingAmount={setSpendingAmount}
        />
      )}
    </div>
  );
};
