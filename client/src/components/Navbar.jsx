import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
    Home,
    Users,
    LogIn,
    LogOut,
    Menu,
    X,
    FileText,
    CalendarCheck,
    Image as ImageIcon
} from "lucide-react";

import logo from "../assets/logo.png";

const NAV_LINKS = [
    { to: "/", label: "Home", icon: Home, end: true },
    { to: "/doctors", label: "Doctors", icon: Users },
    { to: "/gallery", label: "Gallery", icon: ImageIcon }
];

const PATIENT_LINKS = [
    { to: "/my-appointments", label: "My appointments", icon: CalendarCheck },
    { to: "/my-prescriptions", label: "My prescriptions", icon: FileText }
];

/* One link component used by both the desktop bar and the mobile panel */
const NavItem = ({ to, label, icon: Icon, end, mobile }) => (
    <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
            `flex items-center gap-2 rounded-lg font-medium transition focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200 ${
                mobile ? "px-3 py-3 text-base" : "px-3 py-2 text-sm"
            } ${
                isActive
                    ? "bg-teal-50 text-teal-800"
                    : "text-slate-600 hover:bg-slate-100 hover:text-teal-700"
            }`
        }
    >
        <Icon size={mobile ? 19 : 17} aria-hidden="true" />
        {label}
    </NavLink>
);

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Read on every render. Because useLocation re-renders the navbar on each
    // page change, the links update right after login or logout.
    const token = localStorage.getItem("token");

    // Close the mobile menu whenever the page changes
    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    // Close the mobile menu with the Escape key
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setOpen(false);
        navigate("/login");
    };

    return (
        <>
            <header className="fixed top-0 left-0 w-full bg-white border-b border-slate-200 z-50">
                <nav
                    aria-label="Main"
                    className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between"
                >
                    {/* Logo + desktop links */}
                    <div className="flex items-center gap-8">
                        <Link
                            to="/"
                            aria-label="MediCare home"
                            className="flex items-center rounded-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
                        >
                            <img
                                src={logo}
                                alt="MediCare"
                                className="h-9 md:h-10 w-auto object-contain"
                            />
                        </Link>

                        <div className="hidden lg:flex items-center gap-1">
                            {NAV_LINKS.map((link) => (
                                <NavItem key={link.to} {...link} />
                            ))}

                            {token &&
                                PATIENT_LINKS.map((link) => (
                                    <NavItem key={link.to} {...link} />
                                ))}
                        </div>
                    </div>

                    {/* Desktop account actions */}
                    <div className="hidden lg:flex items-center gap-2">
                        {!token ? (
                            <>
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-teal-700 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
                                >
                                    <LogIn size={17} aria-hidden="true" />
                                    Log in
                                </Link>

                                <Link
                                    to="/signup"
                                    className="h-10 inline-flex items-center px-5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
                                >
                                    Sign up
                                </Link>
                            </>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-red-100"
                            >
                                <LogOut size={17} aria-hidden="true" />
                                Log out
                            </button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="lg:hidden p-2 -mr-2 rounded-lg text-slate-700 hover:bg-slate-100 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
                        onClick={() => setOpen((prev) => !prev)}
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                    >
                        {open ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>

                {/* Mobile menu */}
                {open && (
                    <div
                        id="mobile-menu"
                        className="lg:hidden bg-white border-t border-slate-200 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto"
                    >
                        <div className="px-4 sm:px-6 py-3 space-y-1">
                            {NAV_LINKS.map((link) => (
                                <NavItem key={link.to} {...link} mobile />
                            ))}

                            {token &&
                                PATIENT_LINKS.map((link) => (
                                    <NavItem key={link.to} {...link} mobile />
                                ))}
                        </div>

                        <div className="px-4 sm:px-6 py-4 border-t border-slate-200">
                            {!token ? (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        to="/login"
                                        className="h-11 flex items-center justify-center gap-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
                                    >
                                        <LogIn size={17} aria-hidden="true" />
                                        Log in
                                    </Link>

                                    <Link
                                        to="/signup"
                                        className="h-11 flex items-center justify-center rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            ) : (
                                <button
                                    onClick={handleLogout}
                                    className="w-full h-11 flex items-center justify-center gap-2 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-red-100"
                                >
                                    <LogOut size={17} aria-hidden="true" />
                                    Log out
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Spacer so page content starts below the fixed navbar */}
            <div className="h-16" aria-hidden="true" />
        </>
    );
};

export default Navbar;