import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Phone,
    IndianRupee,
    CalendarCheck,
    Award,
    HeartPulse,
    Search,
    AlertCircle,
    UserX,
    RefreshCw
} from "lucide-react";

/* ---------- helpers ---------- */

const getInitials = (name = "") =>
    name
        .replace(/^dr\.?\s+/i, "")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("") || "Dr";

const formatExperience = (years) => {
    if (years === undefined || years === null || years === "") return "—";
    return `${years} ${Number(years) === 1 ? "year" : "years"}`;
};

/* ---------- avatar: photo if available, initials otherwise ---------- */

const Avatar = ({ src, name }) => {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return (
            <div
                aria-hidden="true"
                className="h-16 w-16 shrink-0 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-lg font-semibold"
            >
                {getInitials(name)}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={name ? `Photo of ${name}` : "Doctor"}
            onError={() => setFailed(true)}
            className="h-16 w-16 shrink-0 rounded-full object-cover border border-slate-200"
        />
    );
};

/* ---------- loading placeholder ---------- */

const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse motion-reduce:animate-none">
        <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-3 w-1/2 rounded bg-slate-200" />
            </div>
        </div>
        <div className="mt-5 space-y-3">
            <div className="h-3 rounded bg-slate-200" />
            <div className="h-3 rounded bg-slate-200" />
            <div className="h-3 rounded bg-slate-200" />
        </div>
        <div className="mt-6 h-11 rounded-lg bg-slate-200" />
    </div>
);

/* ---------- page ---------- */

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [specialization, setSpecialization] = useState("all");

    const navigate = useNavigate();

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            setError("");

            const url = import.meta.env.VITE_SERVER_URL;
            const res = await fetch(`${url}/doctor`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Request failed");
            }

            setDoctors(data.data || []);
        } catch (err) {
            console.log(err);
            setError("We couldn't load the doctors. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const specializations = useMemo(
        () =>
            [...new Set(doctors.map((d) => d.specialization).filter(Boolean))].sort(),
        [doctors]
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        return doctors.filter((doc) => {
            const matchesSpec =
                specialization === "all" || doc.specialization === specialization;

            const matchesQuery =
                !q ||
                (doc.userId?.name || "").toLowerCase().includes(q) ||
                (doc.specialization || "").toLowerCase().includes(q);

            return matchesSpec && matchesQuery;
        });
    }, [doctors, query, specialization]);

    return (
        <div className="min-h-screen bg-slate-100 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-teal-800 text-white">
                            <HeartPulse size={24} aria-hidden="true" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                                Our doctors
                            </h1>
                            <p className="mt-1 text-sm text-slate-600">
                                Choose a specialist and book your appointment.
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    {!loading && !error && doctors.length > 0 && (
                        <div className="flex flex-col sm:flex-row gap-3 md:w-auto w-full">
                            <div className="relative sm:w-64">
                                <label htmlFor="doctor-search" className="sr-only">
                                    Search doctors
                                </label>
                                <Search
                                    size={17}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    id="doctor-search"
                                    type="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search by name or specialty"
                                    className="w-full h-11 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white rounded-lg border border-slate-300 hover:border-slate-400 transition focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                                />
                            </div>

                            <div>
                                <label htmlFor="doctor-specialty" className="sr-only">
                                    Filter by specialty
                                </label>
                                <select
                                    id="doctor-specialty"
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                    className="w-full sm:w-52 h-11 px-3.5 text-sm text-slate-900 bg-white rounded-lg border border-slate-300 hover:border-slate-400 transition focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                                >
                                    <option value="all">All specialties</option>
                                    {specializations.map((spec) => (
                                        <option key={spec} value={spec}>
                                            {spec}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </header>

                {/* Content */}
                <main className="mt-8">

                    {loading && (
                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                            aria-busy="true"
                        >
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    )}

                    {!loading && error && (
                        <div
                            role="alert"
                            className="max-w-md mx-auto bg-white rounded-xl border border-slate-200 p-8 text-center"
                        >
                            <AlertCircle
                                size={36}
                                className="mx-auto text-red-500"
                                aria-hidden="true"
                            />
                            <h2 className="mt-4 text-lg font-semibold text-slate-900">
                                Couldn't load doctors
                            </h2>
                            <p className="mt-1 text-sm text-slate-600">{error}</p>
                            <button
                                onClick={fetchDoctors}
                                className="mt-6 inline-flex h-11 items-center justify-center gap-2 px-6 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-teal-200"
                            >
                                <RefreshCw size={16} aria-hidden="true" />
                                Try again
                            </button>
                        </div>
                    )}

                    {!loading && !error && doctors.length === 0 && (
                        <div className="max-w-md mx-auto bg-white rounded-xl border border-slate-200 p-8 text-center">
                            <UserX
                                size={36}
                                className="mx-auto text-slate-400"
                                aria-hidden="true"
                            />
                            <h2 className="mt-4 text-lg font-semibold text-slate-900">
                                No doctors available yet
                            </h2>
                            <p className="mt-1 text-sm text-slate-600">
                                Check back soon. New doctors appear here once they join.
                            </p>
                        </div>
                    )}

                    {!loading && !error && doctors.length > 0 && (
                        <>
                            <p className="mb-4 text-sm text-slate-600" aria-live="polite">
                                Showing {filtered.length} of {doctors.length}{" "}
                                {doctors.length === 1 ? "doctor" : "doctors"}
                            </p>

                            {filtered.length === 0 ? (
                                <div className="max-w-md mx-auto bg-white rounded-xl border border-slate-200 p-8 text-center">
                                    <Search
                                        size={32}
                                        className="mx-auto text-slate-400"
                                        aria-hidden="true"
                                    />
                                    <h2 className="mt-4 text-lg font-semibold text-slate-900">
                                        No matching doctors
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Try a different name or choose another specialty.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setQuery("");
                                            setSpecialization("all");
                                        }}
                                        className="mt-6 text-sm font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {filtered.map((doc) => (
                                        <article
                                            key={doc._id}
                                            className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col"
                                        >
                                            <div className="flex items-center gap-4">
                                                <Avatar
                                                    src={doc.profileImage}
                                                    name={doc.userId?.name}
                                                />

                                                <div className="min-w-0">
                                                    <h2 className="text-lg font-semibold text-slate-900 truncate">
                                                        {doc.userId?.name || "Doctor"}
                                                    </h2>
                                                    <p className="text-sm font-medium text-teal-700">
                                                        {doc.specialization || "General physician"}
                                                    </p>
                                                </div>
                                            </div>

                                            <dl className="mt-5 pt-5 border-t border-slate-200 space-y-3 text-sm">
                                                <div className="flex items-center justify-between gap-3">
                                                    <dt className="flex items-center gap-2 text-slate-500">
                                                        <Award size={16} aria-hidden="true" />
                                                        Experience
                                                    </dt>
                                                    <dd className="font-medium text-slate-900">
                                                        {formatExperience(doc.experience)}
                                                    </dd>
                                                </div>

                                                <div className="flex items-center justify-between gap-3">
                                                    <dt className="flex items-center gap-2 text-slate-500">
                                                        <IndianRupee size={16} aria-hidden="true" />
                                                        Consultation fee
                                                    </dt>
                                                    <dd className="font-medium text-slate-900">
                                                        {doc.fees !== undefined && doc.fees !== null
                                                            ? `₹${doc.fees}`
                                                            : "—"}
                                                    </dd>
                                                </div>

                                                <div className="flex items-center justify-between gap-3">
                                                    <dt className="flex items-center gap-2 text-slate-500">
                                                        <Phone size={16} aria-hidden="true" />
                                                        Contact
                                                    </dt>
                                                    <dd className="font-medium text-slate-900">
                                                        {doc.userId?.phone ? (
                                                            <a
                                                                href={`tel:${doc.userId.phone}`}
                                                                className="hover:text-teal-700 hover:underline"
                                                            >
                                                                {doc.userId.phone}
                                                            </a>
                                                        ) : (
                                                            "—"
                                                        )}
                                                    </dd>
                                                </div>
                                            </dl>

                                            <button
                                                onClick={() => navigate(`/book/${doc._id}`)}
                                                className="mt-6 w-full h-11 flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-teal-200"
                                            >
                                                <CalendarCheck size={17} aria-hidden="true" />
                                                Book appointment
                                            </button>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Doctors;