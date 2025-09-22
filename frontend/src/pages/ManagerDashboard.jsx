import React, { useEffect, useState } from "react";
import Sidebar from "../components/Manager/Sidebar.jsx";
import TopBar from "../components/Manager/TopBar.jsx";

// Plug in your real components here
import ManagerOverview from "../components/Manager/ManagerOverview.jsx";            // or your overview component
import ComplaintsList from "../components/Manager/ComplaintsList.jsx";          // you already have this
import FeedbackList from "../components/Manager/FeedbackList.jsx";              // optional
//import ManagerSettings from "./ManagerSettings.jsx";        // optional

export default function ManagerDashboard() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // keep current section in state (persisted)
  const [section, setSection] = useState(
    () => localStorage.getItem("mgr:section") || "overview"
  );
  useEffect(() => localStorage.setItem("mgr:section", section), [section]);

  // section -> component
  const SectionView = {
    overview: <ManagerOverview />,
    feedback: <FeedbackList />,
    complaints: <ComplaintsList />,
   // settings: <ManagerSettings />,
  }[section] || <ManagerOverview />;

  return (
    <div className="min-h-screen bg-gray-50 text-zinc-900 flex">
      {/* Sidebar */}
      <Sidebar
        open={open}
        mobileOpen={mobileOpen}
        onToggle={() => setOpen(o => !o)}
        onMobileClose={() => setMobileOpen(false)}
        onSectionChange={setSection}
        activeSection={section}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {SectionView}
          </div>
        </main>
      </div>
    </div>
  );
}
