import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, Phone, IndianRupee, Calendar } from "lucide-react";
import heroImg from "../assets/nursingblog.webp";

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const url = import.meta.env.VITE_SERVER_URL;
    const res = await fetch(`${url}/doctor`);
    const data = await res.json();
    setDoctors(data.data?.slice(0, 6) || []);
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      <div className="relative h-[300px] md:h-[400px]">

        <img
          src={heroImg}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center px-4">

          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold flex items-center gap-2">
            <Stethoscope /> Book Appointment
          </h1>

          <p className="mt-2 text-sm md:text-base">
            Fast & Easy Healthcare
          </p>

          <button
            onClick={() => navigate("/doctors")}
            className="mt-4 bg-blue-500 px-4 py-2 rounded"
          >
            View Doctors
          </button>

        </div>
      </div>

      <div className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar size={20}/> Available Doctors
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {doctors.map((doc) => (
            <div key={doc._id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">

              <h3 className="text-base md:text-lg font-bold text-blue-600 flex items-center gap-2">
                <Stethoscope size={16}/> {doc.userId?.name}
              </h3>

              <p className="text-gray-500 text-sm">
                {doc.specialization}
              </p>

              <p className="mt-2 flex items-center gap-1 text-sm">
                <IndianRupee size={14}/> {doc.fees}
              </p>

              <p className="flex items-center gap-1 text-sm">
                <Phone size={14}/> {doc.userId?.phone}
              </p>

              <button
                onClick={() => navigate(`/book/${doc._id}`)}
                className="mt-3 w-full bg-green-500 text-white py-2 rounded text-sm"
              >
                Book Appointment
              </button>

            </div>
          ))}

        </div>
      </div>

    </div>
  );
};

export default Home;