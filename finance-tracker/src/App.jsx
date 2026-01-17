import React, { useState, useEffect, useMemo } from "react";
import { Home, PieChart, Plus, LogOut, Lock } from "lucide-react";

// Components
import Button from "./components/ui/Button";
import NavItem from "./components/layout/NavItem";

// Screens
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
import StatsScreen from "./screens/StatsScreen";
import AdminScreen from "./screens/AdminScreen";

// Modals
import AddTransactionModal from "./modals/AddTransactionModal";
import HistoryModal from "./modals/HistoryModal";
import SavingsModal from "./modals/SavingsModal";

// Utils
import { getTodayISO } from "./utils/helpers";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("auth");
  const [transactions, setTransactions] = useState([]);

  // Global States
  const [rates, setRates] = useState({
    mortgage: 6.5,
    credit: 14.2,
    inflation: 4.1,
  });
  const [savings, setSavings] = useState({ goal: 20000, current: 5000 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    const savedUser = localStorage.getItem("finance_user");
    const savedTx = localStorage.getItem("finance_transactions");
    const savedSavings = localStorage.getItem("finance_savings");
    const savedRates = localStorage.getItem("finance_rates");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.isActive === undefined) parsedUser.isActive = true;
      setUser(parsedUser);
      setView(parsedUser.role === "admin" ? "admin" : "home");
    }

    if (savedTx) {
      setTransactions(JSON.parse(savedTx));
    } else {
      const today = getTodayISO();
      setTransactions([
        {
          id: 1,
          type: "income",
          amount: 2500,
          category: "Salary",
          date: today,
          timestamp: new Date().toISOString(),
          icon: "Briefcase",
        },
        {
          id: 2,
          type: "expense",
          amount: 45,
          category: "Coffee",
          date: today,
          timestamp: new Date().toISOString(),
          icon: "Coffee",
        },
        {
          id: 3,
          type: "expense",
          amount: 120,
          category: "Groceries",
          date: "2023-10-27",
          timestamp: "2023-10-27T14:15:00.000Z",
          icon: "ShoppingBag",
        },
        {
          id: 4,
          type: "expense",
          amount: 30,
          category: "Taxi",
          date: "2023-10-27",
          timestamp: "2023-10-27T18:45:00.000Z",
          icon: "Car",
        },
      ]);
    }

    if (savedSavings) setSavings(JSON.parse(savedSavings));
    if (savedRates) setRates(JSON.parse(savedRates));
  }, []);

  // Save on change
  useEffect(() => {
    if (user) localStorage.setItem("finance_user", JSON.stringify(user));
    localStorage.setItem("finance_transactions", JSON.stringify(transactions));
    localStorage.setItem("finance_savings", JSON.stringify(savings));
    localStorage.setItem("finance_rates", JSON.stringify(rates));
  }, [user, transactions, savings, rates]);

  // Calculations
  const balance = useMemo(
    () =>
      transactions.reduce(
        (acc, curr) =>
          curr.type === "income" ? acc + curr.amount : acc - curr.amount,
        0
      ),
    [transactions]
  );
  const income = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((acc, curr) => acc + curr.amount, 0),
    [transactions]
  );
  const expense = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, curr) => acc + curr.amount, 0),
    [transactions]
  );

    const handleLogin = async (email, password) => {
        try {
            const response = await fetch("https://localhost:7055/Auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Email: email, Password: password }),
            });

            if (response.ok) {
                const data = await response.json();
                // We only want the 'user' part of the response
                setUser(data.user);
                setView(data.user.role === "admin" ? "admin" : "home");
                localStorage.setItem("finance_user", JSON.stringify(data.user));
            } else {
                alert("Login failed! Check your credentials.");
            }
        } catch (error) {
            alert("Server error.");
        }
    };

    const handleRegister = async (name, email, password) => {
        try {
            const response = await fetch("https://localhost:7055/Auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Name: name,
                    Email: email,
                    Password: password
                }),
            });

            if (response.ok) {
                alert("Registration successful! You can now log in.");
            } else {
                alert("Registration failed.");
            }
        } catch (error) {
            alert("Server error. Is the backend running?");
        }
    };

  const handleLogout = () => {
    setUser(null);
    setView("auth");
    localStorage.removeItem("finance_user");
  };

  const addTransaction = (tx) => {
    setTransactions((prev) => [tx, ...prev]);
    setIsModalOpen(false);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const updateSavings = (newSavings) => {
    setSavings(newSavings);
    setIsSavingsModalOpen(false);
  };

  const handleUpdateRates = (newRates) => {
    setRates(newRates);
  };

  const handleUpdateUser = (updatedData) => {
    const newUser = {
      ...user,
      name: updatedData.name,
      isActive: updatedData.isActive,
    };
    setUser(newUser);
    const diff = updatedData.balance - balance;
    if (diff !== 0) {
      const adjustmentTx = {
        id: Date.now(),
        type: diff > 0 ? "income" : "expense",
        amount: Math.abs(diff),
        category: "Admin Adjustment",
        date: getTodayISO(),
        timestamp: new Date().toISOString(),
        icon: "Shield",
      };
      setTransactions((prev) => [adjustmentTx, ...prev]);
    }
  };

  if (view === "auth") {
      return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />;
  }

  if (view === "admin") {
    return (
      <AdminScreen
        user={user}
        rates={rates}
        onUpdateRates={handleUpdateRates}
        onLogout={handleLogout}
        currentUserData={{
          name: "Danylo",
          balance,
          transactionsCount: transactions.length,
          isActive: true,
        }}
        onUpdateUser={handleUpdateUser}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-white shadow-2xl overflow-hidden relative min-h-screen flex flex-col">
        {/* DEACTIVATED ACCOUNT OVERLAY */}
        {user && user.isActive === false && (
          <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center p-8 bg-white/60 backdrop-blur-md">
            <div className="bg-white p-6 rounded-[2rem] shadow-2xl flex flex-col items-center text-center border border-gray-100 animate-slide-up">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <Lock size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Account Deactivated
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Your account has been suspended by the administrator. Please
                contact support to regain access.
              </p>
              <Button variant="outline" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="px-6 pt-12 pb-6 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <p className="text-gray-400 text-sm font-medium">Welcome back,</p>
            <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
          >
            <LogOut size={20} />
          </button>
        </header>

        {/* Content */}
        <main
          className={`flex-1 overflow-y-auto px-6 pb-28 scrollbar-hide ${
            user?.isActive === false
              ? "filter blur-sm pointer-events-none select-none"
              : ""
          }`}
        >
          {view === "home" && (
            <HomeScreen
              balance={balance}
              income={income}
              expense={expense}
              transactions={transactions}
              savings={savings}
              rates={rates}
              onSeeAll={() => setIsHistoryOpen(true)}
              onDelete={deleteTransaction}
              onEditSavings={() => setIsSavingsModalOpen(true)}
            />
          )}
          {view === "stats" && <StatsScreen transactions={transactions} />}
        </main>

        {/* Bottom Nav */}
        <nav
          className={`absolute bottom-0 w-full bg-white border-t border-gray-100 px-8 pb-6 pt-2 flex justify-between items-end z-20 h-24 ${
            user?.isActive === false ? "filter blur-sm pointer-events-none" : ""
          }`}
        >
          <NavItem
            icon={Home}
            label="Home"
            active={view === "home"}
            onClick={() => setView("home")}
          />

          <div className="relative -top-5">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-500/40 hover:scale-110 transition-transform active:scale-95 border-4 border-white"
            >
              <Plus size={32} />
            </button>
          </div>

          <NavItem
            icon={PieChart}
            label="Reports"
            active={view === "stats"}
            onClick={() => setView("stats")}
          />
        </nav>

        {/* Modals */}
        {isModalOpen && (
          <AddTransactionModal
            onClose={() => setIsModalOpen(false)}
            onAdd={addTransaction}
          />
        )}

        {isHistoryOpen && (
          <HistoryModal
            transactions={transactions}
            onClose={() => setIsHistoryOpen(false)}
            onDelete={deleteTransaction}
          />
        )}

        {isSavingsModalOpen && (
          <SavingsModal
            savings={savings}
            onSave={updateSavings}
            onClose={() => setIsSavingsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
