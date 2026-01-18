import React, { useState } from "react";
import { X } from "lucide-react";
import Button from "../components/ui/Button";

const SavingsModal = ({ savings, onSave, onClose }) => {
  const [goal, setGoal] = useState(savings.goal);
  const [current, setCurrent] = useState(savings.current);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            goal: parseFloat(goal),
            current: parseFloat(current)
        });
    };

  return (
    <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Edit Savings</h2>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500 ml-1">
              Goal Amount
            </label>
            <div className="relative mt-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                $
              </span>
              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full pl-8 pr-4 py-4 text-xl font-bold text-gray-800 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 ml-1">
              Current Saved
            </label>
            <div className="relative mt-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                $
              </span>
              <input
                type="number"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                className="w-full pl-8 pr-4 py-4 text-xl font-bold text-gray-800 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="mt-4">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SavingsModal;
