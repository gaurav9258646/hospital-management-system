import React from "react";
import { Link } from "react-router-dom";

import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedinIn,
    FaYoutube
} from "react-icons/fa";

import logo from "../assets/logo.png";

const QUICK_LINKS = [
    { to: "/", label: "Home" },
    { to: "/doctors", label: "Doctors" },
    { to: "/gallery", label: "Gallery" },
    { to: "/login", label: "Log in" },
    { to: "/signup", label: "Sign up" }
];

// TODO: replace each href with your hospital's real profile link.
const SOCIAL_LINKS = [
    { label: "Facebook", icon: FaFacebookF, href: "https://www.facebook.com/" },
    { label: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/" },
    { label: "Twitter", icon: FaTwitter, href: "https://twitter.com/" },
    { label: "LinkedIn", icon: FaLinkedinIn, href: "https://www.linkedin.com/" },
    { label: "YouTube", icon: FaYoutube, href: "https://www.youtube.com/" }
];

const linkClass =
    "text-teal-100 hover:text-white hover:underline transition rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300";

const Footer = () => {
    return (
        <footer className="bg-teal-900 text-teal-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div>
                        {/* White background keeps the logo visible whatever its colours are */}
                        <Link
                            to="/"
                            aria-label="MediCare home"
                            className="inline-flex bg-white rounded-lg px-3 py-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
                        >
                            <img
                                src={logo}
                                alt="MediCare"
                                className="h-9 w-auto object-contain"
                            />
                        </Link>

                        <p className="mt-4 text-sm leading-6 text-teal-200 max-w-xs">
                            Book appointments with trusted doctors, quickly and
                            securely.
                        </p>
                    </div>

                    {/* Quick links */}
                    <nav aria-label="Footer">
                        <h3 className="text-base font-semibold text-white">
                            Quick links
                        </h3>

                        <ul className="mt-4 space-y-3 text-sm">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className={linkClass}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Contact */}
                    <div>
                        <h3 className="text-base font-semibold text-white">
                            Contact us
                        </h3>

                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <a
                                    href="tel:+919876543210"
                                    className={`flex items-center gap-2.5 ${linkClass}`}
                                >
                                    <Phone
                                        size={17}
                                        className="shrink-0 text-teal-300"
                                        aria-hidden="true"
                                    />
                                    +91 9876543210
                                </a>
                            </li>

                            <li>
                                <a
                                    href="mailto:gaurav.pcm@gmail.com"
                                    className={`flex items-center gap-2.5 break-all ${linkClass}`}
                                >
                                    <Mail
                                        size={17}
                                        className="shrink-0 text-teal-300"
                                        aria-hidden="true"
                                    />
                                    gaurav.pcm@gmail.com
                                </a>
                            </li>

                            <li>
                                <a
                                    href="https://wa.me/919876543210"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2.5 ${linkClass}`}
                                >
                                    <MessageCircle
                                        size={17}
                                        className="shrink-0 text-teal-300"
                                        aria-hidden="true"
                                    />
                                    Chat on WhatsApp
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Visit + social */}
                    <div>
                        <h3 className="text-base font-semibold text-white">
                            Visit us
                        </h3>

                        <address className="mt-4 flex items-start gap-2.5 text-sm not-italic leading-6 text-teal-100">
                            <MapPin
                                size={17}
                                className="mt-1 shrink-0 text-teal-300"
                                aria-hidden="true"
                            />
                            <span>
                                Near City Hospital, Main Road,
                                <br />
                                Ghaziabad, Uttar Pradesh, India
                            </span>
                        </address>

                        <ul className="mt-6 flex items-center gap-3">
                            {SOCIAL_LINKS.map(({ label, icon: Icon, href }) => (
                                <li key={label}>
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-800 text-teal-100 hover:bg-teal-700 hover:text-white transition focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
                                    >
                                        <Icon size={16} aria-hidden="true" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-teal-800">
                <p className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center sm:text-left text-sm text-teal-300">
                    © 2026 MediCare. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;