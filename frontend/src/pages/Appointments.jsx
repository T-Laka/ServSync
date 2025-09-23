// src/pages/Appointments.jsx
import { useState } from "react";

export default function Appointments() {
  const [form, setForm] = useState({
    branch: "",
    insuranceType: "",
    date: "",
    time: ""
  });

  return (
    <section className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Book an Appointment</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
        (Demo) No backend calls yet — use dummy options.
      </p>

      <form className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm mb-1 text-slate-600 dark:text-slate-300">Branch</label>
          <select
            value={form.branch}
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
            className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="">Select branch</option>
            <option value="colombo">Colombo</option>
            <option value="kandy">Kandy</option>
            <option value="galle">Galle</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-600 dark:text-slate-300">Insurance Type</label>
          <select
            value={form.insuranceType}
            onChange={(e) => setForm({ ...form, insuranceType: e.target.value })}
            className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="">Select type</option>
            <option value="life">Life</option>
            <option value="motor">Motor</option>
            <option value="health">Health</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-600 dark:text-slate-300">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-600 dark:text-slate-300">Time</label>
          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="button"
            onClick={() => alert("Demo: appointment captured in memory only")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Confirm Appointment
          </button>
        </div>
      </form>
    </section>
  );
}
