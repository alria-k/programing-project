import React, { useState } from "react";
import { Wallet } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const AuthScreen = ({ onLogin, onRegister }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) return;

        if (isLogin === true) {
            console.log("TRIGGERING LOGIN PATH");
            onLogin(email, password);
            return;
        }

        if (isLogin === false) {
            console.log("TRIGGERING REGISTER PATH");
            if (!name) {
                alert("Please enter your name");
                return;
            }
            onRegister(name, email, password);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-xl">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                        <Wallet size={32} />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    {isLogin ? "Welcome back!" : "Create Account"}
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    {isLogin
                        ? "Log in to manage your budget"
                        : "Start tracking your finance"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <Input
                            label="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Danylo"
                        />
                    )}
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="hello@example.com"
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />

                    {/* Submit button — explicitly submits the form and triggers handleSubmit */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:opacity-90"
                    >
                        {isLogin ? "Log In" : "Sign Up"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        {/* Toggle button (outside the form) — only switches UI */}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-blue-600 font-semibold hover:underline"
                            type="button"
                        >
                            {isLogin ? "Sign Up" : "Log In"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;