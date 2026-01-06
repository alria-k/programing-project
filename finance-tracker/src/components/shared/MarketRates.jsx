import React from "react";
import { Percent, TrendingUp } from "lucide-react";

const MarketRates = ({ rates }) => (
  <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
    <div className="bg-white p-3 rounded-2xl flex items-center gap-3 shadow-sm border border-gray-100 min-w-max">
      <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
        <Percent size={18} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">Mortgage Rate</p>
        <p className="font-bold text-gray-800">{rates.mortgage}%</p>
      </div>
    </div>
    <div className="bg-white p-3 rounded-2xl flex items-center gap-3 shadow-sm border border-gray-100 min-w-max">
      <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
        <Percent size={18} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">Credit Rate</p>
        <p className="font-bold text-gray-800">{rates.credit}%</p>
      </div>
    </div>
    <div className="bg-white p-3 rounded-2xl flex items-center gap-3 shadow-sm border border-gray-100 min-w-max">
      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
        <TrendingUp size={18} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">Inflation</p>
        <p className="font-bold text-gray-800">{rates.inflation}%</p>
      </div>
    </div>
  </div>
);

export default MarketRates;
