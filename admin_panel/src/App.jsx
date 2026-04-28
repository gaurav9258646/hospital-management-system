import { Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./admin/pages/Home";
import Doctors from "./admin/pages/Doctors";
import Login from "./admin/pages/Login";
import AdminProtected from "./context/AdminProtected";
import AdminLayout from "./admin/AdminLayout";
import { Toaster } from "react-hot-toast";
import Appointments from "./admin/pages/Appointments";

const App = () => {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Protected Layout */}
        <Route
          path="/"
          element={
            <AdminProtected>
              <AdminLayout />
            </AdminProtected>
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="appointments" element={<Appointments />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;