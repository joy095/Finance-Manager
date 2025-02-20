/** @format */

export interface Transaction {
  _id: string;
  category: string;
  amount: number;
  date: string;
  type: "income" | "expense";
}

export interface BudgetForm {
  category: string;
  amount: number;
  period: "monthly" | "yearly";
  alertThreshold: number;
}

export interface Budget {
  _id: string;
  userId: string;
  category: string;
  amount: number;
  period: "monthly" | "yearly";
  alertThreshold: number;
  __v: number;
  currentSpending?: number;
}

export interface BudgetResponse {
  success: boolean;
  data: Budget[];
}

export interface BudgetSummary {
  monthly: {
    totalBudget: number;
    totalSpent: number;
  };
  yearly: {
    totalBudget: number;
    totalSpent: number;
  };
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  percentageSpent: number;
}
