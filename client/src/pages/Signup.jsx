import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    HeartPulse,
    ShieldCheck,
    CalendarCheck,
    FileText,
    Loader2,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

/* ---------- helpers ---------- */

const validateField = (name, value) => {
    switch (name) {
        case "name":
            return value.trim().length < 2 ? "Enter your full name." : "";
        case "email":
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
                ? ""
                : "Enter a valid email, like name@example.com.";
        case "phone": {
            const digits = value.replace(/\D/g, "");
            return digits.length >= 10 && digits.length <= 15
                ? ""
                : "Enter a valid phone number (10–15 digits).";
        }
        case "password":
            return value.length < 8 ? "Use at least 8 characters." : "";
        default:
            return "";
    }
};

const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
};

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = [
    "",
    "bg-red-400",
    "bg-amber-400",
    "bg-teal-500",
    "bg-emerald-600"
];

/* ---------- reusable field (kept outside Signup so inputs don't lose focus) ---------- */

const Field = ({ id, label, icon: Icon, error, hint, right, ...inputProps }) => (
    <div>
        <label
            htmlFor={id}
            className="block text-sm font-medium text-slate-800 mb-1.5"
        >
            {label}
        </label>

        <div className="relative">
            <Icon
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
                id={id}
                name={id}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={
                    error ? `${id}-error` : hint ? `${id}-hint` : undefined
                }
                className={`w-full h-11 pl-10 ${right ? "pr-11" : "pr-3.5"} text-sm text-slate-900 placeholder:text-slate-400 bg-white rounded-lg border transition focus:outline-none focus:ring-4 ${
                    error
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-300 hover:border-slate-400 focus:border-teal-600 focus:ring-teal-100"
                }`}
                {...inputProps}
            />

            {right}
        </div>

        {error ? (
            <p
                id={`${id}-error`}
                className="mt-1.5 flex items-center gap-1 text-xs text-red-600"
            >
                <AlertCircle size={13} aria-hidden="true" />
                {error}
            </p>
        ) : hint ? (
            <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">
                {hint}
            </p>
        ) : null}
    </div>
);

/* ---------- page ---------- */

const Signup = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: ""
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // After a successful signup, send the user to the login page.
    useEffect(() => {
        if (!success) return;
        const timer = setTimeout(() => navigate("/login"), 2500);
        return () => clearTimeout(timer);
    }, [success, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // Re-check live only after the field has already shown an error.
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({
                ...prev,
                [name]: validateField(name, value)
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setFieldErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        const errors = {};
        Object.keys(form).forEach((key) => {
            const msg = validateField(key, form[key]);
            if (msg) errors[key] = msg;
        });

        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) {
            return setError("Check the highlighted fields and try again.");
        }

        try {
            setLoading(true);

            const url = import.meta.env.VITE_SERVER_URL;

            const res = await fetch(`${url}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...form,
                    name: form.name.trim(),
                    email: form.email.trim().toLowerCase(),
                    phone: form.phone.trim()
                })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || "Registration failed");
            }

            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const strength = getStrength(form.password);

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6">
            {/* Draws the ECG line once when the page loads */}
            <style>{`
                @keyframes ecg-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
                .ecg-line { stroke-dasharray: 1; animation: ecg-draw 2.4s ease-out forwards; }
                @media (prefers-reduced-motion: reduce) {
                    .ecg-line { animation: none; stroke-dashoffset: 0; }
                }
            `}</style>

            <div className="w-full max-w-5xl bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid lg:grid-cols-5">

                {/* LEFT PANEL */}
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
                            Your care, organised in one account.
                        </h2>

                        <p className="mt-4 text-sm leading-6 text-teal-100 max-w-sm">
                            Register once to book appointments and keep track
                            of your visits with your healthcare team.
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
                                Secure patient registration
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

                        {success ? (
                            <div className="text-center py-10" role="status">
                                <CheckCircle2
                                    size={52}
                                    className="mx-auto text-emerald-600"
                                    aria-hidden="true"
                                />
                                <h1 className="mt-5 text-2xl font-semibold text-slate-900">
                                    Account created
                                </h1>
                                <p className="mt-2 text-sm text-slate-600">
                                    Taking you to sign in…
                                </p>
                                <Link
                                    to="/login"
                                    className="mt-6 inline-flex h-11 items-center justify-center px-6 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-teal-200"
                                >
                                    Go to sign in
                                </Link>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                                    Create your account
                                </h1>
                                <p className="mt-2 text-sm text-slate-600">
                                    Sign up as a patient to book appointments
                                    and view your visits.
                                </p>

                                <form
                                    onSubmit={handleSignup}
                                    noValidate
                                    className="mt-8 space-y-5"
                                >
                                    <Field
                                        id="name"
                                        label="Full name"
                                        icon={User}
                                        type="text"
                                        placeholder="e.g. Ayesha Khan"
                                        value={form.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        autoComplete="name"
                                        error={fieldErrors.name}
                                    />

                                    <Field
                                        id="email"
                                        label="Email address"
                                        icon={Mail}
                                        type="email"
                                        placeholder="name@example.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        autoComplete="email"
                                        error={fieldErrors.email}
                                    />

                                    <Field
                                        id="phone"
                                        label="Phone number"
                                        icon={Phone}
                                        type="tel"
                                        placeholder="e.g. 9876543210"
                                        value={form.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        autoComplete="tel"
                                        error={fieldErrors.phone}
                                    />

                                    <div>
                                        <Field
                                            id="password"
                                            label="Password"
                                            icon={Lock}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="At least 8 characters"
                                            value={form.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            autoComplete="new-password"
                                            error={fieldErrors.password}
                                            right={
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            (prev) => !prev
                                                        )
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

                                        {form.password && (
                                            <div className="mt-2.5" aria-live="polite">
                                                <div className="flex gap-1.5">
                                                    {[1, 2, 3, 4].map((i) => (
                                                        <div
                                                            key={i}
                                                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                                                                i <= strength
                                                                    ? STRENGTH_COLORS[strength]
                                                                    : "bg-slate-200"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="mt-1.5 text-xs text-slate-500">
                                                    Password strength:{" "}
                                                    <span className="font-medium text-slate-700">
                                                        {STRENGTH_LABELS[strength] || "Too short"}
                                                    </span>
                                                </p>
                                            </div>
                                        )}
                                    </div>

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
                                        {loading
                                            ? "Creating account…"
                                            : "Create account"}
                                    </button>
                                </form>

                                <p className="mt-6 text-center text-sm text-slate-600">
                                    Already have an account?{" "}
                                    <Link
                                        to="/login"
                                        className="font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                                    >
                                        Sign in
                                    </Link>
                                </p>

                                <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-center gap-2 text-xs text-slate-500">
                                    <ShieldCheck size={14} aria-hidden="true" />
                                    Your information is handled securely.
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Signup;