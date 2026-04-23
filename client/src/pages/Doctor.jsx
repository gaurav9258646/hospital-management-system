import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, Phone, IndianRupee, Calendar, Award } from "lucide-react";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const url = import.meta.env.VITE_SERVER_URL;
      const res = await fetch(`${url}/doctor`);
      const data = await res.json();
      setDoctors(data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Stethoscope /> Doctors
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">

        {doctors.map((doc) => (
          <div
            key={doc._id}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition text-center"
          >

            <div className="flex justify-center mb-3">
              <img
                src={doc.profileImage || "https://via.placeholder.com/120"}
                alt="doctor"
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
              />
            </div>

            <h2 className="font-bold text-blue-600 text-lg flex justify-center items-center gap-1">
              <Stethoscope size={16}/> {doc.userId?.name}
            </h2>

            <p className="text-gray-500 text-sm">
              {doc.specialization}
            </p>

            <p className="mt-2 flex justify-center items-center gap-1 text-sm">
              <Award size={14}/> {doc.experience} yrs
            </p>

            <p className="flex justify-center items-center gap-1 text-sm">
              <IndianRupee size={14}/> {doc.fees}
            </p>

            <p className="flex justify-center items-center gap-1 text-sm">
              <Phone size={14}/> {doc.userId?.phone}
            </p>

            <button
              onClick={() => navigate(`/book/${doc._id}`)}
              className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <Calendar size={16}/> Book Appointment
            </button>

          </div>
        ))}

      </div>
    </div>
  );
};

export default Doctors;