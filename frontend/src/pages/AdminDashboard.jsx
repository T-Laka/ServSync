import React from 'react'
import { useState } from "react";
import { Menu, Search } from "lucide-react";


export default function AdminDashboard() {
  const [open, setOpen] = useState(true);

  return (
     <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          open ? "w-64" : "w-20"
        } bg-white border-r shadow-sm transition-all duration-300`}
      >
        <div className="flex items-center justify-between p-4">
          <h1
            className={`text-xl font-bold text-blue-600 transition-all duration-300 ${
              !open && "hidden"
            }`}
          >
            BankDash
          </h1>
          <button onClick={() => setOpen(!open)}>
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-3">
          {[
            "Dashboard",
            "Transactions",
            "Accounts",
            "Investments",
            "Credit Cards",
            "Loans",
            "Services",
            "My Privileges",
            "Setting",
          ].map((item) => (
            <a
              key={item}
              href="#"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-md"
            >
              <span className="h-5 w-5 bg-gray-300 rounded-sm"></span>
              {open && <span>{item}</span>}
            </a>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
          <div className="relative w-1/3">
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for something"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <img
              src="https://randomuser.me/api/portraits/women/79.jpg"
              alt="profile"
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
        </header>

        {/* Main area (blank for now) */}
        <main className="flex-1 bg-gray-50 p-6">
          <h2 className="text-gray-500">Content goes here...</h2>
        </main>
      </div>
    </div>

  )
}
