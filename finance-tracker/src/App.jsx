export const API_URL = "https://citied-unforward-tennie.ngrok-free.dev";
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
  const [users, setUsers] = useState([]);
  const [view, setView] = useState("auth");
  const [transactions, setTransactions] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://citied-unforward-tennie.ngrok-free.dev/Auth/all-users",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const [rates, setRates] = useState({
    mortgage: 6.5,
    credit: 14.2,
    inflation: 4.1,
  });

  const savings = useMemo(
    () => ({
      goal: user?.savingsGoal ?? 0,
      current: user?.currentSavings ?? 0,
    }),
    [user],
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("finance_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setView(parsedUser.role === "admin" ? "admin" : "home");
    }
  }, []);

  useEffect(() => {
    const fetchUserTransactions = async () => {
      if (!user || !user.id) return;

      try {
        const response = await fetch(
          `${API_URL}/Transaction?userId=${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        }
      } catch (error) {
        console.error("Database fetch error:", error);
      }
    };

    fetchUserTransactions();
  }, [user, API_URL]);

  useEffect(() => {
    const savedUser = localStorage.getItem("finance_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setView(parsedUser.role?.toLowerCase() === "admin" ? "admin" : "home");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const balance = useMemo(
    () =>
      transactions.reduce(
        (acc, curr) => (curr.isIncome ? acc + curr.amount : acc - curr.amount),
        0,
      ),
    [transactions],
  );

  const income = useMemo(
    () =>
      transactions
        .filter((t) => t.isIncome)
        .reduce((acc, curr) => acc + curr.amount, 0),
    [transactions],
  );

  const expense = useMemo(
    () =>
      transactions
        .filter((t) => !t.isIncome)
        .reduce((acc, curr) => acc + curr.amount, 0),
    [transactions],
  );

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setView(data.user.role?.toLowerCase() === "admin" ? "admin" : "home");
        localStorage.setItem("finance_user", JSON.stringify(data.user));
        localStorage.setItem("finance_token", data.token);
      } else {
        alert("Login failed! Check your credentials.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/Auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: name,
          Email: email,
          Password: password,
        }),
      });

      if (response.ok) {
        alert("Registration successful! You can now log in.");
      } else {
        alert("Registration failed.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView("auth");
    localStorage.removeItem("finance_user");
  };

  const addTransaction = async (transactionData) => {
    const token = localStorage.getItem("finance_token");

    console.log("Saving transaction for User ID:", user.id);

    try {
      const response = await fetch(`${API_URL}/Transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...transactionData,
          userId: user.id,
        }),
      });

      if (response.ok) {
        const savedTx = await response.json();
        // Update local state so the UI (Total Balance/Transactions) refreshes immediately
        setTransactions([savedTx, ...transactions]);
        setIsModalOpen(false); // Close the modal
      } else {
        alert("Failed to save transaction to database.");
      }
    } catch (err) {
      console.error("Backend connection error:", err);
    }
  };

  const deleteTransaction = async (id) => {
    // Confirm with user before deleting from the database
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;

    try {
      const response = await fetch(`${API_URL}/Transaction/${id}`, {
        method: "DELETE",
        headers: {
          // Ensure the token is included if you have authorization enabled
          Authorization: `Bearer ${localStorage.getItem("finance_token")}`,
        },
      });

      if (response.ok) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      } else {
        const error = await response.json();
        console.error("Delete failed:", error);
        alert("Could not delete from database.");
      }
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  const updateSavings = async (newSavingsData) => {
    const token = localStorage.getItem("finance_token");

    try {
      const response = await fetch(
        `${API_URL}/Auth/update-savings/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentSavings: newSavingsData.current,
            savingsGoal: newSavingsData.goal,
          }),
        },
      );

      if (response.ok) {
        const updatedUser = {
          ...user,
          currentSavings: newSavingsData.current,
          savingsGoal: newSavingsData.goal,
        };
        setUser(updatedUser);
        localStorage.setItem("finance_user", JSON.stringify(updatedUser));
        setIsSavingsModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to update savings:", error);
    }
  };

  const handleUpdateRates = (newRates) => {
    setRates(newRates);
  };

  const handleUpdateUser = async (updatedData) => {
    try {
      const response = await fetch(`${API_URL}/Auth/update-user-profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Email: updatedData.email,
          IsActive: updatedData.isActive,
        }),
      });

      if (response.ok) {
        alert(`Status for ${updatedData.email} updated successfully!`);
        if (user.email === updatedData.email) {
          const newUser = {
            ...user,
            name: updatedData.name,
            isActive: updatedData.isActive,
          };
          setUser(newUser);
          localStorage.setItem("finance_user", JSON.stringify(newUser));
        }
      } else {
        alert("Failed to update the user in the database.");
      }
    } catch (error) {
      console.error("Backend error:", error);
    }
  };

  if (view === "auth") {
    return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />;
  }

  if (view === "admin") {
    return (
      <AdminScreen
        users={users}
        user={user}
        rates={rates}
        onUpdateRates={handleUpdateRates}
        onLogout={handleLogout}
        currentUserData={{
          name: user?.name || "User",
          email: user?.email,
          balance,
          transactionsCount: transactions.length,
          isActive: user?.isActive ?? true,
        }}
        onUpdateUser={handleUpdateUser}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-white shadow-2xl overflow-hidden relative min-h-screen flex flex-col">
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
