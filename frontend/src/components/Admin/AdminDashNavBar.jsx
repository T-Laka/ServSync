import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashNavBar({ activeSection, onSectionChange }) {
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);  // New state to control sidebar visibility

  useEffect(() => {
    // For testing, you can set a dummy staff object
    setStaff({ userName: "TestUser", role: "Admin", nic: "123456789V" });
  }, []);

  const navItems = [
    { key: "analytics", label: "Analytics" },
    { key: "users", label: "User Management" },
    { key: "staff", label: "Staff Management" },
    { key: "session", label: "Session Management" },
  ];

  return (
    <>
      {/* Sidebar with Toggle Button */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-gray-800 text-white flex flex-col min-h-screen p-4 transition-all duration-300 ease-in-out fixed top-0 left-0 z-20 md:relative md:w-64 md:block`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2
            className={`text-2xl font-bold text-center tracking-wide ${
              !isSidebarOpen ? "hidden" : ""
            }`}
          >
            ServSync
          </h2>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-white md:hidden"
          >
            <i className="fas fa-bars text-xl"></i> {/* FontAwesome icon for mobile toggle */}
          </button>
        </div>

        {staff && (
          <div className="mb-8 flex flex-col items-center border-b border-gray-700 pb-6">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold mb-2 shadow-lg">
              {staff.userName ? staff.userName.charAt(0).toUpperCase() : "A"}
            </div>
            <div className={`text-center ${!isSidebarOpen ? "hidden" : ""}`}>
              <div className="font-semibold text-lg">{staff.userName}</div>
              <div className="text-blue-200 text-sm font-medium mb-1">{staff.role}</div>
              <div className="text-xs text-gray-300">{staff.nic}</div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-col gap-4 mt-4">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onSectionChange(item.key)}
              className={`w-full px-4 py-3 rounded-lg border transition font-semibold tracking-wide ${
                activeSection === item.key
                  ? "bg-blue-600 border-blue-400 text-white shadow-md"
                  : "bg-gray-700 border-gray-600 text-white hover:bg-blue-500 hover:border-blue-400"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          // onClick={handleLogout}
          className="w-full mt-8 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow border border-red-400 transition"
        >
          Logout
        </button>
      </aside>
    </>
  );
}

export default AdminDashNavBar;
