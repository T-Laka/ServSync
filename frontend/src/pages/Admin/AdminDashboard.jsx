import { useState } from "react";
import AdminDashNavBar from "../../components/Admin/AdminDashNavBar";

function AdminDashboard() {
  const [section, setSection] = useState("analytics");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <AdminDashNavBar activeSection={section} onSectionChange={setSection} />

      {/* Main Content Area */}
      <main
        className={`flex-1 bg-gray-100 p-6 mt-0 space-y-10 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Conditional rendering based on active section */}
        {section === "analytics" && (
          <section>
            {/* <AdminAnalytics /> */}
          </section>
        )}
        {section === "users" && (
          <section>
            {/* <UserList /> */}
          </section>
        )}
        {section === "staff" && (
          <section>
            {/* <StaffList /> */}
          </section>
        )}
        {section === "session" && (
          <section>
            {/* <SessionManagement /> */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Session Management</h2>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
