/** @format */

import React, { useState } from "react";
import { useCreateTransactionMutation } from "../services/api";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { useToast } from "./ui/Toast";

const TransactionForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { addToast } = useToast();

  const [createTransaction, { isLoading }] = useCreateTransactionMutation();
  const [transaction, setTransaction] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
    isRecurring: false,
    recurringFrequency: "monthly",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setTransaction({
      ...transaction,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createTransaction({
        ...transaction,
        amount: parseFloat(transaction.amount),
      }).unwrap();

      addToast({
        title: "Success",
        description: "Transaction created successfully",
      });

      setTransaction({
        description: "",
        amount: "",
        type: "expense",
        category: "",
        date: new Date().toISOString().split("T")[0],
        isRecurring: false,
        recurringFrequency: "monthly",
      });

      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      addToast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create transaction",
      });
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          value={transaction.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          value={transaction.amount}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select
          name="type"
          value={transaction.type}
          onValueChange={(value) =>
            setTransaction({ ...transaction, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="income">Income</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          value={transaction.category}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={transaction.date}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Transaction"}
      </Button>
    </form>
  );
};

export default TransactionForm;
