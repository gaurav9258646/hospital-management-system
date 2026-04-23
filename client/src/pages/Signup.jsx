import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const handleSignup = async () => {
    try {
      if (!form.name || !form.email || !form.phone || !form.password) {
        return alert("All fields required");
      }

      if (!/^[0-9]{10}$/.test(form.phone)) {
        return alert("Enter valid 10 digit phone number");
      }

      const url = import.meta.env.VITE_SERVER_URL;

      const res = await fetch(`${url}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!data.success) {
        return alert(data.error);
      }

      alert("Signup Success ");
      navigate("/login");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <div className="bg-white p-6 rounded shadow w-[320px]">

        <h1 className="text-xl font-bold mb-4 text-center">Signup</h1>

        <input
          type="text"
          placeholder="Name"
          className="border p-2 w-full mb-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="border p-2 w-full mb-2"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleSignup}
          className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded"
        >
          Signup
        </button>

      </div>

    </div>
  );
};

export default Signup;