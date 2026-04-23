import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">

      <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        <div>
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="logo"
              className="h-10 w-auto object-contain"
            />
            <h2 className="text-xl font-bold text-white">
              MedCare
            </h2>
          </div>

          <p className="text-sm mt-2">
            Easy & fast doctor appointment booking system.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>

          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/doctors" className="hover:text-white">Doctors</Link>
            <Link to="/login" className="hover:text-white">Login</Link>
            <Link to="/signup" className="hover:text-white">Signup</Link>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>

          <p className="text-sm">📞 +91 9876543210</p>
          <p className="text-sm">📧 support@medcare.com</p>

          <div className="flex gap-4 mt-3 text-sm">
            <span className="hover:text-white cursor-pointer">Facebook</span>
            <span className="hover:text-white cursor-pointer">Instagram</span>
          </div>
        </div>

      </div>

      <div className="text-center text-gray-500 text-sm border-t border-gray-700 py-4">
        © 2026 MedCare. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;