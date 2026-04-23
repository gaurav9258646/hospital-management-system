import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Phone,
  IndianRupee,
  Calendar,
  Award,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import img1 from "../assets/nursingblog.webp";
import img2 from "../assets/n4.jpg";
import img3 from "../assets/n5.jpg";


const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const images = [img1, img2, img3];

  useEffect(() => {
    fetchDoctors();

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchDoctors = async () => {
    const url = import.meta.env.VITE_SERVER_URL;
    const res = await fetch(`${url}/doctor`);
    const data = await res.json();
    setDoctors(data.data?.slice(0, 6) || []);
    console.log(res)
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      <div className="relative h-[300px] md:h-[420px] overflow-hidden">

        <img
          src={images[current]}
          className="w-full h-full object-cover transition duration-700"
        />

        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-2">
            <Stethoscope /> Book Appointment
          </h1>

          <p className="mt-2">Fast & Easy Healthcare</p>

          <button
            onClick={() => navigate("/doctors")}
            className="mt-4 bg-blue-500 px-5 py-2 rounded-full"
          >
            View Doctors
          </button>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
        >
          <ChevronRight />
        </button>

      </div>

      <div className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar size={20}/> Available Doctors
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {doctors.map((doc) => (
            <div key={doc._id} className="bg-white p-5 rounded-2xl shadow">

              <div className="flex justify-center mb-4">
                <img
                  src={doc.profileImage || "https://via.placeholder.com/150"}
                  className="w-28 h-28 rounded-full object-cover"
                />
              </div>

              <h3 className="text-center font-semibold text-blue-600">
                {doc.userId?.name}
              </h3>
              <p className="mt-2 flex items-center justify-center gap-1 text-sm">
  <Award size={14}/> {doc.experience} yrs experience
</p>

              <p className="text-center text-sm text-gray-500">
                {doc.specialization}
              </p>

              <p className="text-center text-sm">
                ₹ {doc.fees}
              </p>

              <button
                onClick={() => navigate(`/book/${doc._id}`)}
                className="mt-3 w-full bg-green-500 text-white py-2 rounded"
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