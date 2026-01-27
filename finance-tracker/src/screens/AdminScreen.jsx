import React, { useState, useEffect } from "react";
import {
  Shield,
  LogOut,
  Settings,
  Percent,
  TrendingUp,
  Users,
  Edit3,
} from "lucide-react";
import Button from "../components/ui/Button";
import { formatCurrency } from "../utils/helpers";

const AdminScreen = ({
  user,
  rates,
  onUpdateRates,
  onLogout,
  currentUserData,
  onUpdateUser,
}) => {
  const [localRates, setLocalRates] = useState(rates);
  const [editingUser, setEditingUser] = useState(false);

  // Edit User Local State
  const [editEmail, setEditEmail] = useState(currentUserData.email);
  const [editActive, setEditActive] = useState(
    currentUserData.isActive ?? true,
  );

  // Sync when opening modal or data changes
  useEffect(() => {
    setEditEmail(currentUserData.email);
    setEditActive(currentUserData.isActive ?? true);
  }, [currentUserData, editingUser]);

  const handleRateChange = (key, value) => {
    setLocalRates((prev) => ({ ...prev, [key]: parseFloat(value) }));
  };

  const saveRates = () => {
    onUpdateRates(localRates);
    alert("Global rates updated successfully!");
  };

  const saveUser = () => {
    onUpdateUser({
      name: editEmail,
      email: currentUserData.email, // Ensure this is Mary's email, not yours
      isActive: editActive,
    });
    setEditingUser(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center text-gray-100">
      <div className="w-full max-w-md bg-gray-900 shadow-2xl overflow-hidden relative min-h-screen flex flex-col">
        {/* Admin Header */}
        <header className="px-6 pt-12 pb-6 flex justify-between items-center bg-gray-800/50 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                Control Panel
              </p>
              <h1 className="text-xl font-bold text-white">Administrator</h1>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 bg-gray-800 rounded-full text-gray-400 hover:bg-gray-700"
          >
            <LogOut size={20} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide space-y-8">
          {/* Global Market Rates */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Settings size={18} className="text-blue-400" />
              <h2 className="text-lg font-bold">Global Market Rates</h2>
            </div>
            <div className="bg-gray-800 p-5 rounded-3xl border border-gray-700 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  Mortgage Rate (%)
                </label>
                <div className="flex items-center gap-2 bg-gray-900 p-2 rounded-xl border border-gray-700 mt-1">
                  <Percent size={16} className="text-purple-400 ml-2" />
                  <input
                    type="number"
                    step="0.1"
                    value={localRates.mortgage}
                    onChange={(e) =>
                      handleRateChange("mortgage", e.target.value)
                    }
                    className="bg-transparent w-full text-white font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  Credit Rate (%)
                </label>
                <div className="flex items-center gap-2 bg-gray-900 p-2 rounded-xl border border-gray-700 mt-1">
                  <Percent size={16} className="text-orange-400 ml-2" />
                  <input
                    type="number"
                    step="0.1"
                    value={localRates.credit}
                    onChange={(e) => handleRateChange("credit", e.target.value)}
                    className="bg-transparent w-full text-white font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  Inflation (%)
                </label>
                <div className="flex items-center gap-2 bg-gray-900 p-2 rounded-xl border border-gray-700 mt-1">
                  <TrendingUp size={16} className="text-blue-400 ml-2" />
                  <input
                    type="number"
                    step="0.1"
                    value={localRates.inflation}
                    onChange={(e) =>
                      handleRateChange("inflation", e.target.value)
                    }
                    className="bg-transparent w-full text-white font-bold outline-none"
                  />
                </div>
              </div>

              <Button variant="primary" onClick={saveRates}>
                Update Rates
              </Button>
            </div>
          </section>

          {/* User Management */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Users size={18} className="text-green-400" />
              <h2 className="text-lg font-bold">User Management</h2>
            </div>

            <div className="bg-gray-800 p-5 rounded-3xl border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      currentUserData.isActive ? "bg-blue-600" : "bg-red-500"
                    }`}
                  >
                    {currentUserData.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white">
                      {currentUserData.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {currentUserData.isActive ? "Active" : "Deactivated"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingUser(true)}
                  className="p-2 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600"
                >
                  <Edit3 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-900 p-3 rounded-2xl">
                  <p className="text-xs text-gray-500">Balance</p>
                  <p className="font-bold text-white">
                    {formatCurrency(currentUserData.balance)}
                  </p>
                </div>
                <div className="bg-gray-900 p-3 rounded-2xl">
                  <p className="text-xs text-gray-500">Transactions</p>
                  <p className="font-bold text-white">
                    {currentUserData.transactionsCount}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Edit User Modal */}
        {editingUser && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-fade-in">
            <div className="bg-gray-800 w-full rounded-3xl p-6 border border-gray-700 animate-slide-up">
              <h3 className="text-xl font-bold text-white mb-6">
                Edit User Profile
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1 ml-1">
                    User Email
                  </label>
                  <input
                    type="text"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-900 border border-gray-600 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="bg-gray-900 p-3 rounded-2xl border border-gray-600 flex items-center justify-between">
                  <span className="text-gray-300 font-medium ml-1">
                    Account Active
                  </span>
                  <button
                    onClick={() => setEditActive(!editActive)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                      editActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                        editActive ? "translate-x-6" : "translate-x-0"
                      }`}
                    ></div>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button
                  variant="secondary"
                  onClick={() => setEditingUser(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" onClick={saveUser}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminScreen;
