// src/pages/Support.jsx
export default function Support() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Support Center</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Browse FAQs or submit a complaint/feedback.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-5 shadow-sm">
          <h3 className="font-medium text-slate-800 dark:text-slate-100">Frequently Asked Questions</h3>
          <ul className="mt-3 list-disc pl-5 text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <li>How to book an appointment?</li>
            <li>What documents are required?</li>
            <li>How to reschedule?</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 p-5 shadow-sm">
          <h3 className="font-medium text-slate-800 dark:text-slate-100">Need more help?</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            You can submit a complaint or send feedback from here (to be integrated).
          </p>
          <button className="mt-3 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-2">
            Open Form
          </button>
        </div>
      </div>
    </section>
  );
}
