// src/layouts/ManagerLayout.jsx
import React, { useState } from "react";
import Sidebar from "../components/Manager/Sidebar";
import TopBar from "../components/Manager/TopBar";
import { Outlet } from "react-router-dom";

export default function ManagerLayout() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-zinc-900 flex">
      <Sidebar
        open={open}
        mobileOpen={mobileOpen}
        onToggle={() => setOpen(o => !o)}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
