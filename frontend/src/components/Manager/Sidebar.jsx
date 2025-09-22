import React from "react";
import { NavLink } from "react-router-dom";
import { Menu, BarChart3, MessageSquareMore, Settings } from "lucide-react";

/**
 * Props:
 * - open (bool): desktop collapse state (true = wide, false = mini)
 * - mobileOpen (bool): mobile drawer state
 * - onToggle (fn): toggle for desktop collapse
 * - onMobileClose (fn): close the mobile drawer
 */
export default function Sidebar({ open, mobileOpen, onToggle, onMobileClose }) {
  // Your links (add more if you want; labels show correctly now)
  const navItems = [
    { label: "Overview", to: "/admin", icon: BarChart3, end: true },
    { label: "Staff Chat", to: "/admin/connect/chat", icon: MessageSquareMore },
    { label: "Complaints", to: "/Manager/connect/complaints", icon: MessageSquareMore },
    { label: "Settings", to: "/admin/settings", icon: Settings },
  ];

  const linkClass = ({ isActive }) =>
    [
      "group flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
      "text-zinc-700 hover:bg-blue-50 hover:text-blue-700",
      isActive ? "bg-blue-50 text-blue-700 font-medium" : "",
    ].join(" ");

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onMobileClose}
        className={`fixed inset-0 bg-black/30 md:hidden transition-opacity ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      />

      {/* Sidebar */}
      <aside
        role="navigation"
        aria-label="Admin"
        className={[
          "fixed md:sticky top-0 h-full md:h-screen z-30",
          "transition-[transform,width] duration-300",
          "bg-white border-r border-zinc-200 shadow-sm",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          open ? "md:w-64" : "md:w-20",
          "w-64 overflow-y-auto",
        ].join(" ")}
      >
        {/* Brand & toggles */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600" />
            {/* Desktop brand: show when expanded */}
            <span className={`text-xl font-bold text-blue-600 hidden md:inline ${open ? "" : "md:hidden"}`}>
              ServSync
            </span>
            {/* Mobile brand */}
            <span className="text-xl font-bold text-blue-600 md:hidden">ServSync</span>
          </div>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={onToggle}
            className="hidden md:inline-flex p-2 rounded-md hover:bg-gray-100"
            aria-label="Toggle sidebar width"
            aria-expanded={open}
            title="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-zinc-700" />
          </button>

          {/* Mobile close */}
          <button
            type="button"
            onClick={onMobileClose}
            className="md:hidden inline-flex p-2 rounded-md hover:bg-gray-100"
            aria-label="Close sidebar"
            title="Close"
          >
            <Menu className="h-5 w-5 text-zinc-700" />
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-2 flex flex-col gap-1 px-2">
          {navItems.map(({ label, to, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass} title={!open ? label : undefined}>
              <Icon className="h-5 w-5 shrink-0" />
              {/* Desktop labels; hidden when collapsed */}
              <span className={`truncate hidden md:inline ${open ? "" : "md:hidden"}`}>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer/version */}
        <div className={`mt-auto p-4 text-[11px] text-zinc-400 hidden md:block ${open ? "" : "text-center"}`}>
          v0.1 • Admin
        </div>
      </aside>
    </>
  );
}
