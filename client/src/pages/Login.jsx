import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    HeartPulse,
    ShieldCheck,
    CalendarCheck,
    FileText,
    Loader2,
    AlertCircle
} from "lucide-react";

/* ---------- reusable field (kept outside Login so inputs don't lose focus) ---------- */

const Field = ({ id, label, icon: Icon, right, labelRight, ...inputProps }) => (
    <div>
        <div className="flex items-center justify-between mb-1.5">
            <label htmlFor={id} className="text-sm font-medium text-slate-800">
                {label}
            </label>
            {labelRight}
        </div>

        <div className="relative">
            <Icon
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
                id={id}
                name={id}
                className={`w-full h-11 pl-10 ${right ? "pr-11" : "pr-3.5"} text-sm text-slate-900 placeholder:text-slate-400 bg-white rounded-lg border border-slate-300 hover:border-slate-400 transition focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100`}
                {...inputProps}
            />

            {right}
        </div>
    </div>
);

/* ---------- page ---------- */

const Login = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.email.trim() || !form.password) {
            return setError("Enter your email and password.");
        }

        try {
            setLoading(true);

            const url = import.meta.env.VITE_SERVER_URL;

            const res = await fetch(`${url}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...form,
                    email: form.email.trim()
                })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                return setError(data.error || "Login failed. Try again.");
            }

            localStorage.setItem("token", data.data.accessToken);
            localStorage.setItem("userId", data.data.user._id);

            navigate("/");
        } catch (err) {
            console.error("Login Error:", err);
            setError("Can't reach the server. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6">
            <style>{`
                @keyframes ecg-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
                .ecg-line { stroke-dasharray: 1; animation: ecg-draw 2.4s ease-out forwards; }
                @media (prefers-reduced-motion: reduce) {
                    .ecg-line { animation: none; stroke-dashoffset: 0; }
                }
            `}</style>

            <div className="w-full max-w-5xl bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid lg:grid-cols-5">

                <aside className="hidden lg:flex lg:col-span-2 flex-col justify-between bg-teal-900 text-white p-10">

                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="bg-teal-800 p-2 rounded-lg">
                                <HeartPulse size={22} aria-hidden="true" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold leading-none">
                                    MediCare
                                </p>
                                <p className="text-xs text-teal-200 mt-1">
                                    Hospital Management System
                                </p>
                            </div>
                        </div>

                        <h2 className="mt-14 text-3xl font-semibold tracking-tight leading-tight">
                            Welcome back to your care team.
                        </h2>

                        <p className="mt-4 text-sm leading-6 text-teal-100 max-w-sm">
                            Sign in to see your appointments and visit history.
                        </p>

                        <ul className="mt-9 space-y-4 text-sm text-teal-50">
                            <li className="flex items-center gap-3">
                                <CalendarCheck
                                    size={18}
                                    className="text-teal-300 shrink-0"
                                    aria-hidden="true"
                                />
                                Book and manage appointments
                            </li>
                            <li className="flex items-center gap-3">
                                <FileText
                                    size={18}
                                    className="text-teal-300 shrink-0"
                                    aria-hidden="true"
                                />
                                See your visit history in one place
                            </li>
                            <li className="flex items-center gap-3">
                                <ShieldCheck
                                    size={18}
                                    className="text-teal-300 shrink-0"
                                    aria-hidden="true"
                                />
                                Secure patient sign in
                            </li>
                        </ul>
                    </div>

                    <div>
                        <svg
                            viewBox="0 0 400 80"
                            className="w-full h-16 text-teal-300"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                className="ecg-line"
                                pathLength="1"
                                d="M0 40 H110 L125 40 L140 12 L158 68 L172 40 H215 L228 40 L240 26 L252 40 H400"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <p className="mt-4 text-xs text-teal-300">
                            © 2026 MediCare. All rights reserved.
                        </p>
                    </div>
                </aside>

                {/* RIGHT PANEL */}
                <main className="lg:col-span-3 p-6 sm:p-10 flex items-center">
                    <div className="w-full max-w-md mx-auto">

                        {/* Mobile logo */}
                        <div className="flex lg:hidden items-center gap-2 mb-8 text-teal-800">
                            <HeartPulse size={24} aria-hidden="true" />
                            <span className="text-lg font-semibold">
                                MediCare
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                            Sign in
                        </h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Enter your email and password to continue.
                        </p>

                        <form
                            onSubmit={handleLogin}
                            noValidate
                            className="mt-8 space-y-5"
                        >
                            <Field
                                id="email"
                                label="Email address"
                                icon={Mail}
                                type="email"
                                placeholder="name@example.com"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />

                            <Field
                                id="password"
                                label="Password"
                                icon={Lock}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                right={
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-slate-400 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-200"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                }
                            />

                            {error && (
                                <div
                                    role="alert"
                                    className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-3.5 py-3 rounded-lg text-sm"
                                >
                                    <AlertCircle
                                        size={17}
                                        className="mt-0.5 shrink-0"
                                        aria-hidden="true"
                                    />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-teal-200"
                            >
                                {loading && (
                                    <Loader2
                                        size={17}
                                        className="animate-spin"
                                        aria-hidden="true"
                                    />
                                )}
                                {loading ? "Signing in…" : "Sign in"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-600">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                            >
                                Create one
                            </Link>
                        </p>

                        <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-center gap-2 text-xs text-slate-500">
                            <ShieldCheck size={14} aria-hidden="true" />
                            Your information is handled securely.
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Login;