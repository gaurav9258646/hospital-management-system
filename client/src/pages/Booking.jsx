import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    Calendar,
    Clock,
    IndianRupee,
    HeartPulse,
    Award,
    ArrowLeft,
    ShieldCheck,
    Loader2,
    AlertCircle,
    CheckCircle2,
    XCircle
} from "lucide-react";

const TIME_SLOTS = ["10:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"];

/* ---------- helpers ---------- */

const getInitials = (name = "") =>
    name
        .replace(/^dr\.?\s+/i, "")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("") || "Dr";

const formatDate = (value) => {
    if (!value) return "";
    return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
};

const Avatar = ({ src, name }) => {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return (
            <div
                aria-hidden="true"
                className="h-20 w-20 shrink-0 rounded-full bg-teal-800 text-white flex items-center justify-center text-2xl font-semibold"
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
            className="h-20 w-20 shrink-0 rounded-full object-cover border-2 border-teal-700"
        />
    );
};

/* ---------- page ---------- */

const Booking = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const url = import.meta.env.VITE_SERVER_URL;

    const [doctor, setDoctor] = useState(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("Regular health checkup");
    const [appointmentId, setAppointmentId] = useState("");
    const [booked, setBooked] = useState(null); // { date, time }

    const [loading, setLoading] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [confirmingCancel, setConfirmingCancel] = useState(false);
    const [doctorLoading, setDoctorLoading] = useState(true);
    const [error, setError] = useState(""); // doctor load error
    const [notice, setNotice] = useState(null); // { type, text }

    const token = localStorage.getItem("token");
    const today = new Date().toLocaleDateString("en-CA");

    // GET DOCTOR
    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchDoctor = async () => {
            try {
                const res = await fetch(`${url}/doctor/${id}`);
                const data = await res.json();

                if (!res.ok || !data.success) {
                    throw new Error(data.error || "Doctor not found");
                }

                setDoctor(data.data);
            } catch (err) {
                console.error("Fetch Doctor Error:", err);
                setError(err.message);
            } finally {
                setDoctorLoading(false);
            }
        };

        fetchDoctor();
    }, [id, navigate, token, url]);

    // CREATE APPOINTMENT
    const handleBooking = async () => {
        setNotice(null);

        if (!date || !time) {
            return setNotice({
                type: "error",
                text: "Choose a date and a time slot to continue."
            });
        }

        if (date < today) {
            return setNotice({
                type: "error",
                text: "Choose today's date or a future date."
            });
        }

        try {
            setLoading(true);

            const res = await fetch(`${url}/appointments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    doctorId: id,
                    date,
                    time,
                    reason: reason.trim() || "Regular health checkup"
                })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || data.message || "Booking failed");
            }

            setAppointmentId(data.data._id);
            setBooked({ date, time });
            setNotice(null);
        } catch (err) {
            console.error("Booking Error:", err);
            setNotice({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    // CANCEL APPOINTMENT
    const handleCancelAppointment = async () => {
        if (!appointmentId) return;

        try {
            setCancelLoading(true);
            setNotice(null);

            const res = await fetch(`${url}/appointments/cancel/${appointmentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    cancelReason: "Patient not available"
                })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || "Cancel failed");
            }

            setAppointmentId("");
            setBooked(null);
            setConfirmingCancel(false);
            setNotice({
                type: "success",
                text: "Your appointment was cancelled. You can book a new slot below."
            });
        } catch (err) {
            console.error("Cancel Error:", err);
            setConfirmingCancel(false);
            setNotice({ type: "error", text: err.message });
        } finally {
            setCancelLoading(false);
        }
    };

    /* ----- loading / error screens ----- */

    if (doctorLoading) {
        return (
            <div
                className="min-h-screen bg-slate-100 flex items-center justify-center"
                role="status"
            >
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Loader2
                        size={18}
                        className="animate-spin motion-reduce:animate-none"
                        aria-hidden="true"
                    />
                    Loading doctor details…
                </div>
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
                <div
                    role="alert"
                    className="max-w-md w-full bg-white rounded-xl border border-slate-200 p-8 text-center"
                >
                    <AlertCircle
                        size={36}
                        className="mx-auto text-red-500"
                        aria-hidden="true"
                    />
                    <h1 className="mt-4 text-lg font-semibold text-slate-900">
                        Couldn't load this doctor
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        {error || "Doctor not found"}
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-6 inline-flex h-11 items-center justify-center gap-2 px-6 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-teal-200"
                    >
                        <ArrowLeft size={16} aria-hidden="true" />
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    const doctorName = doctor.userId?.name || "Doctor";

    return (
        <div className="min-h-screen bg-slate-100 px-4 sm:px-6 py-6 sm:py-10">
            <div className="max-w-4xl mx-auto">

                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-200 rounded"
                >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Back to doctors
                </button>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid lg:grid-cols-5">

                    {/* DOCTOR SUMMARY */}
                    <aside className="lg:col-span-2 bg-teal-900 text-white p-6 sm:p-8 flex flex-col">

                        <div className="flex items-center gap-2 text-teal-100">
                            <HeartPulse size={20} aria-hidden="true" />
                            <span className="text-sm font-semibold">MediCare</span>
                        </div>

                        <div className="mt-8 flex lg:flex-col items-center lg:items-start gap-4">
                            <Avatar src={doctor.profileImage} name={doctorName} />

                            <div>
                                <h2 className="text-xl font-semibold leading-tight">
                                    {doctorName}
                                </h2>
                                <p className="mt-1 text-sm text-teal-200">
                                    {doctor.specialization || "General physician"}
                                </p>
                            </div>
                        </div>

                        <dl className="mt-8 pt-6 border-t border-teal-800 space-y-3 text-sm">
                            {doctor.experience !== undefined &&
                                doctor.experience !== null &&
                                doctor.experience !== "" && (
                                    <div className="flex items-center justify-between gap-3">
                                        <dt className="flex items-center gap-2 text-teal-200">
                                            <Award size={16} aria-hidden="true" />
                                            Experience
                                        </dt>
                                        <dd className="font-medium">
                                            {doctor.experience}{" "}
                                            {Number(doctor.experience) === 1 ? "year" : "years"}
                                        </dd>
                                    </div>
                                )}

                            <div className="flex items-center justify-between gap-3">
                                <dt className="flex items-center gap-2 text-teal-200">
                                    <IndianRupee size={16} aria-hidden="true" />
                                    Consultation fee
                                </dt>
                                <dd className="font-medium">
                                    {doctor.fees !== undefined && doctor.fees !== null
                                        ? `₹${doctor.fees}`
                                        : "—"}
                                </dd>
                            </div>
                        </dl>

                        <div className="mt-8 lg:mt-auto pt-6 flex items-center gap-2 text-xs text-teal-300">
                            <ShieldCheck size={14} aria-hidden="true" />
                            Your booking is handled securely.
                        </div>
                    </aside>

                    {/* BOOKING PANEL */}
                    <main className="lg:col-span-3 p-6 sm:p-8">

                        {booked ? (
                            /* ---- booked state ---- */
                            <div role="status">
                                <CheckCircle2
                                    size={44}
                                    className="text-emerald-600"
                                    aria-hidden="true"
                                />
                                <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
                                    Appointment booked
                                </h1>
                                <p className="mt-2 text-sm text-slate-600">
                                    Your appointment with {doctorName} is confirmed.
                                </p>

                                <dl className="mt-6 rounded-lg border border-slate-200 divide-y divide-slate-200 text-sm">
                                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                                        <dt className="flex items-center gap-2 text-slate-500">
                                            <Calendar size={16} aria-hidden="true" />
                                            Date
                                        </dt>
                                        <dd className="font-medium text-slate-900">
                                            {formatDate(booked.date)}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                                        <dt className="flex items-center gap-2 text-slate-500">
                                            <Clock size={16} aria-hidden="true" />
                                            Time
                                        </dt>
                                        <dd className="font-medium text-slate-900">
                                            {booked.time}
                                        </dd>
                                    </div>
                                </dl>

                                {notice?.type === "error" && (
                                    <div
                                        role="alert"
                                        className="mt-5 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-3.5 py-3 rounded-lg text-sm"
                                    >
                                        <AlertCircle
                                            size={17}
                                            className="mt-0.5 shrink-0"
                                            aria-hidden="true"
                                        />
                                        {notice.text}
                                    </div>
                                )}

                                <div className="mt-8 pt-6 border-t border-slate-200">
                                    {confirmingCancel ? (
                                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                            <p className="text-sm font-medium text-red-800">
                                                Cancel this appointment?
                                            </p>
                                            <p className="mt-1 text-sm text-red-700">
                                                This frees the slot and can't be undone.
                                            </p>
                                            <div className="mt-4 flex flex-col sm:flex-row gap-3">
                                                <button
                                                    onClick={handleCancelAppointment}
                                                    disabled={cancelLoading}
                                                    className="h-10 px-5 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-red-200"
                                                >
                                                    {cancelLoading && (
                                                        <Loader2
                                                            size={16}
                                                            className="animate-spin motion-reduce:animate-none"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                    {cancelLoading
                                                        ? "Cancelling…"
                                                        : "Yes, cancel appointment"}
                                                </button>
                                                <button
                                                    onClick={() => setConfirmingCancel(false)}
                                                    disabled={cancelLoading}
                                                    className="h-10 px-5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-slate-200"
                                                >
                                                    Keep appointment
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setConfirmingCancel(true)}
                                            className="h-11 px-5 inline-flex items-center justify-center gap-2 bg-white hover:bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-red-100"
                                        >
                                            <XCircle size={17} aria-hidden="true" />
                                            Cancel appointment
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* ---- booking form ---- */
                            <>
                                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                                    Book an appointment
                                </h1>
                                <p className="mt-2 text-sm text-slate-600">
                                    Pick a date and time that works for you.
                                </p>

                                {notice && (
                                    <div
                                        role={notice.type === "error" ? "alert" : "status"}
                                        className={`mt-6 flex items-start gap-2 px-3.5 py-3 rounded-lg text-sm border ${
                                            notice.type === "error"
                                                ? "bg-red-50 border-red-200 text-red-700"
                                                : "bg-emerald-50 border-emerald-200 text-emerald-800"
                                        }`}
                                    >
                                        {notice.type === "error" ? (
                                            <AlertCircle
                                                size={17}
                                                className="mt-0.5 shrink-0"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <CheckCircle2
                                                size={17}
                                                className="mt-0.5 shrink-0"
                                                aria-hidden="true"
                                            />
                                        )}
                                        {notice.text}
                                    </div>
                                )}

                                <div className="mt-8 space-y-6">

                                    {/* Date */}
                                    <div>
                                        <label
                                            htmlFor="date"
                                            className="flex items-center gap-2 mb-1.5 text-sm font-medium text-slate-800"
                                        >
                                            <Calendar size={16} aria-hidden="true" />
                                            Date
                                        </label>

                                        <input
                                            id="date"
                                            type="date"
                                            min={today}
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full h-11 px-3.5 text-sm text-slate-900 bg-white rounded-lg border border-slate-300 hover:border-slate-400 transition focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                                        />
                                    </div>

                                    {/* Time slots */}
                                    <fieldset>
                                        <legend className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-800">
                                            <Clock size={16} aria-hidden="true" />
                                            Time
                                        </legend>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {TIME_SLOTS.map((slot) => (
                                                <label key={slot} className="cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="time"
                                                        value={slot}
                                                        checked={time === slot}
                                                        onChange={(e) => setTime(e.target.value)}
                                                        className="sr-only peer"
                                                    />
                                                    <span className="block h-11 leading-[2.75rem] text-center text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-800 hover:border-slate-400 transition peer-checked:bg-teal-700 peer-checked:border-teal-700 peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-teal-200">
                                                        {slot}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </fieldset>

                                    {/* Reason */}
                                    <div>
                                        <label
                                            htmlFor="reason"
                                            className="block mb-1.5 text-sm font-medium text-slate-800"
                                        >
                                            Reason for visit
                                        </label>

                                        <input
                                            id="reason"
                                            type="text"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            maxLength={150}
                                            placeholder="e.g. Regular health checkup"
                                            className="w-full h-11 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white rounded-lg border border-slate-300 hover:border-slate-400 transition focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                                        />
                                    </div>

                                    {/* Summary */}
                                    {date && time && (
                                        <p
                                            className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3"
                                            aria-live="polite"
                                        >
                                            You're booking{" "}
                                            <span className="font-medium text-slate-900">
                                                {doctorName}
                                            </span>{" "}
                                            on{" "}
                                            <span className="font-medium text-slate-900">
                                                {formatDate(date)}
                                            </span>{" "}
                                            at{" "}
                                            <span className="font-medium text-slate-900">
                                                {time}
                                            </span>
                                            .
                                        </p>
                                    )}

                                    <button
                                        onClick={handleBooking}
                                        disabled={loading}
                                        className="w-full h-11 flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-teal-200"
                                    >
                                        {loading && (
                                            <Loader2
                                                size={17}
                                                className="animate-spin motion-reduce:animate-none"
                                                aria-hidden="true"
                                            />
                                        )}
                                        {loading ? "Booking…" : "Confirm booking"}
                                    </button>
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Booking;