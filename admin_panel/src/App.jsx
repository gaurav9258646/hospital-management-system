import { Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./admin/pages/Home";
import Doctors from "./admin/pages/Doctors";
import AdminProtected from "./context/AdminProtected";
import Login from "./admin/pages/Login";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
    <Route path="/" element={<Login />} />
   <Route
    path="/doctors"
    element={
      <AdminProtected>
        <Doctors />
      </AdminProtected>
    }
  />
    </Routes>
  );
};

export default App;