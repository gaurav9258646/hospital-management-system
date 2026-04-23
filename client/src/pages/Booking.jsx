import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  Stethoscope,
  IndianRupee
} from "lucide-react";

const Booking = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    try {
      const url = import.meta.env.VITE_SERVER_URL;
      const res = await fetch(`${url}/doctor/${id}`);
      const data = await res.json();

      if (data.success) {
        setDoctor(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBooking = async () => {
    if (!date || !time) {
      return alert("Select date & time");
    }

    try {
      const url = import.meta.env.VITE_SERVER_URL;

      const res = await fetch(`${url}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          doctorId: id,
          date,
          time
        })
      });

      const data = await res.json();

      if (!data.success) {
        return alert("Booking failed");
      }

      alert("Appointment Booked ");

    } catch (error) {
      console.log(error);
    }
  };

  if (!doctor) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">

      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">

        <div className="text-center mb-5">

          <img
            src={doctor.profileImage || "https://via.placeholder.com/120"}
            className="w-24 h-24 rounded-full mx-auto object-cover"
          />

          <h2 className="text-xl font-bold mt-2 flex justify-center items-center gap-2">
            <Stethoscope size={18}/> {doctor.userId?.name}
          </h2>

          <p className="text-gray-500">{doctor.specialization}</p>

          <p className="flex justify-center items-center gap-1 text-sm mt-1">
            <IndianRupee size={14}/> {doctor.fees}
          </p>

        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2 mb-1">
            <Calendar size={16}/> Select Date
          </label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2 mb-1">
            <Clock size={16}/> Select Time
          </label>
          <select
            className="w-full border p-2 rounded"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            <option value="">Select Time</option>
            <option>10:00 AM</option>
            <option>12:00 PM</option>
            <option>3:00 PM</option>
            <option>6:00 PM</option>
          </select>
        </div>

        {/* 🔥 Button */}
        <button
          onClick={handleBooking}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
        >
          <Clock size={18}/> Confirm Booking
        </button>

      </div>

    </div>
  );
};

export default Booking;