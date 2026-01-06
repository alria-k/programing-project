import React from "react";
import {
  ShoppingBag,
  Coffee,
  Car,
  Briefcase,
  CreditCard,
  Shield,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { formatDate, formatCurrency } from "../../utils/helpers";

const TransactionItem = ({ tx, onDelete }) => {
  const isIncome = tx.type === "income";

  const IconComponent = ({ name }) => {
    const icons = { ShoppingBag, Coffee, Car, Briefcase, CreditCard, Shield };
    const Icon = icons[name] || CreditCard;
    return <Icon size={20} />;
  };

  return (
    <div className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-gray-50 hover:shadow-md transition-shadow group relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete && onDelete(tx.id);
        }}
        className="absolute top-0 left-0 m-1 p-1 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-200"
        title="Delete"
      >
        <Trash2 size={12} />
      </button>

      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ml-2 ${
          isIncome ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
        } ${
          tx.category === "Admin Adjustment" ? "bg-blue-50 text-blue-600" : ""
        }`}
      >
        {isIncome ? <TrendingUp size={20} /> : <IconComponent name={tx.icon} />}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-800">{tx.category}</h4>
        <p className="text-xs text-gray-400">{formatDate(tx.date)}</p>
      </div>
      <span
        className={`font-bold text-lg ${
          isIncome ? "text-green-600" : "text-gray-800"
        }`}
      >
        {isIncome ? "+" : "-"}
        {formatCurrency(tx.amount)}
      </span>
    </div>
  );
};

export default TransactionItem;
