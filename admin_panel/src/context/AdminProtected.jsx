import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminProtected = ({ children }) => {
  const { user, token } = useAuth();

      if (token === null) return null;

  if (!token || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtected;