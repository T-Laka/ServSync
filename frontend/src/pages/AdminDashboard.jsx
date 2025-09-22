import React, { useState, useEffect } from "react";
import Sidebar from "../components/Admin/Sidebar";
import TopBar from "../components/Admin/TopBar";

// Import your section components
import AdminAnalytics from "../components/Admin/AdminAnalytics";
import UserList from "../components/UserManagement/UserList";
import SessionList from "../components/SessionManagement/sessionList";
//import ComplaintsList from "../components/Admin/ComplaintsList";

export default function AdminDashboard() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // keep current section in state
  const [section, setSection] = useState(() => localStorage.getItem("section") || "analytics");
  useEffect(() => localStorage.setItem("section", section), [section]);

  // map section -> component
  const SectionView = {
    analytics: <AdminAnalytics />,
    users: <UserList />,
    sessions: <SessionList />,
    // complaints: <ComplaintsList />,
  }[section];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        open={open}
        mobileOpen={mobileOpen}
        onToggle={() => setOpen(o => !o)}
        onMobileClose={() => setMobileOpen(false)}
        onSectionChange={setSection}
        activeSection={section}
      />

      <div className="flex-1 flex flex-col">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-6 bg-gray-50">
          {SectionView}
        </main>
      </div>
    </div>
  );
}
