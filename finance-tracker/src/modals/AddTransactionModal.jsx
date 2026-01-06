import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";

const AddTransactionModal = ({ onClose, onAdd }) => {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;

    const now = new Date();
    const todayDate = now.toISOString().split("T")[0];
    const timestamp = now.toISOString();

    onAdd({
      id: Date.now(),
      type,
      amount: parseFloat(amount),
      category,
      date: todayDate,
      timestamp: timestamp,
      icon: type === "income" ? "Briefcase" : "ShoppingBag",
    });
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">New Transaction</h2>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
          >
            <ArrowRight size={20} className="rotate-90 sm:rotate-0" />
          </button>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
          <button
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              type === "expense"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500"
            }`}
            onClick={() => setType("expense")}
          >
            Expense
          </button>
          <button
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              type === "income"
                ? "bg-white text-green-600 shadow-sm"
                : "text-gray-500"
            }`}
            onClick={() => setType("income")}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500 ml-1">
              Amount
            </label>
            <div className="relative mt-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-4 text-2xl font-bold text-gray-800 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-100"
                placeholder="0"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 ml-1">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 mt-1 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-100"
              placeholder={
                type === "income" ? "Salary, Gift..." : "Food, Taxi, Home..."
              }
            />
          </div>

          <Button type="submit" variant="primary" className="mt-4">
            Add
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
