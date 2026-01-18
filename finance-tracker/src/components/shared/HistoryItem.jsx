import React, { useState } from "react";
import { Trash2, ChevronDown, TrendingUp, CreditCard } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/helpers";

const HistoryItem = ({ tx, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const isIncome = tx.isIncome === true || tx.isIncome === 1;

    return (
        <div
            className="bg-white p-4 rounded-2xl border border-gray-50 hover:shadow-md transition-all cursor-pointer relative group"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* Delete Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete && onDelete(tx.id);
                }}
                className="absolute -top-2 -left-2 p-1.5 bg-white shadow-md text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-red-50"
            >
                <Trash2 size={14} />
            </button>

            <div className="flex items-center gap-4">

                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                    }`}>
                    {isIncome ? <TrendingUp size={18} /> : <CreditCard size={18} />}
                </div>

                <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{tx.category}</h4>
                    <p className="text-xs text-gray-400">{formatDate(tx.date)}</p>
                </div>

                <div className="flex items-center gap-2">
                    
                    <span className={`font-bold ${isIncome ? "text-green-600" : "text-gray-800"}`}>
                        {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
                    </span>
                    <ChevronDown size={16} className={`text-gray-300 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </div>
            </div>

            
            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 gap-y-4 animate-slide-down">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Time</p>
                        <p className="text-sm font-semibold text-gray-700">N/A</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Date</p>
                        <p className="text-sm font-semibold text-gray-700">{formatDate(tx.date)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Balance Before</p>
                        <p className="text-sm font-semibold text-gray-600">{formatCurrency(tx.balanceBefore)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Balance After</p>
                        
                        <p className="text-sm font-bold text-gray-900">{formatCurrency(tx.balanceAfter)}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistoryItem;
