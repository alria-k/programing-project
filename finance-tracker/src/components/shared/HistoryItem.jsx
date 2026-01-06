import React, { useState } from "react";
import {
  ShoppingBag,
  Coffee,
  Car,
  Briefcase,
  CreditCard,
  Shield,
  TrendingUp,
  Trash2,
  ChevronUp,
  ChevronDown,
  Clock,
} from "lucide-react";
import { formatDate, formatTime, formatCurrency } from "../../utils/helpers";

const HistoryItem = ({ tx, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isIncome = tx.type === "income";

  const IconComponent = ({ name }) => {
    const icons = { ShoppingBag, Coffee, Car, Briefcase, CreditCard, Shield };
    const Icon = icons[name] || CreditCard;
    return <Icon size={20} />;
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-200 shadow-sm group relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(tx.id);
        }}
        className="absolute top-0 left-0 m-1 p-1.5 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-200"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50"
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ml-2 ${
            isIncome ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
          } ${
            tx.category === "Admin Adjustment" ? "bg-blue-50 text-blue-600" : ""
          }`}
        >
          {isIncome ? (
            <TrendingUp size={18} />
          ) : (
            <IconComponent name={tx.icon} />
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 text-sm">{tx.category}</h4>
          <p className="text-xs text-gray-400">{formatDate(tx.date)}</p>
        </div>
        <div className="flex flex-col items-end mr-2">
          <span
            className={`font-bold ${
              isIncome ? "text-green-600" : "text-gray-800"
            }`}
          >
            {isIncome ? "+" : "-"}
            {formatCurrency(tx.amount)}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp size={16} className="text-gray-300" />
        ) : (
          <ChevronDown size={16} className="text-gray-300" />
        )}
      </div>

      {isOpen && (
        <div className="px-4 pb-4 pt-0 bg-gray-50/50 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <Clock size={10} /> Time
              </p>
              <p className="font-semibold text-gray-700 text-sm">
                {formatTime(tx.timestamp) || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Date</p>
              <p className="font-semibold text-gray-700 text-sm">
                {formatDate(tx.date)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Balance Before</p>
              <p className="font-semibold text-gray-500 text-sm">
                {formatCurrency(tx.balanceBefore)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Balance After</p>
              <p className="font-bold text-gray-800 text-sm">
                {formatCurrency(tx.balanceAfter)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryItem;
