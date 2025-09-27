import React, { useState, useRef, useEffect } from "react";
import { Menu, Search, LogOut } from "lucide-react";

/**
 * Props:
 * - onMenuClick (fn): for mobile, opens sidebar
 */
export default function TopBar({ onMenuClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between p-4 border-b bg-white border-zinc-200 shadow-sm sticky top-0 z-20">
      {/* Left: Menu button (mobile) + search */}
      <div className="flex items-center gap-3 w-full">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="p-2 rounded-md hover:bg-gray-100 md:hidden"
        >
          <Menu className="h-6 w-6 text-zinc-700" />
        </button>

        {/* Search bar */}
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-2.5 text-zinc-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right: User avatar + dropdown */}
      <div className="relative ml-4" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="focus:outline-none"
        >
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="User"
            className="h-10 w-10 rounded-full object-cover border"
          />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white border border-zinc-200 py-2 z-30">
            <button
              onClick={() => alert("Logging out…")}
              className="flex items-center gap-2 px-4 py-2 w-full text-sm text-zinc-700 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
