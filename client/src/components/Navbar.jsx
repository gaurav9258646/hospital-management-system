import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  Users,
  LogIn,
  LogOut,
  Menu,
  X
} from "lucide-react";

import logo from "../assets/logo.png"; // ✅ logo import

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-white shadow-md px-4 md:px-6 py-2 flex justify-between items-center">

      <div className="flex items-center gap-2">
        <img
          src={logo}
          alt="logo"
          className="h-10 md:h-12 object-contain"
        />
      </div>

      <div className="hidden md:flex items-center gap-6 text-gray-700">

        <Link to="/" className="flex items-center gap-1 hover:text-blue-600">
          <Home size={18}/> Home
        </Link>

        <Link to="/doctors" className="flex items-center gap-1 hover:text-blue-600">
          <Users size={18}/> Doctors
        </Link>

        {!token ? (
          <Link to="/login" className="flex items-center gap-1 hover:text-blue-600">
            <LogIn size={18}/> Login
          </Link>
        ) : (
          <button onClick={handleLogout} className="flex items-center gap-1 text-red-500">
            <LogOut size={18}/> Logout
          </button>
        )}

      </div>

      <button className="md:hidden" onClick={() => setOpen(!open)}>
        {open ? <X /> : <Menu />}
      </button>

      {open && (
        <div className="absolute top-[60px] left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 md:hidden z-50">

          <Link to="/" onClick={()=>setOpen(false)}>Home</Link>
          <Link to="/doctors" onClick={()=>setOpen(false)}>Doctors</Link>

          {!token ? (
            <Link to="/login" onClick={()=>setOpen(false)}>Login</Link>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}

        </div>
      )}
    </div>
  );
};

export default Navbar;