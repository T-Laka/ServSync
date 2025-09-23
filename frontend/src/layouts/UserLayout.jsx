// src/layouts/UserLayout.jsx
import { Outlet } from "react-router-dom";
import NavBar from "../components/User/NavBar.jsx";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200/70 dark:border-slate-700/60 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} ServSync — NITF Smart Appointment & Queue System
      </footer>
    </div>
  );
}
