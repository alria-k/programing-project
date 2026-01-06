import React, { useMemo } from "react";
import { X } from "lucide-react";
import HistoryItem from "../components/shared/HistoryItem";

const HistoryModal = ({ transactions, onClose, onDelete }) => {
  const historyData = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return timeA - timeB;
    });

    let runningBalance = 0;
    const withBalances = sorted.map((tx) => {
      const previousBalance = runningBalance;
      if (tx.type === "income") {
        runningBalance += tx.amount;
      } else {
        runningBalance -= tx.amount;
      }
      return {
        ...tx,
        balanceBefore: previousBalance,
        balanceAfter: runningBalance,
      };
    });

    return withBalances.reverse();
  }, [transactions]);

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col animate-slide-up">
      <div className="px-6 py-6 flex items-center justify-between border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">All Transactions</h2>
        <button
          onClick={onClose}
          className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {historyData.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No transactions found
          </div>
        ) : (
          historyData.map((tx) => (
            <HistoryItem key={tx.id} tx={tx} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryModal;
