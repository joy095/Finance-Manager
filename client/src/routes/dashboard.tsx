/** @format */

import { useEffect, useState } from "react";
import { useGetTransactionsQuery, useLogoutMutation } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TransactionSection } from "../components/TransactionSection";
import { BudgetSection } from "../components/BudgetSection";

interface Transaction {
  _id: string;
  userId: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  isRecurring: boolean;
  recurringFrequency: string | null;
  __v: number;
}

interface RootState {
  auth: {
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const [isClient, setIsClient] = useState(false);
  const [incomeChartData, setIncomeChartData] = useState<
    Array<{ date: string; amount: number }>
  >([]);

  const refreshToken = useSelector(
    (state: RootState) => state.auth.refreshToken
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const { data: transactions = [], isLoading: isLoadingTransactions } =
    useGetTransactionsQuery({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (Array.isArray(transactions?.data) && transactions.data.length > 0) {
      const incomeData = transactions.data
        .filter((transaction: Transaction) => transaction.type === "income")
        .map((transaction: Transaction) => ({
          date: transaction.date,
          amount: transaction.amount,
        }))
        .sort(
          (a: { date: string }, b: { date: string }) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      setIncomeChartData(incomeData);
    }
  }, [transactions]);

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await logout({ refreshToken }).unwrap();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };

  if (isLoadingTransactions) {
    return <DashboardSkeleton />;
  }

  const transactionsArray = transactions?.data || [];

  const spendingTrends = transactionsArray.reduce(
    (acc: Record<string, number>, transaction: Transaction) => {
      const date = new Date(transaction.date).toISOString().split("T")[0];
      if (transaction.type === "expense") {
        acc[date] = (acc[date] || 0) + transaction.amount;
      }
      return acc;
    },
    {}
  );

  const chartData = Object.entries(spendingTrends)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, amount]) => ({
      date,
      amount,
    }));

  const totalExpenses = transactionsArray
    .filter((t: Transaction) => t.type === "expense")
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

  const totalIncome = transactionsArray
    .filter((t: Transaction) => t.type === "income")
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  const categoryTotals = transactionsArray.reduce(
    (
      acc: Record<string, { income: number; expense: number }>,
      transaction: Transaction
    ) => {
      const category = transaction.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = { income: 0, expense: 0 };
      }
      if (transaction.type === "income") {
        acc[category].income += transaction.amount;
      } else {
        acc[category].expense += transaction.amount;
      }
      return acc;
    },
    {}
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Expenses"
          amount={totalExpenses}
          color="text-red-600"
        />
        <SummaryCard
          title="Total Income"
          amount={totalIncome}
          color="text-green-600"
        />
        <SummaryCard
          title="Net Balance"
          amount={netBalance}
          color="text-blue-600"
        />
      </div>
      {/* Spending Trends Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Spending Trends</h3>
        {isClient && chartData.length > 0 ? (
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <YAxis tickFormatter={(value) => `₹${value}`} />
                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toFixed(2)}`,
                    "Amount",
                  ]}
                  labelFormatter={(label) =>
                    new Date(label).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  }
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-500">
            {chartData.length === 0
              ? "No expense data available"
              : "Loading chart..."}
          </div>
        )}
      </div>

      {/* Income Trends Chart */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Income Trends</h3>
        {isClient && incomeChartData.length > 0 ? (
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incomeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <YAxis tickFormatter={(value) => `₹${value}`} />
                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toFixed(2)}`,
                    "Amount",
                  ]}
                  labelFormatter={(label) =>
                    new Date(label).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  }
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-500">
            {incomeChartData.length === 0
              ? "No income data available"
              : "Loading chart..."}
          </div>
        )}
      </div>

      {/* Category Summary Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Category Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Income
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Expenses
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Net
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(categoryTotals).map(
                ([category, totals]: [string, unknown]) => {
                  const { income, expense } = totals as {
                    income: number;
                    expense: number;
                  };

                  return (
                    <tr key={category}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        ₹{income.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        ₹{expense.toFixed(2)}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          income - expense >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ₹{(income - expense).toFixed(2)}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(Array.isArray(transactions) ? transactions : [])
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .slice(0, 5)
                .map((transaction) => (
                  <tr key={transaction._id}>
                    {transaction}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.category}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.type === "income"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.type}
                      </span>
                      {transaction.isRecurring && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          recurring
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Budget Section */}
      <BudgetSection />

      <TransactionSection />
    </div>
  );
}

const SummaryCard = ({
  title,
  amount,
  color,
}: {
  title: string;
  amount: number;
  color: string;
}) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className={`text-2xl font-bold ${color}`}>₹{amount.toFixed(2)}</p>
  </div>
);

const DashboardSkeleton = () => (
  <div className="p-6 space-y-6">
    <div className="flex justify-between items-center mb-6">
      <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
    <div className="bg-white rounded-lg shadow p-6">
      <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
      <div className="h-64 w-full bg-gray-200 rounded animate-pulse"></div>
    </div>
    <div className="bg-white rounded-lg shadow p-6">
      <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
      <div className="h-32 w-full bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);
