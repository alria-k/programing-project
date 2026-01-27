import React, { useState, useMemo } from "react";
import { Calendar, ShoppingBag } from "lucide-react";
import { formatCurrency, formatDate, getTodayISO } from "../utils/helpers";

const StatsScreen = ({ transactions }) => {
  const [dateFilter, setDateFilter] = useState(getTodayISO());

  const filteredTx = useMemo(() => {
    if (!dateFilter) return transactions;

    return transactions.filter((t) => {
      const dbDate = new Date(t.date);

      const filterDate = new Date(dateFilter);

      return dbDate.toDateString() === filterDate.toDateString();
    });
  }, [transactions, dateFilter]);

  const expenseTx = filteredTx.filter(
    (t) => t.isIncome === 0 || t.isIncome === false,
  );
  const filteredExpenseTotal = useMemo(
    () => expenseTx.reduce((acc, curr) => acc + curr.amount, 0),
    [expenseTx],
  );

  const categories = useMemo(() => {
    const groups = {};
    expenseTx.forEach((t) => {
      groups[t.category] = (groups[t.category] || 0) + t.amount;
    });
    return Object.entries(groups).sort((a, b) => b[1] - a[1]);
  }, [expenseTx]);

  return (
    <div className="space-y-6 animate-fade-in pt-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl font-bold text-gray-800">Expense Report</h2>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Calendar className="text-blue-600" size={24} />
        <div className="flex-1">
          <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">
            Filter by Date
          </label>
          <input
            type="date"
            className="w-full font-semibold text-gray-800 outline-none bg-transparent"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        {dateFilter && (
          <button
            onClick={() => setDateFilter("")}
            className="text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-500 hover:bg-gray-200"
          >
            Clear
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center">
        <div className="w-48 h-48 rounded-full border-[1.5rem] border-gray-100 border-t-blue-500 border-r-blue-400 rotate-45 flex items-center justify-center relative">
          <div className="text-center transform -rotate-45">
            <p className="text-gray-400 text-sm">
              {dateFilter ? formatDate(dateFilter) : "Total"}
            </p>
            <p className="text-2xl font-bold text-gray-800">
              {formatCurrency(filteredExpenseTotal)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map(([cat, amount]) => (
          <div
            key={cat}
            className="bg-white p-4 rounded-2xl border border-gray-50 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <ShoppingBag size={18} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">{cat}</span>
                <span className="font-bold text-gray-800">
                  {formatCurrency(amount)}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${(amount / (filteredExpenseTotal || 1)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="text-center p-8 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400">No expenses found for this date.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsScreen;
