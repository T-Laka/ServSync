// src/pages/UserHome.jsx
import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/User/NavBar";
import {
  CalendarDays,
  Clock,
  ShieldCheck,
  Users2,
  ChevronRight,
  MapPin,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function UserHome() {
  const features = [
    {
      icon: CalendarDays,
      title: "Easy Online Booking",
      desc: "Pick a branch, choose a service, and confirm in seconds.",
    },
    {
      icon: Clock,
      title: "Real-time Queue",
      desc: "Track your token and wait time live—no surprises.",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Private",
      desc: "Your details and documents are protected with best practices.",
    },
    {
      icon: Users2,
      title: "Verified Staff",
      desc: "Get help from the right counter for your insurance type.",
    },
  ];

  const services = [
    "Motor Insurance – Renewal",
    "Life Insurance – Consultation",
    "Health Insurance – Claim",
    "Fire & Property – Policy",
    "Travel Insurance",
    "Third-party Claims",
  ];

  const branches = [
    { name: "Colombo HQ", meta: "Weekdays 8.30 AM – 4.00 PM" },
    { name: "Kandy", meta: "Weekdays 8.30 AM – 4.00 PM" },
    { name: "Galle", meta: "Weekdays 8.30 AM – 4.00 PM" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <NavBar />

      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(60rem_60rem_at_80%_-10%,theme(colors.blue.100/.35),transparent),radial-gradient(40rem_40rem_at_-10%_20%,theme(colors.indigo.100/.35),transparent)]" />
        <div className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur">
                ServSync • Smart Appointments & Queue
              </span>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Book insurance appointments & track your queue—without the hassle
              </h1>
              <p className="mt-3 text-slate-600">
                Reserve a time at your nearest branch, get a live token, and move through counters faster.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Book Appointment <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/doctors"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                >
                  Browse Services
                </Link>
              </div>

              <div className="mt-6 flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Instant confirmation
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Live queue updates
                </div>
              </div>
            </div>

            {/* Hero card */}
            <div className="relative">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Active Token</p>
                      <p className="mt-1 text-3xl font-semibold tracking-tight">A-023</p>
                      <p className="text-sm text-slate-500">Counter 3 • Est. wait ~ 07m</p>
                    </div>
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600/10">
                      <CalendarDays className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link
                    to="/queue"
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    View Queue
                  </Link>
                  <Link
                    to="/book"
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold hover:bg-slate-50"
                  >
                    My Appointments
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Why ServSync?</h2>
          <p className="mt-1 text-slate-600">Everything you need for a smooth branch visit.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-3 inline-flex rounded-xl bg-blue-50 p-2 ring-1 ring-blue-100">
                <f.icon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">How it works</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Choose service & branch",
                text: "Select your insurance type and the nearest branch.",
              },
              {
                step: "2",
                title: "Pick a time",
                text: "Select a convenient slot and confirm the appointment.",
              },
              {
                step: "3",
                title: "Track your token",
                text: "On the day, get a live token and follow the queue.",
              },
            ].map((s) => (
              <div key={s.step} className="relative rounded-xl border border-slate-200 p-4">
                <div className="absolute -top-3 left-4 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-2 text-xs font-semibold text-white">
                  {s.step}
                </div>
                <h3 className="mt-2 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link
              to="/book"
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:underline"
            >
              Book your slot <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular services */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">Popular services</h2>
            <p className="mt-1 text-slate-600">Quick links to frequently used services.</p>
          </div>
          <Link to="/services" className="text-sm font-semibold text-blue-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {services.map((s) => (
            <Link
              key={s}
              to="/book"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              {s}
            </Link>
          ))}
        </div>
      </section>

      {/* Branches */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Nearby branches</h2>
          <p className="mt-1 text-slate-600">Find a branch and walk in with confidence.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {branches.map((b) => (
            <div key={b.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{b.name}</h3>
                    <p className="text-sm text-slate-600">{b.meta}</p>
                  </div>
                </div>
                <Link
                  to="/book"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
                >
                  Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} ServSync. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
