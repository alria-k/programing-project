import React, { useState } from "react";
import {
    ShoppingBag, Coffee, Car, Briefcase, CreditCard,
    Shield, TrendingUp, Trash2, ChevronDown
} from "lucide-react";
import { formatDate, formatCurrency } from "../../utils/helpers";

const IconComponent = ({ name }) => {
    const icons = { ShoppingBag, Coffee, Car, Briefcase, CreditCard, Shield };
    const Icon = icons[name] || CreditCard;
    return <Icon size={20} />;
};

const TransactionItem = ({ tx, onDelete, balanceBefore = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    
    const isIncome = tx.isIncome === true || tx.isIncome === 1;

    
    const balanceAfter = isIncome
        ? balanceBefore + tx.amount
        : balanceBefore - tx.amount;

    return (
        <div
            className="bg-white p-4 rounded-2xl border border-gray-50 hover:shadow-md transition-all group relative cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex items-center gap-4">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete && onDelete(tx.id);
                    }}
                    className="absolute top-0 left-0 m-1 p-1 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-200"
                >
                    <Trash2 size={12} />
                </button>

                <div className={`w-12 h-12 rounded-full flex items-center justify-center ml-2 ${isIncome ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                    }`}>
                    {isIncome ? <TrendingUp size={20} /> : <IconComponent name={tx.icon} />}
                </div>

                <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{tx.category}</h4>
                    <p className="text-xs text-gray-400">{formatDate(tx.date)}</p>
                </div>

                <div className="flex flex-col items-end gap-1">
                    <span className={`font-bold text-lg ${isIncome ? "text-green-600" : "text-gray-800"}`}>
                        {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
                    </span>
                    <ChevronDown size={14} className={`text-gray-300 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </div>
            </div>
            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 gap-4 animate-slide-down">
                    <div>
                        <p className="text-xs text-gray-400">Balance Before</p>
                        <p className="font-semibold text-gray-700">{formatCurrency(balanceBefore)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400">Balance After</p>
                        <p className={`font-bold ${isIncome ? "text-green-600" : "text-red-600"}`}>
                            {formatCurrency(balanceAfter)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionItem;