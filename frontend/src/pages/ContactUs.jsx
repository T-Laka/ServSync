// src/pages/ContactUs.jsx
export default function ContactUs() {
  return (
    <section className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Contact Us</h2>

      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-slate-600 dark:text-slate-300">Name</label>
            <input className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-900" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-600 dark:text-slate-300">Email</label>
            <input type="email" className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-900" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-600 dark:text-slate-300">Message</label>
            <textarea rows="4" className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-900" />
          </div>
          <button type="button" onClick={() => alert("Demo submit")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Send
          </button>
        </form>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <h3 className="font-medium text-slate-800 dark:text-slate-100">Head Office</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            555, Galle Road, Colombo 03<br/>Hotline: 1919<br/>Email: info@nitf.lk
          </p>
          <div className="mt-4 h-56 w-full rounded-lg bg-slate-100 dark:bg-slate-900 grid place-items-center text-slate-500">
            Map placeholder
          </div>
        </div>
      </div>
    </section>
  );
}
