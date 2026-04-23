import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Doctors from "./pages/Doctor";  

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Booking from "./pages/Booking";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/doctors" element={<Doctors />} />

        <Route path="/book/:id" element={<Booking />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;