import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-full flex flex-col">
        
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="p-4 bg-gray-100 flex-1">
          {children}
        </div>

      </div>
    </div>
  );
};

export default AdminLayout;