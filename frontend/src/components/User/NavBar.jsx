// src/components/User/NavBar.jsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Plus } from "lucide-react";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Home", end: true },
    { to: "/book", label: "Book", end: false },
    { to: "/support", label: "Support" },
    { to: "/contact", label: "Contact" },
  ];

  const linkBase = "relative px-3 py-2 text-sm font-medium transition-colors";
  const linkIdle = "text-slate-700 hover:text-blue-600";
  const linkActive = "text-blue-600 after:absolute after:left-1/2 after:-bottom-0.5 after:h-0.5 after:w-6 after:-translate-x-1/2 after:rounded-full after:bg-blue-600";

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white">
            <Plus className="h-4 w-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">ServSync</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          {navItems.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right CTA (desktop) */}
        <div className="hidden md:block">
          <Link to="/signup" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Create account</Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden rounded-lg p-2 hover:bg-slate-100" onClick={() => setOpen(v => !v)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile drawer (backdrop + sheet) */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)} />
          <div className="fixed top-16 left-0 right-0 z-50 bg-white border-t border-slate-200 px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {navItems.map(({ to, label, end }) => (
                <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)} className={({ isActive }) => `block ${linkBase} rounded-lg px-3 py-3 ${isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'}`}>
                  {label}
                </NavLink>
              ))}
              <Link to="/signup" onClick={() => setOpen(false)} className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">Create account</Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
