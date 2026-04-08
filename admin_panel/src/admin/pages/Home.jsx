import { useEffect, useState } from "react";

const Home = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
  });

  useEffect(() => {
    setStats({
      doctors: 12,
      patients: 45,
      appointments: 30,
    });
  }, []);

  return (
    <div className="p-6">

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Doctors */}
        <div className="bg-blue-500 text-white p-5 rounded-xl shadow">
          <h2 className="text-lg">Total Doctors</h2>
          <p className="text-3xl font-bold mt-2">
            {stats.doctors}
          </p>
        </div>

        {/* Patients */}
        <div className="bg-green-500 text-white p-5 rounded-xl shadow">
          <h2 className="text-lg">Total Patients</h2>
          <p className="text-3xl font-bold mt-2">
            {stats.patients}
          </p>
        </div>

        {/* Appointments */}
        <div className="bg-purple-500 text-white p-5 rounded-xl shadow">
          <h2 className="text-lg">Appointments</h2>
          <p className="text-3xl font-bold mt-2">
            {stats.appointments}
          </p>
        </div>

      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Recent Activity
        </h2>

        <ul className="text-sm text-gray-600 space-y-2">
          <li>✔ New doctor added</li>
          <li>✔ Appointment booked</li>
          <li>✔ Patient registered</li>
        </ul>
      </div>

    </div>
  );
};

export default Home;