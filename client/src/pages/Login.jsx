import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async () => {
    try {
      const url = import.meta.env.VITE_SERVER_URL;

      const res = await fetch(`${url}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!data.success) {
        return alert("Login failed");
      }

      localStorage.setItem("token", data.data.accessToken);

      alert("Login Success ");

      navigate("/");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <div className="bg-white p-6 rounded shadow w-[300px]">

        <h2 className="text-xl font-bold mb-4 text-center">
          Login
        </h2>

        <input
          placeholder="Email"
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handleLogin}
          className="bg-green-500 text-white w-full py-2 rounded"
        >
          Login
        </button>

      </div>
    </div>
  );
};

export default Login;