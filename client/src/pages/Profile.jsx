import React, { useEffect, useState } from "react";
import { User, Mail, Phone, Save } from "lucide-react";

const Profile = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const url = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${url}/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setForm({
          name: data.data.name || "",
          email: data.data.email || "",
          phone: data.data.phone || "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${url}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        return alert(data.message || "Update Failed");
      }

      alert("Profile Updated Successfully");
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-blue-600 text-white text-center py-8">
          <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center">
            <User className="text-blue-600 w-12 h-12" />
          </div>

          <h1 className="text-3xl font-bold mt-4">
            My Profile
          </h1>

          <p className="text-blue-100">
            Manage your account information
          </p>
        </div>

        {/* Form */}
        <div className="p-6 md:p-8 space-y-5">

          {/* Name */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-medium">
              <User size={18} />
              Full Name
            </label>

            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-medium">
              <Mail size={18} />
              Email Address
            </label>

            <input
              type="email"
              value={form.email}
              disabled
              className="w-full border rounded-xl px-4 py-3 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-medium">
              <Phone size={18} />
              Phone Number
            </label>

            <input
              type="text"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleUpdate}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-medium flex items-center justify-center gap-2 transition"
          >
            <Save size={18} />
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;