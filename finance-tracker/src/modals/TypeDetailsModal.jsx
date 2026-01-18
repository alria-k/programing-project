import React, { useMemo } from "react";
import { X } from "lucide-react";
import TransactionItem from "../components/shared/TransactionItem";
import { formatCurrency } from "../utils/helpers";

const TypeDetailsModal = ({ transactions, type, onClose, onDelete }) => {
    // 1. First, calculate the running balance for EVERY transaction in history
    const historyWithGlobalBalances = useMemo(() => {
        // Sort everything oldest to newest for the calculation
        const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

        let runningBalance = 0;
        return sorted.map(tx => {
            const isInc = tx.isIncome === true || tx.isIncome === 1; //
            const balanceBefore = runningBalance;

            if (isInc) {
                runningBalance += tx.amount;
            } else {
                runningBalance -= tx.amount;
            }

            return {
                ...tx,
                balanceBefore,
                balanceAfter: runningBalance
            };
        });
    }, [transactions]);

    // 2. Now filter that list for only the specific type requested
    const filteredTransactions = useMemo(() => {
        return historyWithGlobalBalances
            .filter(tx => {
                const isInc = tx.isIncome === true || tx.isIncome === 1;
                return type === "income" ? isInc : !isInc;
            })
            .reverse(); // Newest at the top for the UI
    }, [historyWithGlobalBalances, type]);

    const totalAmount = useMemo(() =>
        filteredTransactions.reduce((acc, curr) => acc + curr.amount, 0),
        [filteredTransactions]);

    return (
        <div className="absolute inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
            <div className="bg-white w-full max-w-md h-[80vh] sm:h-auto sm:max-h-[80vh] rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 capitalize">Total {type}s</h2>
                        <p className="text-gray-500 text-sm">All time history</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                        <X size={20} />
                    </button>
                </div>

                <div className={`p-4 rounded-2xl mb-4 text-center ${type === "income" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}>
                    <p className="text-sm font-medium opacity-80">Total {type}</p>
                    <p className="text-3xl font-bold">{formatCurrency(totalAmount)}</p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pb-4">
                    {filteredTransactions.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">No {type}s found</div>
                    ) : (
                        filteredTransactions.map((tx) => (
                            <TransactionItem
                                key={tx.id}
                                tx={tx}
                                onDelete={onDelete}
                                // These now use the global balances calculated in step 1
                                balanceBefore={tx.balanceBefore}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TypeDetailsModal;
