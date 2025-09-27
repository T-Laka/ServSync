// src/pages/Home.jsx
export default function Home() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          Welcome to ServSync
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Book appointments, track queues in real-time, and manage your insurance services with ease.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <a href="/book" className="rounded-2xl bg-white dark:bg-slate-800 p-5 shadow-sm hover:shadow transition">
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Make an Appointment</h3>
          <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">
            Choose branch, insurance type, and time slot.
          </p>
        </a>
        <a href="/support" className="rounded-2xl bg-white dark:bg-slate-800 p-5 shadow-sm hover:shadow transition">
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Support</h3>
          <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">
            FAQs, complaints & feedback.
          </p>
        </a>
        <a href="/contact" className="rounded-2xl bg-white dark:bg-slate-800 p-5 shadow-sm hover:shadow transition">
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Contact Us</h3>
          <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">
            Reach NITF branches and hotlines.
          </p>
        </a>
      </div>
    </section>
  );
}
