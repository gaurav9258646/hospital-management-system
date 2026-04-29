import React, { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Lock,
  BadgeCheck,
} from "lucide-react";

import image from "../../assets/profile.jpg";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    role: "admin",
    createdAt: "",
  });

  const url = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${url}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setAdmin({
          name: data.data?.name || "",
          email: data.data?.email || "",
          phone: data.data?.phone || "",
          role: data.data?.role || "admin",
          createdAt: data.data?.createdAt || "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Admin Profile
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your hospital admin account information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col items-center text-center">
              
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-md">
                <img
                  src={image}
                  alt="Admin Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-2xl font-bold mt-5 text-slate-800">
                {admin.name || "Admin"}
              </h2>

              <span className="mt-3 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                {admin.role}
              </span>
            </div>

            {/* Contact Info */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <span>{admin.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <span>{admin.phone}</span>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span>
                  Joined{" "}
                  {admin.createdAt
                    ? new Date(admin.createdAt).toLocaleDateString()
                    : "--"}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <BadgeCheck className="w-5 h-5" />
                <h2 className="text-xl font-semibold">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  value={admin.name}
                  readOnly
                  className="border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50"
                />

                <input
                  type="email"
                  value={admin.email}
                  readOnly
                  className="border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50"
                />

                <input
                  type="text"
                  value={admin.phone}
                  readOnly
                  className="border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50"
                />

                <input
                  type="text"
                  value={admin.role}
                  readOnly
                  className="border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50 capitalize"
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="w-5 h-5" />
                <h2 className="text-xl font-semibold">
                  Security Settings
                </h2>
              </div>

              <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-2xl font-medium">
                <Lock size={18} />
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;