import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";;

const Home = () => {
  const [counts, setCounts] = useState({
    appointments: 0,
    doctors: 0,
    users: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const url = import.meta.env.VITE_SERVER_URL;
        const token = localStorage.getItem("token");

        const [appRes, docRes, userRes] = await Promise.all([
          fetch(`${url}/appointments`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${url}/doctor`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${url}/auth/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const appData = appRes.ok ? await appRes.json() : { data: [] };
        const docData = docRes.ok ? await docRes.json() : { data: [] };
        const userData = userRes.ok ? await userRes.json() : { data: [] };

        const appointments = appData.data || [];
        const doctors = docData.data || [];
        const users = userData.data || [];

        setCounts({
          appointments: appointments.length,
          doctors: doctors.length,
          users: users.length,
        });

        setChartData([
          { name: "Appointments", total: appointments.length },
          { name: "Doctors", total: doctors.length },
          { name: "Users", total: users.length },
        ]);

      } catch (error) {
        console.log("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        
        <div className="bg-white p-5 rounded shadow hover:shadow-lg transition">
          <h2 className="text-gray-500 text-sm">Appointments</h2>
          <p className="text-2xl font-bold text-blue-600">
            {counts.appointments}
          </p>
        </div>

        <div className="bg-white p-5 rounded shadow hover:shadow-lg transition">
          <h2 className="text-gray-500 text-sm">Doctors</h2>
          <p className="text-2xl font-bold text-green-600">
            {counts.doctors}
          </p>
        </div>

        <div className="bg-white p-5 rounded shadow hover:shadow-lg transition">
          <h2 className="text-gray-500 text-sm">Users</h2>
          <p className="text-2xl font-bold text-purple-600">
            {counts.users}
          </p>
        </div>

      </div>

     <div className="bg-white p-4 rounded shadow h-[300px]">
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={chartData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />

      <Bar dataKey="total">
        {chartData.map((entry, index) => {
          const colors = [
            "#3b82f6", 
            "#10b981", 
            "#8b5cf6", 
          ];
          return <Cell key={index} fill={colors[index]} />;
        })}
      </Bar>

    </BarChart>
  </ResponsiveContainer>
</div>
    </div>
  );
};

export default Home;