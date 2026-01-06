import React, { useState } from "react";
import { TrendingUp, TrendingDown, Edit3 } from "lucide-react";
import MarketRates from "../components/shared/MarketRates";
import Card from "../components/ui/Card";
import TransactionItem from "../components/shared/TransactionItem";
import TypeDetailsModal from "../modals/TypeDetailsModal";
import { formatCurrency } from "../utils/helpers";

const HomeScreen = ({
  balance,
  income,
  expense,
  transactions,
  savings,
  rates,
  onSeeAll,
  onDelete,
  onEditSavings,
}) => {
  const [dailyDetailsType, setDailyDetailsType] = useState(null);

  // Calculate percentage for savings bar
  const savingsPercent = Math.min(
    Math.round((savings.current / savings.goal) * 100),
    100
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <MarketRates rates={rates} />

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-6 text-white shadow-xl shadow-gray-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="relative z-10">
          <p className="text-gray-400 mb-1 font-medium">Total Balance</p>
          <h2 className="text-4xl font-bold mb-6 tracking-tight">
            {formatCurrency(balance)}
          </h2>

          <div className="flex gap-4">
            <div
              className="flex-1 bg-white/10 rounded-2xl p-3 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors"
              onClick={() => setDailyDetailsType("income")}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 bg-green-500/20 rounded-full">
                  <TrendingUp size={14} className="text-green-400" />
                </div>
                <span className="text-xs text-gray-300">Total Income</span>
              </div>
              <p className="font-semibold text-lg">{formatCurrency(income)}</p>
            </div>
            <div
              className="flex-1 bg-white/10 rounded-2xl p-3 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors"
              onClick={() => setDailyDetailsType("expense")}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 bg-red-500/20 rounded-full">
                  <TrendingDown size={14} className="text-red-400" />
                </div>
                <span className="text-xs text-gray-300">Total Expenses</span>
              </div>
              <p className="font-semibold text-lg">{formatCurrency(expense)}</p>
            </div>
          </div>
        </div>
      </div>

      <Card
        className="flex items-center justify-between group"
        onClick={onEditSavings}
      >
        <div>
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            Savings
            <Edit3
              size={14}
              className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </h3>
          <p className="text-sm text-gray-500">
            Goal: {formatCurrency(savings.goal)}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xl font-bold text-blue-600">
            {formatCurrency(savings.current)}
          </span>
          <div className="w-24 h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${savingsPercent}%` }}
            ></div>
          </div>
        </div>
      </Card>

      {/* Added min-height to prevent jumping when items are removed */}
      <div className="min-h-[300px]">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="font-bold text-xl text-gray-800">Transactions</h3>
          <button
            onClick={onSeeAll}
            className="text-blue-600 text-sm font-semibold hover:underline"
          >
            See All
          </button>
        </div>

        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>No transactions yet</p>
            </div>
          ) : (
            transactions
              .slice(0, 4)
              .map((tx) => (
                <TransactionItem key={tx.id} tx={tx} onDelete={onDelete} />
              ))
          )}
        </div>
      </div>

      {dailyDetailsType && (
        <TypeDetailsModal
          type={dailyDetailsType}
          transactions={transactions}
          onClose={() => setDailyDetailsType(null)}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default HomeScreen;
