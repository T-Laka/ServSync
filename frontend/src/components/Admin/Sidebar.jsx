import React from "react";
import { Menu, BarChart3, Users, Clock, MessageSquareMore } from "lucide-react";

export default function Sidebar({ open, mobileOpen, onToggle, onMobileClose, onSectionChange, activeSection }) {
  const navItems = [
    { id: "analytics", label: "Overview", icon: BarChart3 },
    { id: "users", label: "User Management", icon: Users },
    { id: "sessions", label: "Session Management", icon: Clock },
    // { id: "complaints", label: "Complaints", icon: MessageSquareMore },
  ];

  const linkClass = id =>
    [
      "group flex items-center gap-3 rounded-md px-3 py-2 transition-colors cursor-pointer",
      "text-zinc-700 hover:bg-blue-50 hover:text-blue-700",
      activeSection === id ? "bg-blue-50 text-blue-700 font-medium" : "",
    ].join(" ");

  return (
    <>
      <div
        onClick={onMobileClose}
        className={`fixed inset-0 bg-black/30 md:hidden transition-opacity ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={[
          "fixed md:relative top-0 h-full md:h-screen z-30",
          "transition-[transform,width] duration-300",
          "bg-white border-r border-zinc-200 shadow-sm",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          open ? "md:w-64" : "md:w-20",
          "w-64",
        ].join(" ")}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600" />
            {open && <span className="text-xl font-bold text-blue-600 hidden md:inline">ServSync</span>}
          </div>
          <button onClick={onToggle} className="hidden md:inline-flex p-2 rounded-md hover:bg-gray-100">
            <Menu className="h-5 w-5 text-zinc-700" />
          </button>
          <button onClick={onMobileClose} className="md:hidden inline-flex p-2 rounded-md hover:bg-gray-100">
            <Menu className="h-5 w-5 text-zinc-700" />
          </button>
        </div>

        <nav className="mt-2 flex flex-col gap-1 px-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { onSectionChange(id); onMobileClose?.(); }}
              className={linkClass(id)}
              title={!open ? label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {open && <span className="truncate">{label}</span>}
            </button>
          ))}
        </nav>

        <div className={`absolute bottom-0 left-0 right-0 p-4 text-[11px] text-zinc-400 hidden md:block ${open ? "" : "text-center"}`}>
          v0.1 • Admin
        </div>
      </aside>
    </>
  );
}
