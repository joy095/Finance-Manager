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
