import React, { useState } from "react";
import Sidebar from "../components/Admin/Sidebar";
import TopBar from "../components/Admin/TopBar";

export default function AdminDashboard() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        open={open}
        mobileOpen={mobileOpen}
        onToggle={() => setOpen((o) => !o)}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 md:ml-${
          open ? "64" : "20"
        }`}
      >
        <TopBar onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-6 bg-gray-50">
          <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome to Admin Dashboard
            </h2>
            <p className="mt-2 text-gray-600">
              Here you can manage appointments, queues, users, and more.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
