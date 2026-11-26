import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    IndianRupee,
    Award,
    ChevronLeft,
    ChevronRight,
    CalendarCheck,
    ArrowRight,
    AlertCircle,
    UserX,
    RefreshCw
} from "lucide-react";

import img1 from "../assets/nursingblog.webp";
import img2 from "../assets/n4.jpg";
import img3 from "../assets/n5.jpg";

const IMAGES = [img1, img2, img3];
const SLIDE_INTERVAL = 5000;

const STEPS = [
    {
        title: "Choose a doctor",
        text: "Browse specialists and compare experience and fees."
    },
    {
        title: "Pick a time",
        text: "Select a date and a time slot that works for you."
    },
    {
        title: "Confirm your booking",
        text: "Get your appointment confirmed in a few taps."
    }
];

/* ---------- helpers ---------- */

const getInitials = (name = "") =>
    name
        .replace(/^dr\.?\s+/i, "")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("") || "Dr";

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
        </div>
        <div className="mt-6 h-11 rounded-lg bg-slate-200" />
    </div>
);

/* ---------- page ---------- */

const Home = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);

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

            setDoctors(data.data?.slice(0, 6) || []);
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

    // Auto-advance the slideshow. Stops on hover/focus and for people who
    // have "reduce motion" turned on in their system settings.
    useEffect(() => {
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (paused || reduceMotion) return;

        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % IMAGES.length);
        }, SLIDE_INTERVAL);

        return () => clearInterval(interval);
    }, [paused]);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % IMAGES.length);
    const prevSlide = () =>
        setCurrent((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);

    return (
        <div className="bg-slate-100 min-h-screen">

            {/* HERO */}
            <section
                aria-roledescription="carousel"
                aria-label="MediCare hospital photos"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onFocus={() => setPaused(true)}
                onBlur={() => setPaused(false)}
                className="relative h-[420px] md:h-[520px] overflow-hidden bg-teal-900"
            >
                {IMAGES.map((src, index) => (
                    <img
                        key={src}
                        src={src}
                        alt=""
                        aria-hidden="true"
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 motion-reduce:transition-none ${
                            index === current ? "opacity-100" : "opacity-0"
                        }`}
                    />
                ))}

                {/* Dark teal overlay keeps the text readable on any photo */}
                <div className="absolute inset-0 bg-teal-900/75" />

                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                    <div className="max-w-2xl text-white">
                        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
                            Book a trusted doctor in minutes.
                        </h1>

                        <p className="mt-4 text-base md:text-lg text-teal-50 leading-7">
                            Choose a specialist, pick a time that suits you, and
                            confirm your appointment online.
                        </p>

                        <button
                            onClick={() => navigate("/doctors")}
                            className="mt-8 inline-flex h-12 items-center justify-center gap-2 px-7 rounded-lg bg-white hover:bg-teal-50 text-teal-900 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-white/40"
                        >
                            View doctors
                            <ArrowRight size={17} aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* Slide controls */}
                <button
                    onClick={prevSlide}
                    aria-label="Previous photo"
                    className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 hover:bg-white text-slate-800 transition focus:outline-none focus:ring-4 focus:ring-white/40"
                >
                    <ChevronLeft size={20} aria-hidden="true" />
                </button>

                <button
                    onClick={nextSlide}
                    aria-label="Next photo"
                    className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 hover:bg-white text-slate-800 transition focus:outline-none focus:ring-4 focus:ring-white/40"
                >
                    <ChevronRight size={20} aria-hidden="true" />
                </button>

                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    {IMAGES.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            aria-label={`Go to photo ${index + 1}`}
                            aria-current={index === current}
                            className={`h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white ${
                                index === current
                                    ? "w-6 bg-white"
                                    : "w-2 bg-white/50 hover:bg-white/80"
                            }`}
                        />
                    ))}
                </div>
            </section>

            {/* DOCTORS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                            Available doctors
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Choose a specialist and book your appointment.
                        </p>
                    </div>

                    {!loading && !error && doctors.length > 0 && (
                        <button
                            onClick={() => navigate("/doctors")}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800 hover:underline focus:outline-none focus:ring-2 focus:ring-teal-200 rounded"
                        >
                            View all doctors
                            <ArrowRight size={16} aria-hidden="true" />
                        </button>
                    )}
                </div>

                <div className="mt-8">

                    {loading && (
                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                            aria-busy="true"
                        >
                            {[1, 2, 3].map((i) => (
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
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                Couldn't load doctors
                            </h3>
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
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                No doctors available yet
                            </h3>
                            <p className="mt-1 text-sm text-slate-600">
                                Check back soon. New doctors appear here once they join.
                            </p>
                        </div>
                    )}

                    {!loading && !error && doctors.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {doctors.map((doc) => (
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
                                            <h3 className="text-lg font-semibold text-slate-900 truncate">
                                                {doc.userId?.name || "Doctor"}
                                            </h3>
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
                                                {doc.experience !== undefined &&
                                                doc.experience !== null &&
                                                doc.experience !== ""
                                                    ? `${doc.experience} ${
                                                          Number(doc.experience) === 1
                                                              ? "year"
                                                              : "years"
                                                      }`
                                                    : "—"}
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
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                        How booking works
                    </h2>

                    <ol className="mt-8 grid gap-8 md:grid-cols-3">
                        {STEPS.map((step, index) => (
                            <li key={step.title} className="flex items-start gap-4">
                                <span
                                    aria-hidden="true"
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-800 text-white text-sm font-semibold"
                                >
                                    {index + 1}
                                </span>
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">
                                        {step.title}
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        {step.text}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>
        </div>
    );
};

export default Home;