import React, { useEffect, useMemo, useRef, useState } from "react";

import {
    X,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    ImageOff,
    Images,
    RefreshCw
} from "lucide-react";

/* ---------- image with a fallback if the file fails to load ---------- */

const GalleryImage = ({ src, alt, className }) => {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return (
            <div
                role="img"
                aria-label={alt ? `${alt} (image unavailable)` : "Image unavailable"}
                className={`flex items-center justify-center bg-slate-200 text-slate-400 ${className}`}
            >
                <ImageOff size={32} aria-hidden="true" />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt || ""}
            loading="lazy"
            onError={() => setFailed(true)}
            className={`object-cover ${className}`}
        />
    );
};

const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse motion-reduce:animate-none">
        <div className="h-60 bg-slate-200" />
        <div className="p-4 space-y-2">
            <div className="h-4 w-2/3 rounded bg-slate-200" />
            <div className="h-3 w-1/3 rounded bg-slate-200" />
        </div>
    </div>
);

/* ---------- page ---------- */

const Gallery = () => {
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [category, setCategory] = useState("all");
    const [active, setActive] = useState(null); // index inside `filtered`

    const closeRef = useRef(null);
    const url = import.meta.env.VITE_SERVER_URL;

    const fetchGallery = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch(`${url}/gallery`);
            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || "Request failed");
            }

            setGallery(data.data || []);
        } catch (err) {
            console.log(err);
            setError("We couldn't load the gallery. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const categories = useMemo(
        () => [...new Set(gallery.map((item) => item.category).filter(Boolean))].sort(),
        [gallery]
    );

    const filtered = useMemo(
        () =>
            category === "all"
                ? gallery
                : gallery.filter((item) => item.category === category),
        [gallery, category]
    );

    const isOpen = active !== null;
    const count = filtered.length;
    const activeItem = isOpen ? filtered[active] : null;

    // Lightbox: keyboard controls, scroll lock and focus handling
    useEffect(() => {
        if (!isOpen) return;

        const previousFocus = document.activeElement;
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";
        closeRef.current?.focus();

        const onKeyDown = (e) => {
            if (e.key === "Escape") setActive(null);
            if (e.key === "ArrowRight") setActive((prev) => (prev + 1) % count);
            if (e.key === "ArrowLeft") setActive((prev) => (prev - 1 + count) % count);
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
            previousFocus?.focus?.();
        };
    }, [isOpen, count]);

    const showNext = () => setActive((prev) => (prev + 1) % count);
    const showPrev = () => setActive((prev) => (prev - 1 + count) % count);

    return (
        <div className="min-h-screen bg-slate-100 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <header className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-teal-800 text-white">
                        <Images size={24} aria-hidden="true" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                            Hospital gallery
                        </h1>
                        <p className="mt-1 text-sm text-slate-600">
                            Photos from around the hospital.
                        </p>
                    </div>
                </header>

                {/* Category filter */}
                {!loading && !error && categories.length > 1 && (
                    <div
                        role="group"
                        aria-label="Filter by category"
                        className="mt-6 flex flex-wrap gap-2"
                    >
                        {["all", ...categories].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                aria-pressed={category === cat}
                                className={`h-9 px-4 rounded-full text-sm font-medium border transition focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200 ${
                                    category === cat
                                        ? "bg-teal-700 border-teal-700 text-white"
                                        : "bg-white border-slate-300 text-slate-700 hover:border-slate-400"
                                }`}
                            >
                                {cat === "all" ? "All" : cat}
                            </button>
                        ))}
                    </div>
                )}

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
                                Couldn't load the gallery
                            </h2>
                            <p className="mt-1 text-sm text-slate-600">{error}</p>
                            <button
                                onClick={fetchGallery}
                                className="mt-6 inline-flex h-11 items-center justify-center gap-2 px-6 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-teal-200"
                            >
                                <RefreshCw size={16} aria-hidden="true" />
                                Try again
                            </button>
                        </div>
                    )}

                    {!loading && !error && gallery.length === 0 && (
                        <div className="max-w-md mx-auto bg-white rounded-xl border border-slate-200 p-8 text-center">
                            <Images
                                size={36}
                                className="mx-auto text-slate-400"
                                aria-hidden="true"
                            />
                            <h2 className="mt-4 text-lg font-semibold text-slate-900">
                                No photos yet
                            </h2>
                            <p className="mt-1 text-sm text-slate-600">
                                Check back soon. New photos appear here once they're added.
                            </p>
                        </div>
                    )}

                    {!loading && !error && gallery.length > 0 && (
                        <>
                            <p className="mb-4 text-sm text-slate-600" aria-live="polite">
                                Showing {count} of {gallery.length}{" "}
                                {gallery.length === 1 ? "photo" : "photos"}
                            </p>

                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filtered.map((item, index) => (
                                    <li key={item._id}>
                                        <button
                                            onClick={() => setActive(index)}
                                            aria-label={`View larger: ${item.title || "photo"}`}
                                            className="group block w-full text-left bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-teal-600 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
                                        >
                                            <GalleryImage
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-60"
                                            />

                                            <div className="p-4">
                                                <h2 className="text-base font-semibold text-slate-900">
                                                    {item.title}
                                                </h2>
                                                {item.category && (
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {item.category}
                                                    </p>
                                                )}
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </main>
            </div>

            {/* LIGHTBOX */}
            {activeItem && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={activeItem.title || "Photo"}
                    onClick={() => setActive(null)}
                    className="fixed inset-0 z-[60] bg-slate-900/90 flex items-center justify-center p-4 sm:p-8"
                >
                    <button
                        ref={closeRef}
                        onClick={() => setActive(null)}
                        aria-label="Close photo"
                        className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-slate-800 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                    >
                        <X size={20} aria-hidden="true" />
                    </button>

                    {count > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    showPrev();
                                }}
                                aria-label="Previous photo"
                                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-slate-800 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                            >
                                <ChevronLeft size={20} aria-hidden="true" />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    showNext();
                                }}
                                aria-label="Next photo"
                                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-slate-800 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                            >
                                <ChevronRight size={20} aria-hidden="true" />
                            </button>
                        </>
                    )}

                    <figure
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-4xl w-full text-center"
                    >
                        <GalleryImage
                            src={activeItem.image}
                            alt={activeItem.title}
                            className="mx-auto max-h-[75vh] w-auto max-w-full rounded-lg !object-contain"
                        />

                        <figcaption className="mt-4 text-white">
                            <p className="text-base font-semibold">
                                {activeItem.title}
                            </p>
                            <p className="mt-1 text-sm text-slate-300">
                                {activeItem.category ? `${activeItem.category} · ` : ""}
                                {active + 1} of {count}
                            </p>
                        </figcaption>
                    </figure>
                </div>
            )}
        </div>
    );
};

export default Gallery;