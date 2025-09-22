import React from "react";
import { NavLink } from "react-router-dom";
import { Menu, BarChart3, MessageSquareMore } from "lucide-react";

/**
 * Props:
 * - open (bool): desktop collapse state (true = wide, false = mini)
 * - mobileOpen (bool): mobile drawer state
 * - onToggle (fn): toggle for desktop collapse
 * - onMobileClose (fn): close the mobile drawer
 */
export default function Sidebar({ open, mobileOpen, onToggle, onMobileClose }) {
  /**
   * NAV STRUCTURE
   * Add more nav items here if needed
   */
  const navItems = [
    { label: "Overview", to: "/admin", icon: BarChart3, end: true },
    { label: "Staff Chat", to: "/admin/connect/chat", icon: MessageSquareMore },
    // { label: "New Page", to: "/admin/new", icon: YourIcon },
  ];

  // Reusable nav button styles (light mode only)
  const linkClass = ({ isActive }) =>
    [
      "group flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
      "text-zinc-700 hover:bg-blue-50 hover:text-blue-700",
      isActive ? "bg-blue-50 text-blue-700 font-medium" : "",
    ].join(" ");

  return (
    <>
      {/* ====== Mobile overlay (click to close) ====== */}
      <div
        onClick={onMobileClose}
        className={`fixed inset-0 bg-black/30 md:hidden transition-opacity ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      />

      {/* ====== Sidebar container ====== */}
      <aside
        className={[
          "fixed md:sticky top-0 h-full md:h-screen z-30",
          "transition-[transform,width] duration-300",
          "bg-white border-r border-zinc-200 shadow-sm",
          // Mobile slides in
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          // Desktop width collapses
          open ? "md:w-64" : "md:w-20",
          // Mobile fixed width
          "w-64",
        ].join(" ")}
        role="navigation"
        aria-label="Primary"
      >
        {/* ====== Brand & Toggles ====== */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600" />
            {/* Hide brand text when collapsed (desktop) */}
            <span
              className={`text-xl font-bold text-blue-600 ${
                !open ? "hidden md:hidden" : ""
              }`}
            >
              ServSync
            </span>
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggle}
            className="hidden md:inline-flex p-2 rounded-md hover:bg-gray-100"
            aria-label="Toggle sidebar width"
            title="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-zinc-700" />
          </button>

          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="md:hidden inline-flex p-2 rounded-md hover:bg-gray-100"
            aria-label="Close sidebar"
            title="Close"
          >
            <Menu className="h-5 w-5 text-zinc-700" />
          </button>
        </div>

        {/* ====== Nav list ====== */}
        <nav className="mt-2 flex flex-col gap-1 px-2">
          {navItems.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={linkClass}
              title={!open ? label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {/* Show label only when expanded on desktop */}
              <span className={`truncate md:${open ? "inline" : "hidden"}`}>
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* ====== Footer/version ====== */}
        <div
          className={`mt-auto p-4 text-[11px] text-zinc-400 hidden md:block ${
            open ? "" : "text-center"
          }`}
        >
          v0.1 • Admin
        </div>
      </aside>
    </>
  );
}
