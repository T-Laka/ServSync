import React from "react";
import { Menu, BarChart3, MessageSquareMore, Settings } from "lucide-react";

/**
 * Props:
 * - open, mobileOpen, onToggle, onMobileClose (layout)
 * - onSectionChange (id => void)
 * - activeSection (string)
 */
export default function Sidebar({
  open,
  mobileOpen,
  onToggle,
  onMobileClose,
  onSectionChange,
  activeSection,
}) {
  const navItems = [
    { id: "overview",  label: "Overview",   icon: BarChart3 },
    { id: "feedback",  label: "Feedback",   icon: MessageSquareMore },
    { id: "complaints",label: "Complaints", icon: MessageSquareMore },
    { id: "claims",label: "Claims", icon: MessageSquareMore },
    { id: "settings",  label: "Settings",   icon: Settings },
  ];

  const linkClass = (id) =>
    [
      "group flex items-center gap-3 rounded-md px-3 py-2 transition-colors cursor-pointer",
      "text-zinc-700 hover:bg-blue-50 hover:text-blue-700",
      activeSection === id ? "bg-blue-50 text-blue-700 font-medium" : "",
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

      <aside
        role="navigation"
        aria-label="Manager"
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
            <span className={`text-xl font-bold text-blue-600 hidden md:inline ${open ? "" : "md:hidden"}`}>
              ServSync
            </span>
            <span className="text-xl font-bold text-blue-600 md:hidden">ServSync</span>
          </div>

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

        {/* Nav (buttons, not NavLink) */}
        <nav className="mt-2 flex flex-col gap-1 px-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => { onSectionChange(id); onMobileClose?.(); }}
              className={linkClass(id)}
              title={!open ? label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className={`truncate hidden md:inline ${open ? "" : "md:hidden"}`}>{label}</span>
            </button>
          ))}
        </nav>

        {/* Footer/version (fixes earlier className bug) */}
        <div className={`mt-auto p-4 text-[11px] text-zinc-400 hidden md:block ${open ? "" : "text-center"}`}>
          v0.1 • Manager
        </div>
      </aside>
    </>
  );
}
