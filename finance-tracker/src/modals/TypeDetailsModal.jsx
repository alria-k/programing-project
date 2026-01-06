import React from "react";
import { X } from "lucide-react";
import TransactionItem from "../components/shared/TransactionItem";
import { formatCurrency } from "../utils/helpers";

const TypeDetailsModal = ({ transactions, type, onClose, onDelete }) => {
  const filtered = transactions.filter((t) => t.type === type);
  const total = filtered.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="absolute inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
      <div className="bg-white w-full max-w-md h-[80vh] sm:h-auto sm:max-h-[80vh] rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl animate-slide-up flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 capitalize">
              Total {type}s
            </h2>
            <p className="text-gray-500 text-sm">All time history</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Total */}
        <div
          className={`p-4 rounded-2xl mb-4 text-center ${
            type === "income"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          <p className="text-sm font-medium opacity-80">Total {type}</p>
          <p className="text-3xl font-bold">{formatCurrency(total)}</p>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-3 pb-4">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No {type}s found
            </div>
          ) : (
            [...filtered]
              .reverse()
              .map((tx) => (
                <TransactionItem key={tx.id} tx={tx} onDelete={onDelete} />
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TypeDetailsModal;
