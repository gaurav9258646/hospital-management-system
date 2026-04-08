import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="w-full h-14 bg-white shadow flex items-center justify-between px-6">
      
      <h1 className="text-xl font-bold text-gray-700">
        Admin Panel
      </h1>

      <div className="flex items-center gap-4">

        <div className="relative cursor-pointer">
          🔔
          <span className="absolute -top-1 -right-2 text-xs bg-red-500 text-white px-1 rounded-full">
            3
          </span>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {user?.name?.charAt(0) || "A"}
          </div>

          <span className="text-sm font-medium text-gray-700">
            {user?.name || "Admin"}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Navbar;