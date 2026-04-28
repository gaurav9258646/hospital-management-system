import React, { useEffect, useState } from "react";
import AppointmentDelete from "../dialog/AppointmentDelete";
import EditAppointment from "../dialog/EditAppointment";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const url = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${url}/appointments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setAppointments(data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-5">Appointments</h1>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">User</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((app) => (
              <tr key={app._id} className="border-t">
                <td className="p-3">{app.patientId?.name}</td>
                <td>{app.doctorId?.userId?.name || "N/A"}</td>
                <td>{new Date(app.date).toLocaleDateString()}</td>
                <td>{app.time}</td>
                <td className="text-green-600">
                  {app.status || "pending"}
                </td>

                <td>
                  <div className="flex justify-center gap-2">
                    <EditAppointment
                      id={app._id}
                      onUpdated={fetchAppointments}
                    />

                    <AppointmentDelete
                      id={app._id}
                      onDeleted={fetchAppointments}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;