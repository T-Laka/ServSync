import React, { useState } from "react";
import Sidebar from "../components/Manager/Sidebar";
import TopBar from "../components/Manager/TopBar";
import { Users, Shield, Building2, MessageSquareMore } from "lucide-react";

export default function AdminDashboard() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Mock stats – replace with API data when ready
  const stats = [
    { label: "Total Users", value: 823, icon: Users },
    { label: "Active Roles", value: 6, icon: Shield },
    { label: "Branches", value: 18, icon: Building2 },
    { label: "Open Complaints", value: 12, icon: MessageSquareMore },
  ];

  // Example recent items
  const recentComplaints = [
    { id: "C-1042", subject: "Delay in token call", branch: "Colombo HQ", status: "Open" },
    { id: "C-1041", subject: "Wrong appointment time", branch: "Kandy", status: "Investigating" },
    { id: "C-1039", subject: "Counter closed early", branch: "Galle", status: "Resolved" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-zinc-900 flex">
      {/* Sidebar */}
      <Sidebar
        open={open}
        mobileOpen={mobileOpen}
        onToggle={() => setOpen((o) => !o)}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <TopBar onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 py-6">
          {/* Constrained container for balance */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Header */}
            <header>
              <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Manage system-wide settings, users & roles, branches, and communications.
              </p>
            </header>

            {/* Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                  <div className="flex items-center gap-4 h-full">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-blue-700" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">{label}</p>
                      <p className="text-xl font-semibold text-gray-800 leading-tight">{value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Two-column row */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Quick tips / info card */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 xl:col-span-2">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h2>
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                  <li className="p-3 rounded-lg border border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40 transition">
                    Add New User & Assign Role
                  </li>
                  <li className="p-3 rounded-lg border border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40 transition">
                    Create / Edit Role Permissions
                  </li>
                  <li className="p-3 rounded-lg border border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40 transition">
                    Manage Branch & Counters
                  </li>
                  <li className="p-3 rounded-lg border border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40 transition">
                    Review Complaints & Replies
                  </li>
                  <li className="p-3 rounded-lg border border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40 transition">
                    Configure Sessions Defaults
                  </li>
                  <li className="p-3 rounded-lg border border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40 transition">
                    System Settings
                  </li>
                </ul>
              </div>

              {/* Recent complaints */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Recent Complaints</h2>
                  <button type="button" className="text-sm text-blue-700 hover:underline">
                    View All
                  </button>
                </div>
                <ul className="mt-3 divide-y divide-gray-100">
                  {recentComplaints.map((c) => (
                    <li key={c.id} className="py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{c.subject}</p>
                          <p className="text-xs text-gray-500">
                            {c.id} • {c.branch}
                          </p>
                        </div>
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
                            c.status === "Resolved"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : c.status === "Investigating"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-blue-50 text-blue-700 border-blue-200",
                          ].join(" ")}
                        >
                          {c.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
