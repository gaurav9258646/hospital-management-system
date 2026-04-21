import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctor";
import Navbar from "./components/Navbar"
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
      <>
      <Navbar />
    
    <Routes>

      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Doctors */}
      <Route path="/doctors" element={<Doctors />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

    </Routes>
     </>
  );
}

export default App;